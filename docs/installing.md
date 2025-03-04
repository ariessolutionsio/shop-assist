---
layout: default
title: Getting Started
nav_order: 2
---

<!--prettier-ignore-start-->
## Support

Need help with your project? Contact the Aries Solutions team for
assistance.

---

## Getting started

### Quick Demo

We can provide a demo or install our hosted version directly to your dev environment.
[Please reach out to our team for help.](https://www.ariessolutions.io/contact-aries/)

### Host the Application

The commercetools Merchant Center does not allow a single running instance to be shared, each _ENTRY_POINT_URI_PATH_ must be unique.

You can launch your own copy through Netlify or similar hosting service. Be sure to set the correct environment variables, there is a .env.template file to help.

### Configure Custom Application with Merchant Center

In order to use this custom application, you'll need to register it inside of the Merchant Center. To register your Custom Application with a Merchant Center project:

1. In the main navigation of the Merchant Center, navigate to **User Icon > Manage Organization and Teams**. Click on the organizaiton where you want to install the application.

2. From your organization page, navigate to the tab **Custom Applications** and clck the **Configure Custom Applications** button. Then click the **Add a Custom Application** button.

3. Fill in the fields as follows:

    - **Application Name**: Shop Assist
    - **Application Url**: Your hosting location
    - **Application entry point URI path**: `shop-assist-unique-url`
    - **Permissions**: Manage Products, Manage Orders, Manage Customers

4. Click **Register Custom Application**.

5. Install the application in your desired projects. From the organization's Custom Applications screen click on the **Install Custom Applications** button. Choose the application. Install in all or selected projects for that organization.
