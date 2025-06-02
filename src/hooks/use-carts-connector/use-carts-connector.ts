/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import { type ApolloError } from '@apollo/client';
import {
  useMcQuery,
  useMcMutation,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type { TDataTableSortingState } from '@commercetools-uikit/hooks';
import type {
  TFetchCartDetailsQuery,
  TFetchCartDetailsQueryVariables,
  TFetchCartsQuery,
  TFetchCartsQueryVariables,
  TUpdateCartMutationVariables,
  TUpdateCartMutation,
  TCart,
} from '../../types/generated/ctp';
import FetchCartsQuery from './fetch-carts.ctp.graphql';
import FetchCartDetailsQuery from './fetch-cart-details.ctp.graphql';
import UpdateCartMutation from './update-cart.ctp.graphql';
import { LABEL_KEYS } from '../../components/carts/constants';

type PaginationAndSortingProps = {
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
  where?: string;
  labelKey?: string;
};

type TUseCartsFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  cartsPaginatedResult?: TCart[];
  total?: number;
  error?: ApolloError;
  loading: boolean;
};

function buildSearchQuery(labelKey: string, sanitizedTerm: string): string | null {
  const isEmail = sanitizedTerm.includes('@');

  if (labelKey === LABEL_KEYS.ALL_FIELDS) {
    if (isEmail) {
      return `customerEmail="${sanitizedTerm}"`;
    }
    return [
      `id="${sanitizedTerm}"`,
      `customerEmail="${sanitizedTerm}"`,
      `shippingAddress(firstName="${sanitizedTerm}")`,
      `shippingAddress(lastName="${sanitizedTerm}")`,
      `shippingAddress(phone="${sanitizedTerm}")`,
      `billingAddress(firstName="${sanitizedTerm}")`,
      `billingAddress(lastName="${sanitizedTerm}")`,
      `billingAddress(phone="${sanitizedTerm}")`,
    ].join(' or ');
  }

  switch (labelKey) {
    case LABEL_KEYS.CART_ID:
      return `id="${sanitizedTerm}"`;
    case LABEL_KEYS.CUSTOMER_EMAIL:
      return `customerEmail="${sanitizedTerm}"`;
    case LABEL_KEYS.SHIPPING_ADDRESS_NAME:
      return `shippingAddress(firstName="${sanitizedTerm}") or shippingAddress(lastName="${sanitizedTerm}")`;
    case LABEL_KEYS.SHIPPING_ADDRESS_PHONE:
      return `shippingAddress(phone="${sanitizedTerm}")`;
    case LABEL_KEYS.BILLING_ADDRESS_NAME:
      return `billingAddress(firstName="${sanitizedTerm}") or billingAddress(lastName="${sanitizedTerm}")`;
    case LABEL_KEYS.BILLING_ADDRESS_PHONE:
      return `billingAddress(phone="${sanitizedTerm}")`;
    default:
      return null;
  }
}

export const useCartsFetcher: TUseCartsFetcher = ({
  page,
  perPage,
  tableSorting,
  where,
  labelKey,
}) => {
   // TODO: Sanitize email if desired via RegEx or util. By now we only need to asses that if a
  // '@' is present, the id "where" filter should not be used, to avoid errors on ALL_FIELDS search.
  const sanitizedWhere = (where ?? '').trim();
  const whereFilter = sanitizedWhere.length > 0 && labelKey ? buildSearchQuery(labelKey, sanitizedWhere) : null;

  const { data, error, loading } = useMcQuery<
    TFetchCartsQuery,
    TFetchCartsQueryVariables
  >(FetchCartsQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
      where: whereFilter,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  
  return {
    cartsPaginatedResult: data?.carts?.results as TCart[],
    total: data?.carts?.total,
    error,
    loading,
  };
};

type TUseCartDetailsFetcher = (cartId: string) => {
  cart?: TCart;
  error?: ApolloError;
  loading: boolean;
};

export const useCartDetailsFetcher: TUseCartDetailsFetcher = (cartId) => {
  const { data, error, loading } = useMcQuery<
    TFetchCartDetailsQuery,
    TFetchCartDetailsQueryVariables
  >(FetchCartDetailsQuery, {
    variables: {
      cartId,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    cart: data?.cart as TCart,
    error,
    loading,
  };
};

type TUseUpdateCart = (
  cartId: string,
  version: number,
  actions: Array<
    | { addLineItem?: { sku: string; quantity: number } }
    | { changeLineItemQuantity?: { lineItemId: string; quantity: number } }
  >
) => {
  updateCart: (variables: TUpdateCartMutationVariables) => Promise<void>;
  errorUpdateCart?: ApolloError;
  loadingUpdateCart: boolean;
  dataUpdateCart: TUpdateCartMutation | null | undefined;
  resetUpdateCartMutationResult: () => void;
};

export const useUpdateCart: TUseUpdateCart = () => {
  const [updateCartMutation, { data, loading, error, reset }] = useMcMutation<
    TUpdateCartMutation,
    TUpdateCartMutationVariables
  >(UpdateCartMutation);

  const updateCart = async (variables: TUpdateCartMutationVariables) => {
    await updateCartMutation({
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
      variables,
    });
  };

  return {
    updateCart,
    resetUpdateCartMutationResult: reset,
    dataUpdateCart: data,
    errorUpdateCart: error,
    loadingUpdateCart: loading,
  };
};
