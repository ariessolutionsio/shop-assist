import {
  transformLocalizedStringToLocalizedField,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { isApolloError, ApolloError, type ServerError } from '@apollo/client';
import type { TBaseMoney, TChannel, TMoney } from './types/generated/ctp';
import type {
  TGraphqlUpdateAction,
  TSyncAction,
  TChangeNameActionPayload,
} from './types';

/**
 * Extracts and formats error messages from an ApolloError
 *
 * @param error - The ApolloError object containing GraphQL errors or a general error message
 * @returns A string containing all GraphQL error messages joined by newlines, or the general error message
 *
 * @example
 * const error = new ApolloError({
 *   graphQLErrors: [
 *     { message: 'Field "foo" is required' },
 *     { message: 'Invalid input' }
 *   ]
 * });
 * getErrorMessage(error);
 * // Returns: "Field "foo" is required\nInvalid input"
 */
export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

/**
 * Type guard to determine if an Apollo network error is a ServerError
 *
 * @param error - The network error from an ApolloError
 * @returns True if the error is a ServerError (has a result property), false otherwise
 *
 * @example
 * const apolloError = new ApolloError({
 *   networkError: { result: { errors: [] } }
 * });
 * if (isServerError(apolloError.networkError)) {
 *   // networkError is typed as ServerError
 *   console.log(apolloError.networkError.result);
 * }
 */
const isServerError = (
  error: ApolloError['networkError']
): error is ServerError => {
  return Boolean((error as ServerError)?.result);
};

/**
 * Extracts error information from a GraphQL response
 *
 * @param graphQlResponse - The GraphQL response to process, which may contain errors
 * @returns The extracted error information in one of the following formats:
 * - An array of network errors if present in the response
 * - An array of GraphQL errors if present in the response
 * - The original response if no specific errors are found
 *
 * @example
 * // Network error example
 * const error = new ApolloError({
 *   networkError: {
 *     result: { errors: [{ message: 'Network error occurred' }] }
 *   }
 * });
 * extractErrorFromGraphQlResponse(error);
 * // Returns: [{ message: 'Network error occurred' }]
 *
 * @example
 * // GraphQL error example
 * const error = new ApolloError({
 *   graphQLErrors: [{ message: 'Invalid input' }]
 * });
 * extractErrorFromGraphQlResponse(error);
 * // Returns: [{ message: 'Invalid input' }]
 */
export const extractErrorFromGraphQlResponse = (graphQlResponse: unknown) => {
  if (graphQlResponse instanceof Error && isApolloError(graphQlResponse)) {
    if (
      isServerError(graphQlResponse.networkError) &&
      typeof graphQlResponse.networkError?.result !== 'string' &&
      graphQlResponse.networkError?.result?.errors.length > 0
    ) {
      return graphQlResponse?.networkError?.result.errors;
    }

    if (graphQlResponse.graphQLErrors?.length > 0) {
      return graphQlResponse.graphQLErrors;
    }
  }

  return graphQlResponse;
};

/**
 * Transforms a name payload into a format suitable for GraphQL mutations by converting
 * the localized string to a localized field format
 *
 * @param payload - The payload containing the name to transform
 * @param payload.name - The localized string representation of the name
 * @returns An object with the transformed name in localized field format
 *
 * @example
 * const payload = { name: { en: 'New Name', de: 'Neuer Name' } };
 * getNameFromPayload(payload);
 * // Returns: {
 * //   name: {
 * //     en: { value: 'New Name' },
 * //     de: { value: 'Neuer Name' }
 * //   }
 * // }
 */
const getNameFromPayload = (payload: TChangeNameActionPayload) => ({
  name: transformLocalizedStringToLocalizedField(payload.name),
});

/**
 * Type guard to check if an action payload is a TChangeNameActionPayload
 *
 * @param actionPayload - The action payload to check
 * @returns True if the payload has a defined 'name' property, indicating it's a TChangeNameActionPayload
 *
 * @example
 * const payload = { name: { en: 'New Name' } };
 * if (isChangeNameActionPayload(payload)) {
 *   // payload is typed as TChangeNameActionPayload
 *   console.log(payload.name);
 * }
 */
const isChangeNameActionPayload = (
  actionPayload: Record<string, unknown>
): actionPayload is TChangeNameActionPayload => {
  return (actionPayload as TChangeNameActionPayload)?.name !== undefined;
};

/**
 * Converts a sync action into a GraphQL update action format
 *
 * @param action - The sync action to convert
 * @param action.action - The name of the action (e.g., 'changeName')
 * @param action.payload - Additional payload data for the action
 * @returns A GraphQL update action where the action name becomes the key and the payload is transformed if needed
 *
 * @example
 * const syncAction = {
 *   action: 'changeName',
 *   name: { en: 'New Name', de: 'Neuer Name' }
 * };
 * convertAction(syncAction);
 * // Returns: {
 * //   changeName: {
 * //     name: { en: 'New Name', de: 'Neuer Name' }
 * //   }
 * // }
 */
const convertAction = (action: TSyncAction): TGraphqlUpdateAction => {
  const { action: actionName, ...actionPayload } = action;
  return {
    [actionName]:
      actionName === 'changeName' && isChangeNameActionPayload(actionPayload)
        ? getNameFromPayload(actionPayload)
        : actionPayload,
  };
};

/**
 * Converts an array of sync actions into GraphQL update actions
 *
 * @param actions - Array of sync actions to be converted
 * @returns Array of GraphQL update actions where each action is transformed according to its type
 *
 * @example
 * const syncActions = [
 *   { action: 'changeName', name: { en: 'New Name', de: 'Neuer Name' } }
 * ];
 * createGraphQlUpdateActions(syncActions);
 * // Returns: [{
 * //   changeName: {
 * //     name: { en: 'New Name', de: 'Neuer Name' }
 * //   }
 * // }]
 */
export const createGraphQlUpdateActions = (actions: TSyncAction[]) =>
  actions.reduce<TGraphqlUpdateAction[]>(
    (previousActions, syncAction) => [
      ...previousActions,
      convertAction(syncAction),
    ],
    []
  );

/**
 * Converts a channel draft object into action data by transforming localized fields
 *
 * @param draft - Partial channel object containing the draft data
 * @param draft.nameAllLocales - Array of localized name fields for the channel
 * @returns An object with the draft data and transformed localized name string
 *
 * @example
 * const draft = {
 *   nameAllLocales: [
 *     { locale: 'en', value: 'Channel Name' },
 *     { locale: 'de', value: 'Kanal Name' }
 *   ]
 * };
 * convertToActionData(draft);
 * // Returns: {
 * //   nameAllLocales: [...],
 * //   name: { en: 'Channel Name', de: 'Kanal Name' }
 * // }
 */
export const convertToActionData = (draft: Partial<TChannel>) => ({
  ...draft,
  name: transformLocalizedFieldToLocalizedString(draft.nameAllLocales || []),
});

/**
 * Formats a monetary amount with proper currency formatting based on locale
 *
 * @param price - The price object containing currency and amount information
 * @param price.currencyCode - ISO 4217 currency code (e.g., 'EUR', 'USD')
 * @param price.centAmount - Amount in minor units (cents)
 * @param price.fractionDigits - Number of decimal places for the currency
 * @param locale - The locale identifier (e.g., 'en-US', 'de-DE') to determine formatting
 * @returns A locale-specific formatted currency string
 *
 * @example
 * const price = {
 *   currencyCode: 'EUR',
 *   centAmount: 1999,
 *   fractionDigits: 2
 * };
 * formatMoneyCurrency(price, 'de-DE'); // Returns "19,99 €"
 * formatMoneyCurrency(price, 'en-US'); // Returns "€19.99"
 */
export const formatMoneyCurrency = (
  price: TMoney | TBaseMoney,
  locale: string
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: price.currencyCode || 'EUR',
    maximumFractionDigits: price.fractionDigits || 0,
    minimumFractionDigits: price.fractionDigits || 0,
  }).format((price.centAmount || 0) / Math.pow(10, price.fractionDigits || 1));
};
