import { formatMoneyCurrency } from '../../../helpers';
import { TMoney } from '../../../types/generated/ctp';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';

import messages from '../messages';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useCartDetails } from '../hooks/use-cart-details';

const ZERO_MONEY_AMOUNT_FALLBACK: TMoney = {
  type: 'centPrecision',
  currencyCode: 'USD',
  centAmount: 0, // Zero USD
  fractionDigits: 2,
};

const PriceSummary = () => {
  const { cartDetails } = useCartDetails();
  const { taxedPrice, totalPrice, shippingInfo, discountOnTotalPrice } =
    cartDetails || {};

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages ?? [],
  }));

  const itemSubtotal: TMoney = {
    type: 'centPrecision',
    currencyCode: totalPrice?.currencyCode ?? NO_VALUE_FALLBACK,
    centAmount:
      cartDetails?.lineItems.reduce(
        (acc, lineItem) => acc + (lineItem?.totalPrice?.centAmount ?? 0),
        0
      ) ?? 0,
    fractionDigits: totalPrice?.fractionDigits ?? 0,
  };

  const shippingDiscount = shippingInfo?.discountedPrice?.value;

  return (
    <Card type="raised" theme="light" insetScale="m">
      <Spacings.Stack scale="m">
        <Text.Headline as="h2" intlMessage={messages.cartSummaryLabel} />
        <Spacings.Stack scale="xs">
          {/* SUBTOTAL */}
          <Spacings.Inline scale="s" justifyContent="space-between">
            <Text.Body
              isBold={true}
              intlMessage={messages.cartItemsSubtotalLabel}
            />
            <Text.Body>
              {formatMoneyCurrency(
                itemSubtotal,
                dataLocale || projectLanguages[0]
              )}
            </Text.Body>
          </Spacings.Inline>
          {/* TAXES */}
          {taxedPrice?.totalTax && (
            <Spacings.Inline scale="s" justifyContent="space-between">
              <Text.Body
                isBold={true}
                intlMessage={messages.cartTotalTaxLabel}
              />
              <Text.Body>
                {formatMoneyCurrency(
                  taxedPrice?.totalTax as TMoney,
                  dataLocale || projectLanguages[0]
                )}
              </Text.Body>
            </Spacings.Inline>
          )}
          {/* SHIPPING */}
          <Spacings.Inline scale="s" justifyContent="space-between">
            <Text.Body
              isBold={true}
              intlMessage={messages.cartDetailsShipping}
            />
            <Spacings.Inline>
              <Text.Body
                tone={shippingDiscount ? 'negative' : 'inherit'}
                isStrikethrough={!!shippingDiscount}
              >
                {formatMoneyCurrency(
                  (shippingInfo?.price as TMoney) ?? ZERO_MONEY_AMOUNT_FALLBACK,
                  dataLocale || projectLanguages[0]
                )}{' '}
              </Text.Body>
              {shippingDiscount && (
                <Text.Body>
                  {formatMoneyCurrency(
                    shippingDiscount ?? ZERO_MONEY_AMOUNT_FALLBACK,
                    dataLocale || projectLanguages[0]
                  )}
                </Text.Body>
              )}
            </Spacings.Inline>
          </Spacings.Inline>
          {/* DISCOUNTS */}
          <Spacings.Inline scale="s" justifyContent="space-between">
            <Text.Body
              isBold={true}
              intlMessage={messages.cartDiscountslLabel}
            />
            <Text.Body
              tone={
                discountOnTotalPrice?.discountedAmount ? 'negative' : 'inherit'
              }
            >
              {/* MINUS SIGN */}
              {discountOnTotalPrice?.discountedAmount && '-'}
              {formatMoneyCurrency(
                discountOnTotalPrice?.discountedAmount ??
                  ZERO_MONEY_AMOUNT_FALLBACK,
                dataLocale || projectLanguages[0]
              )}
            </Text.Body>
          </Spacings.Inline>
        </Spacings.Stack>
        {/* TOTAL */}
        <Spacings.Inline scale="s" justifyContent="space-between">
          <Text.Subheadline
            as="h4"
            tone="primary"
            isBold
            intlMessage={messages.cartTotalLabel}
          />
          {totalPrice && (
            <Text.Subheadline as="h4" tone="primary">
              {formatMoneyCurrency(
                totalPrice as TMoney,
                dataLocale || projectLanguages[0]
              )}
            </Text.Subheadline>
          )}
        </Spacings.Inline>
      </Spacings.Stack>
    </Card>
  );
};

export default PriceSummary;
