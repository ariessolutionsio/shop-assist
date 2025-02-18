<p align="center">
  <a href="https://www.ariessolutions.io/composable-commerce/aries-labs-open-source/">
    <img alt="Aries Labs" width="300" src="docs/assets/Labs-For-Dk_BG.svg">
  </a>
</p>

This is the [TypeScript](https://www.typescriptlang.org/) version of the starter template to [develop Custom Applications](https://docs.commercetools.com/merchant-center-customizations/custom-applications) for the Merchant Center.

# Problem / Opportunity
In an eCommerce environment, customers often require support while they have active or open shopping carts. Since the eCommerce platform operates on the client side, the support team lacks the necessary tools to assist these customers effectively. This limitation creates a gap in the customer support process, as support agents cannot directly view or modify the contents of a customer's shopping cart to provide real-time assistance.

To address this issue, a custom application called Shop Assist has been developed within Commerce Tools. This application empowers support agents by providing them with access to all active shopping carts. Agents can search for specific carts using either the customer's email address or a cart ID. Once a cart is located, the support agent can perform the following actions to assist the customer:

- Add new items to the cart.
- Remove items from the cart.
- Increase/decrease the quantity of existing items in the cart.

This functionality enables the support team to provide proactive and efficient assistance to customers, enhancing the overall shopping experience and reducing potential friction during the checkout process.

# Opportunity
The implementation of Shop Assist represents a significant opportunity to improve customer satisfaction and streamline support operations. By equipping support agents with the ability to directly interact with customers' shopping carts, the eCommerce platform can reduce cart abandonment rates, resolve customer issues more effectively, and ultimately drive higher conversion rates. This tool bridges the gap between customer needs and support capabilities, creating a more seamless and supportive shopping experience.

# How to run the project

1. Clone the repository
2. Create .env file and add the values from .env.template
Read the [Getting started](https://docs.commercetools.com/merchant-center-customizations/custom-applications) documentation for more information.
3. IMPORTANT: **For this version you need to login to the Merchant Center and get the MC_ACCESS_TOKEN from the browser cookies. After, setting  MC_ACCESS_TOKEN in the .env file.**
3. Run `yarn` to install the dependencies
4. Run `yarn start` to start the development server

# How to contribute

Read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
