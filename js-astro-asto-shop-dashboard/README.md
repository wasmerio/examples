<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Asto Shop Dashboard](https://github.com/AndrixNg1/AstoShop-dashboard) Astro theme by AndrixNg1, copied from commit `2d0d43651c694e66bb526ea7b9479be5a098050b` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-asto-shop-dashboard.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [AndrixNg1](https://github.com/AndrixNg1), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# AstoShop Dashboard

A fast, responsive, and reusable e-commerce admin dashboard built with Astro and TypeScript. AstoShop provides a clear overview of store revenue, orders, customers, products, inventory, acquisition channels, and conversion performance.

> [!NOTE]
> This project is under active development. The e-commerce foundation, core UI components, analytics, and primary business views are available. Data mutations and backend integrations are planned for future releases.

## Live demo

[View the live dashboard](https://dashboard-astro1.vercel.app/)

## Overview

AstoShop is designed as a practical foundation for online store back offices. It helps store managers:

- monitor revenue, orders, average order value, and conversion rate;
- analyze acquisition channels and sales trends;
- review orders, payments, and fulfillment statuses;
- track products, categories, pricing, and inventory;
- understand customer activity and lifetime spending;
- monitor store notifications and low-stock alerts.

The dashboard currently uses typed local mock data. This keeps the interface independent from any backend and makes it easy to connect an API, CMS, or commerce platform later.

## Features

- E-commerce overview with key performance indicators
- Revenue and conversion charts built with lightweight SVG and CSS
- Interactive acquisition chart powered by Apache ECharts and loaded on demand
- Responsive sidebar and mobile navigation
- Product catalog with pricing and inventory status
- Order tracking with payment and fulfillment information
- Customer overview with order count and total spending
- Store notifications and account settings
- Reusable, typed, and accessible Astro components
- Fast static output with minimal client-side JavaScript

## Pages

| Route | Description |
| --- | --- |
| `/` | Store performance overview and recent activity |
| `/analytics` | Revenue, acquisition channels, and conversion trends |
| `/products` | Product catalog, prices, categories, and inventory |
| `/orders` | Orders, payments, and fulfillment statuses |
| `/customers` | Customer activity, orders, and total spending |
| `/notifications` | Store alerts and recent events |
| `/settings` | Dashboard account and security settings |

Legacy routes for projects, tasks, and users redirect to their corresponding e-commerce pages.

## Tech stack

- [Astro](https://astro.build/) for routing, rendering, and application structure
- [TypeScript](https://www.typescriptlang.org/) for typed data and application logic
- [Tailwind CSS](https://tailwindcss.com/) for responsive styling
- Native SVG and CSS for lightweight revenue and conversion charts
- [Apache ECharts](https://echarts.apache.org/) for the lazy-loaded acquisition chart
- [Lucide](https://lucide.dev/) for consistent SVG icons

## Requirements

- Node.js 22.12 or later
- npm

## Getting started

```bash
git clone https://github.com/AndrixNg1/AstoShop-dashboard.git
cd AstoShop-dashboard
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Available commands

Run all commands from the project root.

| Command | Description |
| --- | --- |
| `npm install` | Install project dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | Display Astro CLI help |

## Project structure

```text
src/
├── assets/              # Global styles and client-side scripts
├── charts/              # ECharts configuration
├── components/
│   ├── charts/          # Data visualization components
│   ├── dashboard/       # Dashboard-specific components
│   └── ui/              # Reusable interface components
├── data/                # Typed local mock data
├── layouts/             # Shared page layouts
├── pages/               # File-based Astro routes
└── types/               # Shared TypeScript types
```

## Customization and backend integration

- Update global styles in `src/assets/styles/app.css`.
- Add or modify routes in `src/pages/`.
- Configure charts in `src/components/charts/` and `src/charts/`.
- Replace the mock data in `src/data/` with calls to your API.
- Configure Astro and Vite integrations in `astro.config.mjs`.

The dashboard can be connected to a custom API or adapted for platforms such as Shopify, WooCommerce, Medusa, or Saleor. No commerce connector is included yet.

## Roadmap

- Product, variant, and category creation workflows
- Interactive order, payment, and fulfillment management
- Detailed customer profiles and purchase history
- Best-selling products and abandoned-cart analytics
- Filters by date range, sales channel, and status
- Loading, empty, and error states for remote data
- Authentication, authorization, and backend integration

## Contributing

Contributions, bug reports, and feature proposals are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request.

## License

This project is available under the [MIT License](LICENSE).
