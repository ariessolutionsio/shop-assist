import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Shop Assist',
  entryPointUriPath,
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  oAuthScopes: {
    view: ['view_products', 'view_orders'],
    manage: ['manage_products', 'manage_orders'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    uriPath: 'carts',
    defaultLabel: 'Carts',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  additionalEnv: {
    logoMustBeVisible: '${env:LOGO_MUST_BE_VISIBLE}',
  },
};

export default config;
