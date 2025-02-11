// External imports
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { InfoModalPage } from '@commercetools-frontend/application-components';
import Grid from '@commercetools-uikit/grid';

// Local imports
import messages from './messages';
import DropdownInputField from './components/dropdown-input-field';
import { useCartDetails } from './hooks/use-cart-details';
import CartLineItem from './components/cart-line-item';
import PriceSummary from './components/price-summary';
import ShippingSummary from './components/shipping-summary';
import { TLineItem } from '../../types/generated/ctp';
import DiscountsSummary from './components/discounts-summary';
import Badge from '../badge';

const CartDetails = () => {
  const intl = useIntl();
  const { goBack } = useHistory();
  const {
    updateItemQuantity,
    handleChangeLineItemQuantity,
    loadingCartDetails,
    errorCartDetails,
    cartDetails,
    items,
  } = useCartDetails();

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages ?? [],
  }));

  const isLoading = loadingCartDetails;

  const structureItemName = (item: TLineItem) => {
    if (!item?.nameAllLocales) return '';
    return formatLocalizedString(
      {
        name: transformLocalizedFieldToLocalizedString(
          item.nameAllLocales ?? []
        ),
      },
      {
        key: 'name',
        locale: dataLocale,
        fallbackOrder: projectLanguages,
        fallback: NO_VALUE_FALLBACK,
      }
    );
  };

  if (!cartDetails?.id) return <LoadingSpinner />;

  return (
    <InfoModalPage
      isOpen={true}
      title={`${intl.formatMessage(messages.cartKeyLabel)}: ${cartDetails?.id}`}
      topBarCurrentPathLabel={cartDetails?.id}
      topBarPreviousPathLabel={intl.formatMessage(messages.backToCartsList)}
      onClose={goBack}
    >
      {isLoading && (
        <Spacings.Stack alignItems="center">
          <LoadingSpinner />
        </Spacings.Stack>
      )}
      <Spacings.Stack scale="xl">
        {errorCartDetails && (
          <ContentNotification type="error">
            <Text.Body intlMessage={messages.cartDetailsErrorMessage} />
          </ContentNotification>
        )}
        {cartDetails && (
          <>
            <Spacings.Inline justifyContent="space-between">
              <DropdownInputField />
              <Badge cartStatus={cartDetails.cartState} />
            </Spacings.Inline>
            <Grid
              gridGap="20px"
              gridRowGap="20px"
              gridAutoFlow="row"
              gridTemplateColumns="8fr 4fr"
            >
              <Grid.Item>
                <Spacings.Stack scale="m">
                  {items?.map((item, idx) => (
                    <CartLineItem
                      key={`idx-${item?.id}-${idx}`}
                      id={`idx-${item?.id}-${idx}`}
                      removeItem={() => handleChangeLineItemQuantity(item, 0)}
                      updateItemQuantity={(quantity: string) =>
                        updateItemQuantity(item, quantity)
                      }
                      itemName={structureItemName(item)}
                      imageUrl={item?.variant?.images[0]?.url ?? undefined}
                      sku={item?.variant?.sku ?? ''}
                      quantity={item.quantity}
                      price={item.price}
                      totalPrice={
                        item?.totalPrice ?? {
                          type: 'centPrecision',
                          currencyCode: cartDetails?.totalPrice?.currencyCode,
                          centAmount: 0,
                          fractionDigits:
                            cartDetails?.totalPrice?.fractionDigits,
                        }
                      }
                    />
                  ))}
                </Spacings.Stack>
              </Grid.Item>
              <Grid.Item>
                <Spacings.Stack scale="m">
                  <PriceSummary />
                  <DiscountsSummary />
                  <ShippingSummary />
                </Spacings.Stack>
              </Grid.Item>
            </Grid>
          </>
        )}
      </Spacings.Stack>
    </InfoModalPage>
  );
};
CartDetails.displayName = 'Cart Details';

export default CartDetails;
