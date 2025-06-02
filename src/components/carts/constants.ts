export const dataTableColumns = [
  { key: 'id', label: 'ID', isSortable: true },
  {
    key: 'customerEmail',
    label: 'Customer email',
    isSortable: true,
  },
  {
    key: 'cartState',
    label: 'Cart state',
    isSortable: true,
    disableResizing: true,
  },
  {
    key: 'customerGroup',
    label: 'Customer group',
    isSortable: false,
  },
  {
    key: 'totalLineItemQuantity',
    label: '# Items',
    isSortable: false,
  },
  {
    key: 'totalPrice',
    label: 'Total price',
    isSortable: false,
  },
  {
    key: 'origin',
    label: 'Origin',
    isSortable: true,
  },
  { key: 'key', label: 'Key', isSortable: true },
  {
    key: 'anonymousId',
    label: 'Anonymous ID',
    isSortable: true,
  },
  {
    key: 'businessUnit',
    label: 'Business unit',
    isSortable: true,
  },
  {
    key: 'store',
    label: 'Store',
    isSortable: false,
  },
];

export const initialDataTableColumns = [
  { key: 'id', label: 'ID', isSortable: true },
  {
    key: 'customerEmail',
    label: 'Customer email',
    isSortable: true,
  },
  {
    key: 'cartState',
    label: 'Cart state',
    isSortable: true,
    disableResizing: true,
  },
  {
    key: 'totalLineItemQuantity',
    label: '# Items',
    isSortable: false,
  },
  {
    key: 'totalPrice',
    label: 'Total price',
    isSortable: false,
  },
  {
    key: 'origin',
    label: 'Origin',
    isSortable: true,
  },
  {
    key: 'store',
    label: 'Store',
    isSortable: false,
  },
];

export enum LABEL_KEYS {
  CART_ID = 'cartId',
  CUSTOMER_EMAIL = 'customerEmail',
  ALL_FIELDS = 'allFields',
  SHIPPING_ADDRESS_NAME = 'shippingAddressName',
  SHIPPING_ADDRESS_PHONE = 'shippingAddressPhone',
  BILLING_ADDRESS_NAME = 'billingAddressName',
  BILLING_ADDRESS_PHONE = 'billingAddressPhone'
}
