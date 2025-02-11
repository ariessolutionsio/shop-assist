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
