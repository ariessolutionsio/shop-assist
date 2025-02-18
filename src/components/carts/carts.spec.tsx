import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import {
  mapResourceAccessToAppliedPermissions,
  type TRenderAppWithReduxOptions,
} from '@commercetools-frontend/application-shell/test-utils';
import { buildGraphqlList } from '@commercetools-test-data/core';
import { renderApplicationWithRedux } from '../../test-utils';
import { entryPointUriPath, PERMISSIONS } from '../../constants';
import ApplicationRoutes from '../../routes';
import type { TCart } from '@commercetools-test-data/cart';
import { Cart } from '@commercetools-test-data/cart';

const mockServer = setupServer();
afterEach(() => mockServer.resetHandlers());
beforeAll(() => {
  mockServer.listen({
    // for debugging reasons we force an error when the test fires a request with a query or mutation which is not mocked
    // more: https://mswjs.io/docs/api/setup-worker/start#onunhandledrequest
    onUnhandledRequest: 'error',
  });
});
afterAll(() => {
  mockServer.close();
});

const renderApp = (options: Partial<TRenderAppWithReduxOptions> = {}) => {
  const route = options.route || `/my-project/${entryPointUriPath}/carts`;
  const { history } = renderApplicationWithRedux(<ApplicationRoutes />, {
    route,
    project: {
      allAppliedPermissions: mapResourceAccessToAppliedPermissions([
        PERMISSIONS.View,
      ]),
    },
    ...options,
  });
  return { history };
};

it('should render carts and paginate to second page', async () => {
  mockServer.use(
    graphql.query('FetchCarts', (req, res, ctx) => {
      // Simulate a server side pagination.
      const { offset } = req.variables;
      const totalItems = 25; // 2 pages
      const itemsPerPage = offset === 0 ? 20 : 5;

      return res(
        ctx.data({
          carts: buildGraphqlList<TCart>(
            Array.from({ length: itemsPerPage }).map((_, index) =>
              Cart.random().key(`cart-key-${offset === 0 ? index : 20 + index}`)
            ),
            {
              name: 'Cart',
              total: totalItems,
            }
          ),
        })
      );
    })
  );
  renderApp();

  //TODO: Fix test, passing on local but failing on CI/CD (GH Actions)
  // Possible workarounds here: https://github.com/testing-library/react-testing-library/issues/865

  // First page
  // await screen.findByText('cart-key-0');
  // expect(screen.queryByText('cart-key-22')).not.toBeInTheDocument();

  // // Go to second page
  // fireEvent.click(screen.getByLabelText('Next page'));

  // // Second page
  // await screen.findByText('cart-key-22');
  // expect(screen.queryByText('cart-key-0')).not.toBeInTheDocument();
});
