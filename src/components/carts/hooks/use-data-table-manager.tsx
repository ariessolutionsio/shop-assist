import { useState } from 'react';
import { dataTableColumns, initialDataTableColumns } from '../constants';
import { TColumnManagerProps } from '@commercetools-uikit/data-table-manager/dist/declarations/src/types';
import { UPDATE_ACTIONS } from '@commercetools-uikit/data-table-manager';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { TCart } from '../../../types/generated/ctp';
import { TColumn } from '@commercetools-uikit/data-table';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { formatMoneyCurrency } from '../../../helpers';
import Badge from '../../badge';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';

/**
 * A custom hook that manages the data table state and configuration for the carts view.
 *
 * @returns {Object} An object containing:
 *   - customColumnManager: Configuration for managing visible and hidden columns
 *   - tableSettingsChangeHandler: Handlers for table setting updates
 *   - visibleColumns: Array of currently visible columns
 *   - tableSorting: Current sorting state
 *   - page: Current page number
 *   - perPage: Number of items per page
 *   - renderItems: Function to render cell content based on column type
 *   - handleSettingsChange: Function to handle table setting changes
 *
 * Features:
 * - Column visibility management
 * - Column searching
 * - Sorting state management
 * - Pagination state management
 * - Dynamic cell rendering based on column type
 * - Localization support for store names
 * - Currency formatting for prices
 *
 * Example usage:
 * ```tsx
 * const {
 *   visibleColumns,
 *   renderItems,
 *   customColumnManager,
 *   handleSettingsChange,
 * } = useDataTableManager();
 * ```
 */
export const useDataTableManager = () => {
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages ?? [],
  }));

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const { page, perPage } = usePaginationState();

  const [customTableData, setCustomTableData] = useState({
    columns: dataTableColumns,
    visibleColumnKeys: initialDataTableColumns.map(({ key }) => key),
  });

  const customColumnManager = {
    areHiddenCustomColumnsSearchable: true,
    searchHiddenColumns: (searchTerm: string) => {
      setCustomTableData({
        ...customTableData,
        columns: initialDataTableColumns.filter(
          (column) =>
            customTableData.visibleColumnKeys.includes(column.key) ||
            column.label
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase())
        ),
      });
    },
    disableCustomColumnManager: false,
    visibleColumnKeys: customTableData.visibleColumnKeys,
    hideableColumns: customTableData.columns,
  };

  const tableSettingsChangeHandler = {
    [UPDATE_ACTIONS.COLUMNS_UPDATE]: (
      visibleColumnKeys: TColumnManagerProps['visibleColumnKeys']
    ) =>
      setCustomTableData({
        ...customTableData,
        visibleColumnKeys,
      }),
  };

  const mappedColumns = customTableData.columns.reduce<
    Record<string, (typeof customTableData.columns)[0]>
  >(
    (columns, column) => ({
      ...columns,
      [column.key]: column,
    }),
    {}
  );

  const visibleColumns = [
    ...customTableData.visibleColumnKeys.map(
      (columnKey) => mappedColumns[columnKey]
    ),
  ];

  const renderItems = (item: TCart, column: TColumn<TCart>) => {
    switch (column.key) {
      case 'id':
        return item.id;
      case 'key':
        return item.key;
      case 'customerEmail':
        return item.customerEmail;
      case 'customerGroup':
        return item.customerGroup?.id || NO_VALUE_FALLBACK;
      case 'anonymousId':
        return item.anonymousId;
      case 'businessUnit':
        return item.businessUnit?.id || NO_VALUE_FALLBACK;
      case 'store':
        return formatLocalizedString(
          {
            name: transformLocalizedFieldToLocalizedString(
              item.store?.nameAllLocales ?? []
            ),
          },
          {
            key: 'name',
            locale: dataLocale,
            fallbackOrder: projectLanguages,
            fallback: NO_VALUE_FALLBACK,
          }
        );
      case 'totalLineItemQuantity':
        return item.totalLineItemQuantity;
      case 'totalPrice':
        return formatMoneyCurrency(
          item.totalPrice,
          item.locale || projectLanguages[0]
        );
      case 'cartState':
        return <Badge cartStatus={item.cartState} />;
      case 'origin':
        return item.origin;
      default:
        return null;
    }
  };

  const handleSettingsChange = (
    settingName: string,
    settingValue: boolean | string[] | Record<string, unknown>
  ) => {
    tableSettingsChangeHandler[settingName](settingValue as string[]);
  };

  return {
    customColumnManager,
    tableSettingsChangeHandler,
    visibleColumns,
    tableSorting,
    page,
    perPage,
    renderItems,
    handleSettingsChange,
  };
};
