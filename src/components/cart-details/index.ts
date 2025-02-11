import { lazy } from 'react';

const CartDetails = lazy(
  () => import('./cart-details' /* webpackChunkName: "cart-details" */)
);

export default CartDetails;
