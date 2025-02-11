// external imports
import { useEffect, useState } from 'react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import SearchTextInput from '@commercetools-uikit/search-text-input';

// local imports
import { useIntl } from 'react-intl';
import messages from '../messages';
import { useCartDetails } from '../hooks/use-cart-details';
import { getErrorMessage } from '../../../helpers';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_PAGE,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

const DropdownInputField = () => {
  const intl = useIntl();
  const {
    handleAddProduct,
    resetUpdateCartMutationResult,
    dataUpdateCart,
    errorUpdateCart,
    loadingUpdateCart,
  } = useCartDetails();

  const showNotification = useShowNotification();
  const SHOW_OFF_TIMEOUT = 4000;
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    if (dataUpdateCart)
      showNotification(
        {
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: `Sucessfully added product to the cart.`,
        },
        { dismissAfter: SHOW_OFF_TIMEOUT }
      );

    if (errorUpdateCart)
      showNotification(
        {
          kind: NOTIFICATION_KINDS_PAGE.error,
          domain: DOMAINS.SIDE,
          text: getErrorMessage(errorUpdateCart),
        },
        { dismissAfter: SHOW_OFF_TIMEOUT }
      );
  }, [errorUpdateCart, dataUpdateCart, showNotification]);

  const handleSearchInputReset = () => {
    setSearchValue('');
    resetUpdateCartMutationResult();
  };

  // TODO: Consider refactoring this component to use SearchSelectField component from CT UI KIT
  // to improve the whole search experience, with option suggestions and more.
  // https://uikit.commercetools.com/?path=/docs/form-fields-searchselectfield-readme--props

  return (
    <>
      <Spacings.Inline scale="m" alignItems="flex-end">
        <SearchTextInput
          id="searchInput"
          name="searchInput"
          value={searchValue}
          placeholder={intl.formatMessage(messages.cartDetailsSearchBySku)}
          onChange={(event) => setSearchValue(event.target.value)}
          onSubmit={() => handleAddProduct(searchValue)}
          onReset={() => handleSearchInputReset()}
          horizontalConstraint={12}
          hasError={false}
          isClearable={true}
        />
        <PrimaryButton
          label="Add to cart"
          onClick={() => handleAddProduct(searchValue)}
          isDisabled={!searchValue}
        />
        {loadingUpdateCart && <LoadingSpinner />}
      </Spacings.Inline>
    </>
  );
};

export default DropdownInputField;
