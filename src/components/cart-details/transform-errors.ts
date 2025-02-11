import omitEmpty from 'omit-empty-es';

const DUPLICATE_FIELD_ERROR_CODE = 'DuplicateField';

type TransformedErrors = {
  unmappedErrors: unknown[];
  formErrors: Record<string, { duplicate: boolean }>;
};

/**
 * Transforms GraphQL errors into a structured format for form validation and error handling.
 *
 * This function processes GraphQL errors and categorizes them into two types:
 * 1. Form-specific errors (specifically duplicate field errors)
 * 2. Unmapped errors (general API errors)
 *
 * @param error - The error(s) to transform. Can be a single error object or an array of errors.
 *                Each error is expected to potentially have:
 *                - extensions.code or code: The error code
 *                - extensions.field or field: The field name associated with the error
 *
 * @returns {TransformedErrors} An object containing:
 *          - formErrors: Record of field-specific errors, with 'duplicate' flag
 *          - unmappedErrors: Array of errors that couldn't be mapped to specific form fields
 *
 * @example
 * const result = transformErrors({
 *   extensions: {
 *     code: 'DuplicateField',
 *     field: 'email'
 *   }
 * });
 * // Returns: {
 * //   formErrors: { email: { duplicate: true } },
 * //   unmappedErrors: []
 * // }
 */
export const transformErrors = (error: unknown): TransformedErrors => {
  const errorsToMap = Array.isArray(error) ? error : [error];

  const { formErrors, unmappedErrors } = errorsToMap.reduce<TransformedErrors>(
    (transformedErrors, graphQLError) => {
      const errorCode = graphQLError?.extensions?.code ?? graphQLError.code;
      const fieldName = graphQLError?.extensions?.field ?? graphQLError.field;

      if (errorCode === DUPLICATE_FIELD_ERROR_CODE) {
        transformedErrors.formErrors[fieldName] = { duplicate: true };
      } else {
        transformedErrors.unmappedErrors.push(graphQLError);
      }
      return transformedErrors;
    },
    {
      formErrors: {}, // will be mappped to form field error messages
      unmappedErrors: [], // will result in dispatching `showApiErrorNotification`
    }
  );

  return {
    formErrors: omitEmpty(formErrors),
    unmappedErrors,
  };
};
