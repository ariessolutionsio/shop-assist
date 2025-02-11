import { useMemo, useState } from 'react';

import { useParams } from 'react-router';
import {
  TFetchProductBySkuQuery,
  TMyCartUpdateAction,
} from '../../../types/generated/ctp';
import {
  useCartDetailsFetcher,
  useUpdateCart,
} from '../../../hooks/use-carts-connector';
import { INCREASE } from '../constants';

/**
 * A custom hook for managing shopping cart operations and state.
 *
 * @returns {Object} An object containing the following:
 *
 * @property {Function} setProducts - Function to set product results
 * @property {Array} products - Array of product results
 * @property {Function} handleUpdateCart - Updates cart with given actions
 * @property {Function} handleChangeLineItemQuantity - Updates quantity of a specific line item
 * @property {Function} handleAddLineItem - Adds a new line item to cart using SKU
 * @property {Function} handleAddProduct - Smart add product function (increases quantity if exists, adds new if doesn't)
 * @property {Function} updateItemQuantity - Updates item quantity by increment/decrement
 * @property {Function} resetUpdateCartMutationResult - Resets the cart mutation result
 * @property {Function} handleAddDiscount - Adds a discount code to the cart
 * @property {Function} handleRemoveDiscount - Removes a discount code from the cart
 * @property {boolean} loadingUpdateCart - Loading state for cart updates
 * @property {Error|null} errorUpdateCart - Error state for cart updates
 * @property {Object|null} dataUpdateCart - Data returned from cart update
 * @property {boolean} loadingCartDetails - Loading state for cart details
 * @property {Object|null} cartDetails - Current cart details
 * @property {Error|null} errorCartDetails - Error state for cart details
 * @property {Array} items - Array of line items in the cart
 *
 * @example
 * const {
 *   handleAddProduct,
 *   handleAddDiscount,
 *   updateItemQuantity,
 *   cartDetails,
 *   items
 * } = useCartDetails();
 *
 * // Add a product to cart
 * await handleAddProduct('SKU123');
 *
 * // Add a discount code
 * await handleAddDiscount('SUMMER20');
 *
 * // Update item quantity
 * await updateItemQuantity(lineItem, 'increase');
 */
export const useCartDetails = () => {
  const [products, setProducts] =
    useState<TFetchProductBySkuQuery['products']['results']>();
  const params = useParams<{ id: string }>();
  const { loading, error, cart } = useCartDetailsFetcher(params.id);
  const {
    updateCart,
    resetUpdateCartMutationResult,
    loadingUpdateCart,
    errorUpdateCart,
    dataUpdateCart,
  } = useUpdateCart(params.id, cart?.version ?? 0, []);

  const items = useMemo(() => (cart && cart.lineItems) || [], [cart]);

  const handleUpdateCart = async (
    actions: Array<TMyCartUpdateAction> | TMyCartUpdateAction
  ) => {
    try {
      await updateCart({
        cartId: params.id,
        version: cart?.version || 0,
        actions,
      });
    } catch (error) {
      console.error('Error updating cart.', error);
    }
  };

  const handleChangeLineItemQuantity = async (
    lineItem: { id: string; quantity: number },
    quantity: number
  ) => {
    const actions = [
      {
        changeLineItemQuantity: {
          lineItemId: lineItem.id,
          quantity: quantity,
        },
      },
    ];
    await handleUpdateCart(actions);
  };

  const handleAddLineItem = async (sku: string) => {
    const actions = [
      {
        addLineItem: {
          sku: sku,
          quantity: 1,
        },
      },
    ];
    await handleUpdateCart(actions);
  };

  const handleAddDiscount = async (code: string) => {
    const actions = [
      {
        addDiscountCode: {
          code: code,
        },
      },
    ];
    await handleUpdateCart(actions);
  };

  const handleRemoveDiscount = async (id: string) => {
    const actions = [
      {
        removeDiscountCode: {
          discountCode: {
            typeId: 'discount-code',
            id: id,
          },
        },
      },
    ];
    await handleUpdateCart(actions);
  };

  const handleAddProduct = async (sku: string) => {
    const existingLineItem = cart?.lineItems.find(
      (item) => item?.variant?.sku === sku
    );
    existingLineItem
      ? await handleChangeLineItemQuantity(
          existingLineItem,
          existingLineItem.quantity + 1
        )
      : sku && (await handleAddLineItem(sku));
  };

  const updateItemQuantity = async (
    lineItem: { id: string; quantity: number },
    quantity: string
  ) => {
    const updatedQuantity =
      quantity === INCREASE ? lineItem.quantity + 1 : lineItem.quantity - 1;
    handleChangeLineItemQuantity(lineItem, updatedQuantity);
  };

  return {
    setProducts,
    products,
    handleUpdateCart,
    handleChangeLineItemQuantity,
    handleAddLineItem,
    handleAddProduct,
    updateItemQuantity,
    resetUpdateCartMutationResult,
    handleAddDiscount,
    handleRemoveDiscount,
    loadingUpdateCart,
    errorUpdateCart,
    dataUpdateCart,
    loadingCartDetails: loading,
    cartDetails: cart,
    errorCartDetails: error,
    items,
  };
};
