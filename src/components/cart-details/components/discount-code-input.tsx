import { useState } from 'react';
import messages from '../messages';
import TextInput from '@commercetools-uikit/text-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useIntl } from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';

interface IDiscountCodeInput {
  onAddDiscount: (code: string) => Promise<void>;
}

const DiscountCodeInput = ({ onAddDiscount }: IDiscountCodeInput) => {
  const intl = useIntl();

  const [promoCode, setPromoCode] = useState<string>('');

  return (
    <Spacings.Inline scale="s" alignItems="flex-end">
      <TextInput
        id="promoCodes"
        name="promoCodes"
        value={promoCode}
        placeholder={intl.formatMessage(messages.cartDetailsDiscountsEnterCode)}
        onChange={(event) => setPromoCode(event.target.value)}
        horizontalConstraint={12}
        hasError={false}
      />
      <PrimaryButton
        label="Apply"
        onClick={() => onAddDiscount(promoCode)}
        isDisabled={!promoCode}
      />
    </Spacings.Inline>
  );
};

export default DiscountCodeInput;
