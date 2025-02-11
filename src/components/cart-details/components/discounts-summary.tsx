import messages from '../messages';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import {
  BinFilledIcon,
  CheckActiveIcon,
  ErrorIcon,
} from '@commercetools-uikit/icons';
import { designTokens } from '@commercetools-uikit/design-system';
import { useCartDetails } from '../hooks/use-cart-details';
import IconButton from '@commercetools-uikit/icon-button';
import DiscountCodeInput from './discount-code-input';
import Tooltip from '@commercetools-uikit/tooltip';
import { TDiscountCodeState } from '../../../types/generated/ctp';

const DiscountsSummary = () => {
  const { handleRemoveDiscount, handleAddDiscount, cartDetails } =
    useCartDetails();

  const handleRemovePromoCode = (code: string) => {
    handleRemoveDiscount(code);
  };

  const discountCodes = cartDetails?.discountCodes;

  const hasDiscountsApplied = discountCodes && discountCodes.length > 0;

  //TODO: Implement/extract notifications to ADD/REMOVE promo codes, for which ctp types need to be
  // updated via package.json script. That update appears to include additional type changes that
  // where pending in the project and might need separate work to address discrepancies in other sections.

  // const showNotification = useShowNotification();

  // useEffect(() => {
  //   if (dataUpdateCart?.updateCart?.discountCodes) {
  //     showNotification({
  //       kind: NOTIFICATION_KINDS_SIDE.success,
  //       domain: DOMAINS.SIDE,
  //       text: `Sucessfully ${
  //         hasDiscountsApplied ? 'added' : 'removed'
  //       } discount.`,
  //     });
  //   }

  //   if (errorUpdateCart)
  //     showNotification({
  //       kind: NOTIFICATION_KINDS_PAGE.error,
  //       domain: DOMAINS.SIDE,
  //       text: getErrorMessage(errorUpdateCart),
  //     });
  // }, [
  //   errorUpdateCart,
  //   dataUpdateCart,
  //   showNotification,
  //   hasDiscountsApplied,
  //   cartDetails,
  // ]);

  return (
    <Card type="raised" theme="light" insetScale="m">
      <Spacings.Stack scale="m">
        <Text.Headline as="h2" intlMessage={messages.cartDetailsDiscounts} />
        {/* TEXT INPUT + CTA BUTTON FOR PROMOCODES */}
        <DiscountCodeInput onAddDiscount={handleAddDiscount} />
        {hasDiscountsApplied &&
          discountCodes.map((discountCode) => (
            <div
              style={{
                border: '1px solid',
                borderColor:
                  discountCode.state === TDiscountCodeState.MatchesCart
                    ? designTokens.colorSuccess85
                    : designTokens.colorWarning85,
                borderRadius: designTokens.borderRadius4,
                padding: '0.5rem',
                alignItems: 'center',
                margin: 'auto',
              }}
              key={discountCode.discountCodeRef.id}
            >
              <Spacings.Inline scale="s" justifyContent="space-between">
                <Spacings.Inline
                  scale="s"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Tooltip
                    title={`Discount state: ${discountCode.state ?? ''}`}
                  >
                    {discountCode.state === TDiscountCodeState.MatchesCart ? (
                      <CheckActiveIcon color="success" />
                    ) : (
                      <ErrorIcon color="warning" />
                    )}
                  </Tooltip>

                  <Spacings.Stack scale="xs">
                    <Text.Detail tone="tertiary">
                      {discountCode.discountCode?.code}
                    </Text.Detail>
                    <Text.Caption tone="tertiary">
                      {discountCode.discountCode?.name}
                    </Text.Caption>
                  </Spacings.Stack>
                </Spacings.Inline>
                <IconButton
                  label="Remove"
                  icon={<BinFilledIcon />}
                  type="button"
                  size="big"
                  onClick={() =>
                    handleRemovePromoCode(discountCode.discountCodeRef.id)
                  }
                />
              </Spacings.Inline>
            </div>
          ))}
      </Spacings.Stack>
    </Card>
  );
};

export default DiscountsSummary;
