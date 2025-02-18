import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useCartsFetcher } from '../../hooks/use-carts-connector';
import messages from './messages';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import CartDetails from '../cart-details';
import SelectableSearchInput, {
  TSelectableSearchInputProps,
  TValue,
} from '@commercetools-uikit/selectable-search-input';
import DataTableManager from '@commercetools-uikit/data-table-manager';
import { LABEL_KEYS } from './constants';
import { useDataTableManager } from './hooks/use-data-table-manager';
import { Logo } from '../images/logo';

declare global {
  interface Window {
    app: {
      logoMustBeVisible: string;
    };
  }
}

const Carts = () => {
  const match = useRouteMatch();
  const intl = useIntl();
  const { push } = useHistory();

  const {
    customColumnManager,
    handleSettingsChange,
    visibleColumns,
    renderItems,
    tableSorting,
    page,
    perPage,
  } = useDataTableManager();

  const [searchInputValue, setSearchInputValue] = useState<TValue>({
    option: LABEL_KEYS.ALL_FIELDS,
    text: '',
  });

  const [logoMustBeVisible] = useState<boolean>(() => {
    const value = window.app?.logoMustBeVisible;
    if (value && typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  });

  // Only used for custom placeholders on dropdown change
  const [dropdownValue, setDropdownValue] = useState<LABEL_KEYS>(
    LABEL_KEYS.ALL_FIELDS
  );

  const { cartsPaginatedResult, total, error, loading } = useCartsFetcher({
    page,
    perPage,
    tableSorting,
    where: searchInputValue.text,
    labelKey: searchInputValue.option,
  });

  const dropdownOptions: TSelectableSearchInputProps['options'] = [
    {
      value: LABEL_KEYS.ALL_FIELDS,
      label: intl.formatMessage(messages.allFieldsLabel),
    },
    {
      value: LABEL_KEYS.CART_ID,
      label: intl.formatMessage(messages.cartIDLabel),
    },
    {
      value: LABEL_KEYS.CUSTOMER_EMAIL,
      label: intl.formatMessage(messages.emailAddressLabel),
    },
  ];

  const showNoResultsMessage =
    (!loading && searchInputValue.text && cartsPaginatedResult?.length === 0) ||
    error;

  const renderNoResultsMessage = () => {
    return error ? (
      <ContentNotification type="error">
        <Text.Body
          tone="negative"
          intlMessage={messages.searchTermNotFoundOnError}
        />
      </ContentNotification>
    ) : (
      <ContentNotification type="warning">
        <Text.Body tone="primary" intlMessage={messages.searchTermNotFound} />
      </ContentNotification>
    );
  };

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>
      <Spacings.Stack scale="m">
        <SelectableSearchInput
          id="searchInput"
          name="searchInput"
          value={searchInputValue}
          onSubmit={(val) => {
            val.text.length > 0 && setSearchInputValue(val);
          }}
          onReset={() =>
            setSearchInputValue({
              option: searchInputValue.option,
              text: '',
            })
          }
          onChange={(event) => {
            if (
              event?.target?.name &&
              event?.target?.name.endsWith('.dropdown')
            ) {
              setDropdownValue(event?.target?.value as LABEL_KEYS);
            }
          }}
          placeholder={
            dropdownValue === LABEL_KEYS.ALL_FIELDS
              ? intl.formatMessage(messages.searchForCartsByAllFields)
              : intl.formatMessage(messages.searchForCarts)
          }
          horizontalConstraint={'scale'}
          menuHorizontalConstraint={5}
          options={dropdownOptions}
          showSubmitButton={true}
          hasError={false}
          isClearable={true}
        />
      </Spacings.Stack>
      {loading && <LoadingSpinner />}
      {showNoResultsMessage
        ? renderNoResultsMessage()
        : cartsPaginatedResult && (
            <Spacings.Stack scale="l">
              {/* Wrapper div used alongside disableSelfContainment={true} to handle horizontal scrolling from parent */}
              <div style={{ overflowX: 'scroll', zIndex: '0' }}>
                <DataTableManager
                  columns={visibleColumns}
                  columnManager={customColumnManager}
                  onSettingsChange={handleSettingsChange}
                >
                  <DataTable
                    disableSelfContainment={true}
                    isCondensed
                    rows={cartsPaginatedResult}
                    itemRenderer={(item, column) => renderItems(item, column)}
                    sortedBy={tableSorting.value.key}
                    sortDirection={tableSorting.value.order}
                    onSortChange={tableSorting.onChange}
                    onRowClick={(row) => {
                      push(`${match.url}/${row.id}`);
                    }}
                    wrapHeaderLabels={false}
                  />
                </DataTableManager>
              </div>
              <Pagination
                page={page.value}
                onPageChange={page.onChange}
                perPage={perPage.value}
                onPerPageChange={perPage.onChange}
                totalItems={total || 0}
              />
              <Switch>
                <SuspendedRoute path={`${match.url}/:id`}>
                  <CartDetails />
                </SuspendedRoute>
              </Switch>
            </Spacings.Stack>
          )}

      <Spacings.Stack scale="m" alignItems="center">
        {logoMustBeVisible && <Logo />}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default Carts;
