import messages from '../messages';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import { useIntl } from 'react-intl';
import { useCartDetails } from '../hooks/use-cart-details';

const ShippingSummary = () => {
  const { cartDetails } = useCartDetails();

  const {
    firstName,
    lastName,
    streetName,
    streetNumber,
    city,
    state,
    postalCode,
  } = cartDetails?.shippingAddress ?? {};

  const intl = useIntl();

  const shippingMethod = cartDetails?.shippingInfo?.shippingMethodName;

  return (
    <Card type="raised" theme="light" insetScale="m">
      <Spacings.Stack scale="l">
        <Spacings.Stack scale="xs">
          <Text.Headline as="h2" intlMessage={messages.cartShippingLabel} />
          <Text.Subheadline as="h5" tone="tertiary">
            {shippingMethod ??
              intl.formatMessage(messages.cartDetailsNoShippingMethod)}
          </Text.Subheadline>
        </Spacings.Stack>
        {cartDetails?.shippingAddress ? (
          <Text.Wrap>
            <Text.Body>{`${firstName} ${lastName}`}</Text.Body>
            <Text.Body>{`${streetNumber} ${streetName}`}</Text.Body>
            <Text.Body>{`${city}, ${state} ${postalCode}`}</Text.Body>
          </Text.Wrap>
        ) : (
          <Text.Body>
            {intl.formatMessage(messages.cartDetailsNoShippinAddress)}
          </Text.Body>
        )}
      </Spacings.Stack>
    </Card>
  );
};

export default ShippingSummary;
