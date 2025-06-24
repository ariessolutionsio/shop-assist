---
layout: default
title: Development
nav_order: 3
---

<!--prettier-ignore-start-->
## Development
{: .no_toc }

1. TOC 
{:toc}

<!--prettier-ignore-end-->

### Technology

- [ReactJS](https://reactjs.org/)
- [Apollo](https://www.apollographql.com/docs/react/) &
  [GraphQL](https://graphql.org/learn/)
- [Merchant Center Application Kit](https://docs.commercetools.com/custom-applications/)
- [UI Kit](https://uikit.commercetools.com/?path=/story/introduction--getting-started) -
  Merchant Center component library
- [Yarn](https://classic.yarnpkg.com/en/docs/getting-started) - Package manager
- [Jest](https://jestjs.io/docs/en/getting-started) - Test runner
- [Prettier](https://prettier.io/docs/en/index.html) - Code formatter
- [ESLint](https://eslint.org/docs/user-guide/getting-started) - JS, CSS, and
  GraphQL linter


### Installation

Clone the repository.

Simply run `yarn` or `yarn install` from the repository root to install the
application's dependencies.

```bash
yarn
```
If this is the first time running the application locally, create an `.env.local`
file at the root directory using `.env.template` as an example. Based on your
[region](https://docs.commercetools.com/api/general-concepts#regions), you may find it
necessary to modify the values of `frontendHost`, `mcApiUrl`, and `location`.

Run the following command to start the development server and launch the
application:

```bash
yarn start
```

### Build

Run the following command to build the
[production bundles](https://docs.commercetools.com/custom-applications/development/going-to-production#building-production-bundles)
with webpack:

```bash
yarn build
```

### Linting & Formatting

#### Formatting code

Run the following command to format JS, CSS, JSON and GraphQL files

```shell
yarn format
```

#### Linting code

Run the following command to lint JS, CSS, and GraphQL files

```shell
yarn lint
```

## Tests

Run the following command to run the tests:

```shell
yarn test
```

To run the tests in watch mode:

```shell
yarn test:watch
```

To run the tests with coverage:

```shell
yarn test:coverage
```
