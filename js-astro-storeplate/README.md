<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Storeplate Astro](https://github.com/zeon-studio/storeplate) Astro theme by zeon-studio, copied from commit `533ffe46f5bb2bd52c71715819cff06891783f22` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-storeplate.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and runs the `@astrojs/node` standalone server on Wasmer Edge.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
  - Replaced the @astrojs/netlify adapter with @astrojs/node 11.1.2 in standalone mode, because some pages render on the server. Added @astrojs/node to package.json and the lockfile.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
  - Added a `start` script (`node ./dist/server/entry.mjs`) to package.json so Wasmer can start the Node server.
- **Environment variables:** The theme's example env file lists `PUBLIC_SHOPIFY_STORE_DOMAIN`, `PUBLIC_SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN`, `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `PUBLIC_SHOPIFY_REVALIDATION_SECRET`, `PUBLIC_SHOPIFY_API_SECRET_KEY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [zeon-studio](https://github.com/zeon-studio), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<h1 align=center>Storeplate | AstroJs + Shopify + Tailwind CSS + TypeScript Starter and Boilerplate</h1>

<p align=center>A free, production-ready astro.js template powered by Tailwind CSS and TypeScript, specifically designed for Shopify. Utilizes the Shopify Storefront API through GraphQL and provides everything you need to jumpstart your Astro project and save valuable time.</p>

<p align=center>Made with ♥ by <a href="https://zeon.studio/">Zeon Studio</a></p>
<p align=center> If you find this project useful, please give it a ⭐ to show your support. </p>

<h2 align="center"> <a target="_blank" href="https://storeplate.netlify.app/" rel="nofollow">👀 Demo</a> | <a  target="_blank" href="https://pagespeed.web.dev/analysis/https-storeplate-vercel-app/qs3wscwqpq?form_factor=desktop">Page Speed (99%)🚀</a>
</h2>

<p align=center>

 <a href="https://github.com/withastro/astro/releases/tag/astro@7.0.0" alt="Contributors">
    <img src="https://img.shields.io/static/v1?label=ASTRO&message=7.0.0&color=BC52EE&logo=astro" alt="7.0.0"/>
</a>
  <a href="https://github.com/zeon-studio/storeplate/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/zeon-studio/storeplate" alt="license"></a>

  <img src="https://img.shields.io/github/languages/code-size/zeon-studio/storeplate" alt="code size">

  <a href="https://github.com/zeon-studio/storeplate/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/zeon-studio/storeplate" alt="contributors"></a>
</p>

## 📌 Key Features

- 🌐 Dynamic Products from Shopify Storefront API
- 💸 Checkout and Payments with Shopify
- 🌞 Automatic Light/Dark Mode
- 🚀 Fetching and Caching Paradigms
- 🔗 Server Actions for Mutations
- 🔐 User Authentication
- 🧩 Similar Products Suggestions
- 🔍 Search, Sort, Different Views Functionality
- 🏷️ Tags & Categories & Vendors & Price Range & Product Variants Functionality
- 🖼️ Single Product Image Zoom, Hover Effect, Slider
- 🛒 Cart & Easy editing options for cart items
- 📝 Product Description on Multiple Tabs
- 🔗 Netlify Setting Pre-configured
- 📞 Support Contact Form
- 📱 Fully Responsive
- 🔄 Dynamic Home Banner Slider
- 📝 Write and Update Content in Markdown / MDX
- ⌛ Infinite Product Load on Scrolling

### 📄 10+ Pre-designed Pages

- 🏠 Homepage
- 👤 About
- 📞 Contact
- 🛍️ Products
- 📦 Product Single
- 💡 Terms of services
- 📄 Privacy Policy
- 🔐 Login
- 🔑 Register
- 🚫 Custom 404

## 🚀 Getting Started

### 📦 Dependencies

- shopify
- astro 7.0.0
- node v22.20+
- npm v10.2+
- tailwind v4.1+

<!-- get Shopify storefront API access token-->

## 🛒 Retrieve Shopify Token & Add Demo Products

> **Note:** Shopify has transitioned to the new **Headless Sales Channel** authentication system using Public/Private Access Tokens. The old "Private Apps" system is deprecated. Follow the steps below to get your tokens.

### Step 1: Create a Shopify Store

- To get the tokens needed, create a Shopify partner account.
  ![Screenshot_1](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/1.png)

- Now go to 'Stores' and select 'Add store.' Create a development store using the option 'Create development store'.
  ![Screenshot_2](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/2.png)

- Click on import products.
  ![Screenshot_3](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/3.png)

- Locate the 'products' CSV file in the public folder of the repository and upload it for demo products.
  ![Screenshot_4](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/4.png)

### Step 2: Create a Headless Sales Channel (New Method)

- On the admin dashboard, click on 'Settings' at the bottom of the left sidebar.
  ![Screenshot_5](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/5.png)

- On the Settings page, click on 'Apps and sales channels' on the left sidebar.
  ![Screenshot_6](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/6.png)

- Click on 'Shopify App Store' to browse apps.

- Search for and install the **"Headless"** sales channel app (official Shopify app).

- Once installed, open the Headless channel and click 'Create storefront'.

- Give your storefront a name (e.g., "Next.js Storefront").

- Navigate to the 'API credentials' or 'Storefront API' tab to get your tokens:
  - **Private Access Token**: Used for server-side API calls (required)
  - **Public Access Token**: Used for client-side/browser queries (optional)
  - **Storefront API endpoint**: Your store domain (e.g., `your-store.myshopify.com`)

### Step 3: Configure Environment Variables

- Copy `.env.example` to `.env` and fill in your credentials:

```bash
PUBLIC_SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
PUBLIC_SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN="your-private-access-token"
PUBLIC_SHOPIFY_REVALIDATION_SECRET="your-revalidation-secret"  # Optional, for webhooks
```

> **Migration from old system:** If you have existing `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` or `PUBLIC_SHOPIFY_API_SECRET_KEY` values, they will continue to work. However, we recommend migrating to the new token format for better security.

- When adding your product, use the same alt title for images with the same color. This helps the first image appear as the color variant in the selector.
  ![Screenshot_13](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/13.png)
  ![Screenshot_14](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/14.png)

- We have the option to create additional collections for products.
  ![Screenshot_15](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/15.png)

## 🚀 Setting Up the Hero Slider

1. Go to the file `/src/config/config.json` in your Shopify project and find the 'hero_slider' section. You’ll see something like this:

   ```json
   "shopify": {
     "currencySymbol": "৳",
     "currencyCode": "BDT",
     "collections": {
       "hero_slider": "hidden-homepage-carousel",
       "featured_products": "featured-products"
     }
   }
   ```

2. Change the 'hero_slider' collection name to something of your choice.

3. Then, go to your Shopify Partner Dashboard, navigate to Products > Collections, and create a collection with the same name you set in the config file (e.g., 'hidden-homepage-carousel').

4. Add the products you want to display in the hero slider to this collection.

### 👉 Install Dependencies

```bash
npm install
```

### 👉 Development Command

```bash
npm run dev
```

### 👉 Build Command

```bash
npm run build
```

<!-- reporting issue -->

## 🐞 Reporting Issues

We use GitHub Issues as the official bug tracker for this Template. Please Search [existing issues](https://github.com/zeon-studio/storeplate/issues). It’s possible someone has already reported the same problem.
If your problem or idea has not been addressed yet, feel free to [open a new issue](https://github.com/zeon-studio/storeplate/issues/new).

<!-- license -->

## 📝 License

Copyright (c) 2024 - Present, Designed & Developed by [Zeon Studio](https://zeon.studio/)

**Code License:** Released under the [MIT](https://github.com/zeon-studio/storeplate/blob/main/LICENSE) license.

**Image license:** The images are only for demonstration purposes. They have their license, we don't have permission to share those images.

## 💻 Need Custom Development Services?

If you need a custom theme, theme customization, or complete website development services from scratch you can [Hire Us](https://zeon.studio/).
