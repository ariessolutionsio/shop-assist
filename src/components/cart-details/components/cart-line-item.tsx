import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import IconButton from '@commercetools-uikit/icon-button';
import { useIntl } from 'react-intl';
import { designTokens } from '@commercetools-uikit/design-system';

import {
  BinFilledIcon,
  MinimizeIcon,
  PlusBoldIcon,
} from '@commercetools-uikit/icons';
import { formatMoneyCurrency } from '../../../helpers';
import { TMoney, TProductPrice } from '../../../types/generated/ctp';
import { DECREASE, INCREASE } from '../constants';
import messages from '../messages';

type TLineItemProps = {
  id: string;
  itemName: string;
  imageUrl?: string;
  sku: string;
  quantity: number;
  price?: TProductPrice;
  totalPrice: TMoney;
  removeItem: () => void;
  updateItemQuantity: (quantity: string) => void;
};

const CartLineItem = ({
  id,
  itemName,
  imageUrl,
  sku,
  quantity,
  totalPrice,
  price,
  removeItem,
  updateItemQuantity,
}: TLineItemProps) => {
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages ?? [],
  }));

  const intl = useIntl();

  return (
    <div
      key={id}
      style={{
        border: '1px solid',
        borderRadius: designTokens.borderRadius4,
        borderColor: designTokens.colorNeutral90,
        background: designTokens.colorNeutral98,
        padding: '1rem',
      }}
    >
      <Spacings.Inline justifyContent="space-between" alignItems="flex-start">
        {/* IMG, NAME, SKU */}
        <Spacings.Inline>
          <img
            src={imageUrl}
            alt={sku}
            width="110"
            height="90"
            style={{
              backgroundColor: designTokens.colorPrimary95,
              color: designTokens.colorInfo40,
              textAlign: 'center',
              lineHeight: '90px',
              marginRight: '10px',
            }}
          />
          <Spacings.Stack scale="xs">
            <Text.Headline as="h2">{itemName}</Text.Headline>
            <Text.Subheadline tone="primary" as="h5">
              {intl.formatMessage(messages.cartDetailsSku)}: {sku}
            </Text.Subheadline>
          </Spacings.Stack>
        </Spacings.Inline>

        <Spacings.Inline justifyContent="space-around" scale="xxxl">
          {/* UNIT PRICE & DISCOUNTED PRICE */}
          <Spacings.Stack scale="xs" alignItems="center">
            <Text.Detail intlMessage={messages.cartDetailsUnitPrice} />
            {/* IF DISCOUNTED PRICE, RENDER ORIGINAL PRICE */}
            {price?.value && price.discounted && (
              <Text.Body isStrikethrough={true} tone="negative">
                {formatMoneyCurrency(
                  price.value,
                  dataLocale || projectLanguages[0]
                )}
              </Text.Body>
            )}
            {/* IF NO DISCOUNTED PRICE, RENDER OG ONLY */}
            <Text.Body>
              {price?.discounted
                ? formatMoneyCurrency(
                    price?.discounted.value,
                    dataLocale || projectLanguages[0]
                  )
                : price?.value &&
                  formatMoneyCurrency(
                    price?.value,
                    dataLocale || projectLanguages[0]
                  )}
            </Text.Body>
          </Spacings.Stack>

          {/* QUANTITY */}
          <Spacings.Stack alignItems="center">
            <Text.Detail intlMessage={messages.cartDetailsQuantity} />
            <Spacings.Inline scale="m" alignItems="center">
              <IconButton
                label="Increase quantity"
                icon={<MinimizeIcon />}
                type="button"
                size="medium"
                onClick={() => updateItemQuantity(DECREASE)}
              />
              <Text.Body>{quantity}</Text.Body>
              <IconButton
                label="Decrease quantity"
                icon={<PlusBoldIcon />}
                type="button"
                size="medium"
                onClick={() => updateItemQuantity(INCREASE)}
              />
            </Spacings.Inline>
          </Spacings.Stack>

          {/* TOTAL PRICE */}
          <Spacings.Stack scale="m" alignItems="center">
            <Text.Detail intlMessage={messages.cartDetailsTotalPrice} />
            <Text.Headline as="h3">
              {formatMoneyCurrency(
                totalPrice,
                dataLocale || projectLanguages[0]
              )}
            </Text.Headline>
          </Spacings.Stack>

          {/* REMOVE FROM CART BUTTON */}

          <IconButton
            label="Remove from cart"
            icon={<BinFilledIcon />}
            type="button"
            size="big"
            onClick={removeItem}
          />
        </Spacings.Inline>
      </Spacings.Inline>
    </div>
  );
};

export default CartLineItem;
