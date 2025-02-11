import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';
import type { FormikErrors } from 'formik';
import type { TFormValues } from '../../types';

type TErrors = {
  key: { missing?: boolean };
  roles: { missing?: boolean };
};

/**
 * Validates form values for cart details
 * @param {TFormValues} formikValues - The form values to validate
 * @returns {FormikErrors<TFormValues>} An object containing validation errors
 *
 * The function checks for:
 * - Empty key value
 * - Empty roles array
 */
const validate = (formikValues: TFormValues): FormikErrors<TFormValues> => {
  const errors: TErrors = {
    key: {},
    roles: {},
  };

  if (TextInput.isEmpty(formikValues.key)) {
    errors.key.missing = true;
  }

  if (
    !formikValues.roles ||
    (Array.isArray(formikValues.roles) && formikValues.roles.length === 0)
  ) {
    errors.roles.missing = true;
  }

  return omitEmpty(errors);
};

export default validate;
