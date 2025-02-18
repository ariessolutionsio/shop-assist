<p align="center">
  <a href="https://www.ariessolutions.io/composable-commerce/aries-labs-open-source/">
    <img alt="Aries Labs" width="300" src="docs/assets/Labs-For-Dk_BG.svg">
  </a>
</p>

This is the [TypeScript](https://www.typescriptlang.org/) version of the starter template to [develop Custom Applications](https://docs.commercetools.com/merchant-center-customizations/custom-applications) for the Merchant Center.

# Installing the template

Read the [Getting started](https://docs.commercetools.com/merchant-center-customizations/custom-applications) documentation for more information.

# Developing the Custom Application

Learn more about [developing a Custom Application](https://docs.commercetools.com/merchant-center-customizations/development) and [how to use the CLI](https://docs.commercetools.com/merchant-center-customizations/api-reference/cli).

# Codegen

Create a .env file and include the values from .env.template

```
#Settings Below are only for code generation
MC_API_URL="https://mc-api.us-central1.gcp.commercetools.com"
MC_PROXY_API_URL="https://mc.us-central1.gcp.commercetools.com"
MC_ACCESS_TOKEN= # for schema introspection
CTP_PROJECT_KEY=aries_dev-1 # one of the CTP projects linked to the access token above
```

You can get an MC_ACCESS_TOKEN by inspecting your browser cookies after logging in to the Merchant Center.
