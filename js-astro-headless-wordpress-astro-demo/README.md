<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [The Headless Journal](https://github.com/rkxbeta/headless-wordpress-astro-demo) Astro theme by rkxbeta, copied from commit `0c6e37f27253b00d388507ed897508dc8c9e7815` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-headless-wordpress-astro-demo.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** The theme's example env file lists `CONTENT_MODE`, `SITE_URL`, `WORDPRESS_API_URL`, `RKX_API_NAMESPACE`, `WORDPRESS_PORT`, `WP_DB_NAME`, `WP_DB_USER`, `WP_DB_PASSWORD`, `WP_DB_ROOT_PASSWORD`, `WP_TABLE_PREFIX`, `WP_DEBUG`, `WP_ADMIN_USER`, `WP_ADMIN_PASSWORD`, `WP_ADMIN_EMAIL`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [rkxbeta](https://github.com/rkxbeta), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# The Headless Journal

> **“Modern publishing, powered by WordPress and Astro.”**

An open-source reference implementation of a decoupled, editorial-style technology publication. Built with **Astro**, **TypeScript**, and **Tailwind CSS 4**, featuring a three-tier content architecture (**Demo Mode**, **Free Mode**, and **Pro Mode**) powered by **RKX API Studio Free & Pro**.

[Listed on Astro Themes](https://astro.build/themes/details/the-headless-journal/)

---

## 1. Project Overview

* **Release Version:** `1.0.0`
* **Product:** RKX API Studio Free & Pro
  * **Free 1.0.1:** Released and publicly available on [WordPress.org](https://wordpress.org/plugins/rkx-api-studio/).
  * **Pro 1.1.0:** Available in production from [RKXBeta](https://rkxbeta.com/plugins/rkx-api-studio) (featuring Dynamic Route Builder, custom namespaces, and typed ACF field mapping).
* **Mode Compatibility:**
  * **Demo mode** requires zero backend dependencies or plugins (runs 100% offline from local JSON fixtures).
  * **Free mode** works with **RKX API Studio Free 1.0.1** (or 1.0.0) from [WordPress.org](https://wordpress.org/plugins/rkx-api-studio/).
  * **Pro mode** works with **RKX API Studio Pro 1.1.0** (Dynamic Route Builder, custom namespaces, and typed ACF field mapping) with an active license.
* **Company:** [RKXBeta](https://rkxbeta.com)
* **Repository:** `rkxbeta/headless-wordpress-astro-demo`
* **Supported Modes:** `demo` | `free` | `pro`

### Quick Links & Resources

* 🌐 **Live Production Demo:** [https://headless-journal.rkxbeta.com](https://headless-journal.rkxbeta.com)
* 🔌 **WordPress.org Free Plugin:** [RKX API Studio on WordPress.org](https://wordpress.org/plugins/rkx-api-studio/)
* 📦 **RKXBeta Product Page:** [RKX API Studio on RKXBeta](https://rkxbeta.com/plugins/rkx-api-studio)
* 📖 **Headless Journal Documentation:** [The Headless Journal Guide](https://rkxbeta.com/plugins/rkx-api-studio/docs/headless-journal-demo)
* 📺 **YouTube Tutorial:** [Build a Headless WordPress Website with Astro (YouTube)](https://www.youtube.com/watch?v=5KA5GXjbE60)

**The Headless Journal** demonstrates how editorial teams can retain WordPress as their authoring CMS while liberating frontend engineers to deliver zero-runtime JavaScript, high-performance edge static websites with Astro.

---

## 2. Three-Mode Content Architecture

All Astro pages and components consume content through the unified adapter interface in [`src/lib/content.ts`](src/lib/content.ts). Switching between modes requires only changing `CONTENT_MODE` in `.env` — zero page templates or UI components change across modes, and all three modes generate the exact same 16 public static routes.

| Feature / Capability | Demo Mode (`CONTENT_MODE=demo`) | Free Mode (`CONTENT_MODE=free`) | Pro Mode (`CONTENT_MODE=pro`) |
| :--- | :--- | :--- | :--- |
| **Adapter Implementation** | [`src/lib/adapters/mock.ts`](src/lib/adapters/mock.ts) | [`src/lib/adapters/free.ts`](src/lib/adapters/free.ts) | [`src/lib/adapters/pro.ts`](src/lib/adapters/pro.ts) |
| **WordPress Required?** | No (100% offline JSON) | Yes (`http://localhost:8088`) | Yes (`http://localhost:8088`) |
| **Required Plugins** | None | RKX API Studio Free | RKX API Studio Free + Pro (+ ACF/SCF for ACF fields) |
| **REST Namespace** | N/A | Default: `rkx-api-studio/v1` | Configured Pro Custom Namespace: `rkx/v1` (`RKX_API_NAMESPACE=rkx/v1`, default is `rkx-api-studio/v1`) |
| **Collection Endpoints** | Local JSON arrays | `/posts`, `/categories`, `/featured` | `/posts`, `/categories`, `/featured` |
| **Single-Item Resolution** | In-memory lookup | Collection pagination + local slug lookup | **Dynamic Route Builder** (`/posts/{slug}`, `/post-ids/{id}`, `/categories/{slug}`) |
| **Custom Fields** | Static JSON properties | Unprotected `meta:*` post meta | **Typed ACF Fields** (`acf:article_subtitle`, `acf:hero_image`, `acf:author_info`, `acf:related_resources`) + `meta:*` |
| **Authentication** | N/A | Optional `X-RKX-API-Studio-Key` header | Optional server-side `Authorization: Bearer <key>` (named keys supported) |
| **Endpoint Export File** | `src/data/*.json` | [`wordpress/config/free-endpoints.json`](wordpress/config/free-endpoints.json) | [`wordpress/config/pro-endpoints.json`](wordpress/config/pro-endpoints.json) |

---

## 3. Directory Structure

```text
headless-wordpress-astro-demo/
├── .env.example                # Environment template for Demo, Free, and Pro modes
├── docker-compose.yml          # Isolated local WordPress + MariaDB environment (port 8088)
├── astro.config.mjs            # Astro configuration with Tailwind v4 & Sitemap integrations
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # TypeScript strict configuration
│
├── wordpress/
│   ├── config/
│   │   ├── free-endpoints.json # Sanitized RKX API Studio Free v1 endpoint export
│   │   └── pro-endpoints.json  # Sanitized RKX API Studio Pro v1 endpoint export (Dynamic Routes + ACF)
│   └── scripts/
│       ├── setup-wordpress.sh  # Automated Docker + WP-CLI + content & endpoint setup script
│       └── seed-wordpress.php  # Idempotent content, media, ACF field group, and endpoint seeder
│
├── public/
│   ├── favicon.svg             # SVG brand icon
│   └── images/
│       ├── og-default.svg      # High-resolution 1200x630 default Open Graph banner
│       ├── articles/           # 8 custom 16:9 editorial SVG illustrations
│       └── authors/            # 3 author SVG avatar badges
│
└── src/
    ├── data/
    │   ├── categories.json     # 4 editorial taxonomy definitions (Demo Mode & WP seed source)
    │   └── posts.json          # 8 technical articles (Demo Mode & WP seed source)
    ├── lib/
    │   ├── types.ts            # Canonical TypeScript interfaces (Article, Category, Author, ContentAdapter)
    │   ├── content.ts          # Unified content provider & mode router (demo | free | pro)
    │   └── adapters/
    │       ├── mock.ts         # Standalone Demo Mode adapter
    │       ├── free.ts         # RKX API Studio Free adapter
    │       └── pro.ts          # RKX API Studio Pro adapter (Dynamic Routes, custom namespace, ACF)
    ├── components/             # Header, Footer, FeaturedArticle, ArticleCard, Pagination
    ├── layouts/                # BaseLayout.astro, ArticleLayout.astro
    ├── pages/                  # index, about, rss.xml.ts, blog/[slug], blog/page/[page], category/[slug]
    └── styles/
        └── global.css          # Tailwind CSS v4 import & editorial typography
```

---

## 4. Reproducible Setup & Running Each Mode

### Prerequisites
* **Node.js:** v22.23.4+ (LTS recommended, required by Astro 7)
* **npm:** v9+
* **Docker & Docker Compose:** Required only for `free` and `pro` modes.

```bash
# Install frontend dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Mode 1: Demo Mode (Zero Backend Dependencies)

Demo Mode runs immediately from `src/data/posts.json` and `src/data/categories.json` without starting Docker or WordPress:

```bash
# .env
CONTENT_MODE=demo
```

```bash
npm run dev
# Or run a production build:
CONTENT_MODE=demo npm run build
```

### Mode 2: Free Mode (WordPress + RKX API Studio Free)

1. Start the isolated Docker Compose environment (`rkx-headless-journal-wp` on `http://localhost:8088`) and seed the 8 articles, categories, tags, media library SVG illustrations, and endpoints:
   ```bash
   ./wordpress/scripts/setup-wordpress.sh
   ```
   The setup script installs **RKX API Studio Free from WordPress.org** and **Secure Custom Fields**. It does not install Pro. If Pro is **not** active, it seeds the Free endpoints. If Pro **is** active, it seeds the Pro endpoints instead; switch them to Free mode first:
   ```bash
   ./wordpress/scripts/switch-endpoint-mode.sh free
   ```
2. Configure `.env` for Free Mode:
   ```ini
   CONTENT_MODE=free
   WORDPRESS_API_URL=http://localhost:8088
   ```
3. Build or start the dev server:
   ```bash
   CONTENT_MODE=free WORDPRESS_API_URL=http://localhost:8088 npm run build
   ```

**Configured Free Endpoints ([`wordpress/config/free-endpoints.json`](wordpress/config/free-endpoints.json)):**
* `GET /wp-json/rkx-api-studio/v1/posts` — Paginated post collection (`per_page: 4`), reading `X-WP-TotalPages` across pages.
* `GET /wp-json/rkx-api-studio/v1/categories` — Editorial categories (`id`, `slug`, `name`, `description`, `count`).
* `GET /wp-json/rkx-api-studio/v1/featured` — Lead story filtered by the `featured` tag (`taxonomy_filters: { "post_tag": [5] }`).

### Mode 3: Pro Mode (RKX API Studio Pro + Dynamic Route Builder + ACF)

Pro Mode connects to WordPress with **RKX API Studio Pro** active, using a **configured Pro Custom Namespace (`rkx/v1`)**, **Dynamic Route Builder** single-item endpoints, and typed **ACF** field mappings.

> **Namespace Note (`rkx/v1` vs `rkx-api-studio/v1`):**
> * The built-in default namespace in both Free and Pro (when no custom namespace is selected) is **`rkx-api-studio/v1`**.
> * In this demo, `wordpress/scripts/seed-wordpress.php` and `wordpress/config/pro-endpoints.json` register **`rkx/v1`** as a Pro Custom Namespace (stored in the WordPress option `rkx_as_pro_namespaces` and assigned per endpoint in `rkx_as_pro_endpoint_data`).
> * Endpoint slugs are unique per HTTP method across namespaces. The `posts`, `categories` and `featured` endpoints are therefore served **either** under `rkx-api-studio/v1` (Free mode) **or** under `rkx/v1` (Pro mode), not both at the same time. Switch between them with `./wordpress/scripts/switch-endpoint-mode.sh free|pro`. It applies `free-endpoints.json` or `pro-endpoints.json` to those three endpoints through the plugin's REST API and leaves the single-item endpoints and all other settings unchanged.
> * If `rkx/v1` is removed from **RKX API Studio → Settings → API Namespaces**, the Pro endpoints fall back to `/wp-json/rkx-api-studio/v1/...`.

1. Install and activate **RKX API Studio Pro 1.1.0** with an active license, then make sure the collection endpoints are in Pro mode:
   ```bash
   ./wordpress/scripts/switch-endpoint-mode.sh pro
   ```
2. Configure `.env` for Pro Mode:
   ```ini
   CONTENT_MODE=pro
   WORDPRESS_API_URL=http://localhost:8088
   RKX_API_NAMESPACE=rkx/v1
   # Optional server-side Bearer API key for protected Pro endpoints:
   # RKX_API_KEY=your-named-pro-api-key
   ```
3. Run the production build or dev server:
   ```bash
   CONTENT_MODE=pro WORDPRESS_API_URL=http://localhost:8088 RKX_API_NAMESPACE=rkx/v1 npm run build
   ```

---

## 5. Dynamic Route Builder & Pro Endpoints

In **RKX API Studio Pro 1.1.0**, the **Dynamic Route Builder** registers true single-item REST routes that resolve a single published post or taxonomy term by URL parameter (`{slug}` or `{id}`) and return a **single JSON object** (rather than a 1-element array).

### Configured Pro Endpoints ([`wordpress/config/pro-endpoints.json`](wordpress/config/pro-endpoints.json))

All 6 Pro endpoints in `pro-endpoints.json` are assigned to the configured Pro custom namespace `rkx/v1` (if no custom namespace were assigned, they would be served under `/wp-json/rkx-api-studio/v1/...`):

| Public REST Route | Endpoint Slug | Dynamic Route Pattern | Response Shape | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET /wp-json/rkx/v1/posts` | `posts` | `""` *(Collection)* | `Array<Post>` | Paginated article list for static path discovery |
| `GET /wp-json/rkx/v1/featured` | `featured` | `""` *(Collection)* | `Array<Post>` | Featured lead article (`post_tag: [5]`) |
| `GET /wp-json/rkx/v1/categories` | `categories` | `""` *(Collection)* | `Array<Category>` | Editorial category collection |
| `GET /wp-json/rkx/v1/posts/{slug}` | `post-detail` | `posts/{slug}` | `Post` *(Object)* | Single article detail by slug + typed ACF fields |
| `GET /wp-json/rkx/v1/post-ids/{id}` | `post-by-id` | `post-ids/{id}` | `Post` *(Object)* | Single article detail by numeric WordPress post ID |
| `GET /wp-json/rkx/v1/categories/{slug}` | `category-detail` | `categories/{slug}` | `Category` *(Object)* | Single category term detail by slug |

### Dynamic Route Builder Rules & Behavior
* **Route Syntax:** 1 to 3 lowercase path segments (`[a-z0-9-]`) followed by `{slug}` or `{id}` (e.g. `posts/{slug}`, `post-ids/{id}`, `categories/{slug}`).
* **Conflict Prevention:** Two dynamic routes in the same namespace cannot share the same static base path (`posts/{slug}` and `posts/{id}` conflict because both match `/posts/<segment>`), so ID lookups use a distinct base path (`post-ids/{id}`). A static collection endpoint (`/posts`) and a dynamic single-item endpoint (`/posts/{slug}`) coexist cleanly in the same namespace.
* **Parameter Validation & Status Codes:**
  * **Valid slug/ID:** Returns `HTTP 200 OK` with a single JSON object.
  * **Missing record:** Returns `HTTP 404 Not Found` (`{"code": "rkx_as_not_found", "message": "No matching record was found."}`).
  * **Invalid parameter:** Non-positive or non-numeric IDs (`/post-ids/0`, `/post-ids/abc`) or disallowed slug punctuation (`/posts/invalid.slug`) return `HTTP 400 Bad Request` (`rest_invalid_param`).
  * **Unicode slugs:** Percent-encoded and UTF-8 slugs are normalized to lowercase percent-encoded UTF-8 matching WordPress `post_name` storage.
  * **Transient Caching:** Enabled responses return `X-RKX-API-Studio-Cache: MISS` on first resolution and `X-RKX-API-Studio-Cache: HIT` on subsequent requests. `404` responses are never cached.
  * **Fail-Closed Behavior (`HTTP 404` vs `HTTP 501`):**
    * **Active or Grace Period License:** Pro endpoints and dynamic routes serve `HTTP 200 OK`.
    * **Expired (after any grace period) or Revoked License (Pro still active):** Pro does not register dynamic routes (`/posts/{slug}` returns `HTTP 404 rest_no_route`) while continuing to suppress the underlying Free collection slug (`/post-detail` returns `HTTP 404`). Collection endpoints that map Pro ACF fields (`acf:*`) or Pro formatters fall back to `rkx-api-studio/v1` and fail closed with `HTTP 501 Not Implemented` (`rkx_as_unsupported_configuration`).
    * **Pro Deactivated or Uninstalled (Free running alone):** Free registers every saved GET endpoint under `/wp-json/rkx-api-studio/v1/{slug}`. Because dynamic endpoints store `"rkx_pro:dynamic_route"` in `fields`, Free rejects `/wp-json/rkx-api-studio/v1/post-detail` with `HTTP 501 Not Implemented` (`rkx_as_unsupported_configuration`) so a single-item route never degrades into a collection leak.

---

## 6. ACF Integration in Pro Mode

When an ACF-compatible plugin (such as **Secure Custom Fields** / **Advanced Custom Fields**) is active in WordPress, `wordpress/scripts/seed-wordpress.php` registers the **Editorial Article Metadata** field group (`group_rkx_editorial_metadata`) for `post` and populates all 8 articles with four representative fields:

| ACF Field Identifier | Field Type | JSON Output Key | Typed Response Shape |
| :--- | :--- | :--- | :--- |
| `acf:article_subtitle` | `text` | `article_subtitle` | `string` |
| `acf:hero_image` | `image` | `hero_image` | `{ url: string, alt: string, width: number, height: number }` |
| `acf:author_info` | `group` | `author_info` | `{ name: string, role: string, bio: string, avatar: string, github: string }` |
| `acf:related_resources` | `relationship` | `related_resources` | `Array<{ id: number, title: string, slug: string }>` |

`ProContentAdapter` ([`src/lib/adapters/pro.ts`](src/lib/adapters/pro.ts)) normalizes these typed ACF fields into the canonical `Article` and `Author` interfaces, and `ArticleLayout.astro` renders Pro-only UI enhancements (the `Pro Dynamic Route` badge, the `ACF Curated Reading Path` block from `acf:related_resources`, and the author's `GitHub Profile` link from `acf:author_info`) only when Pro data is available.

---

## 7. Endpoint Import / Export & Site-Specific Prerequisites

Both [`wordpress/config/free-endpoints.json`](wordpress/config/free-endpoints.json) and [`wordpress/config/pro-endpoints.json`](wordpress/config/pro-endpoints.json) use the official RKX API Studio v1 export schema (`version: 1`, `settings`, `endpoints`) and can be imported directly via **RKX API Studio → Import / Export** in the WordPress Admin UI.

### Prerequisites When Importing `pro-endpoints.json` on Another Site
1. **Plugins Required:**
   * **RKX API Studio Free** (1.0.1+ recommended; 1.0.0 works with Pro 1.1.0)
   * **RKX API Studio Pro** (1.1.0+ with an active Pro entitlement)
   * **Advanced Custom Fields (ACF)** or **Secure Custom Fields (SCF)** with the `Editorial Article Metadata` field group (`article_subtitle`, `hero_image`, `author_info`, `related_resources`).
2. **Custom Namespace (`rkx/v1`):**
   * The importer automatically registers custom namespaces included in imported endpoints, or you can add `rkx/v1` under **RKX API Studio → Settings → API Namespaces**.
3. **Site-Specific Taxonomy IDs:**
   * The `featured` endpoint filters by `taxonomy_filters: { "post_tag": [5] }`, where `5` is the `term_id` of the `featured` tag in the seeded database (`1..4` are the 4 categories). If importing into an existing WordPress database where the `featured` tag has a different `term_id`, update that filter in the endpoint builder.

---

## 8. Licensing & Security Notes

* **No Pro Source Code or Secrets in This Repository:** This public demo repository contains **no** RKX API Studio Pro source code, **no** Pro distribution ZIPs, **no** private SDK code, and **no** license keys or credentials.
* **Commercial Licensing:** RKX API Studio Pro features (Dynamic Route Builder, custom namespaces, ACF field mapping, named Bearer keys) require an active Pro license in production environments.
* **Server-Side Authentication Only:** When `RKX_API_KEY` is configured in `.env`, `ProContentAdapter` sends `Authorization: Bearer <RKX_API_KEY>` strictly during server-side Astro static build requests. Credentials are never exposed to browser or client-side code.

---

## 9. Optional: Local HTTPS & Media Proxy

The site works over plain HTTP (`http://localhost:4321` for Astro, `http://localhost:8088` for WordPress). If you serve it over local HTTPS, for example `https://demo.headless-journal.local` with a locally trusted certificate (such as one from `mkcert`) behind a reverse proxy:

* Proxy `/wp-content/*` to the WordPress container (`localhost:8088`) so Media Library files load over HTTPS without mixed-content warnings, and proxy everything else to the Astro server (`localhost:4321`).
* `astro.config.mjs` already proxies `/wp-content` to `http://localhost:8088` in `astro dev` and `astro preview`, and allowlists `demo.headless-journal.local`.
* Set `PUBLIC_MEDIA_BASE_URL` in `.env` if media should come from another origin.

---

## 10. Verification Commands

```bash
# 1. TypeScript & Astro type check across all adapters and templates
npm run check

# 2. Demo Mode production build
CONTENT_MODE=demo npm run build

# 3. Free Mode production build (requires local Docker WordPress on port 8088)
./wordpress/scripts/switch-endpoint-mode.sh free
CONTENT_MODE=free WORDPRESS_API_URL=http://localhost:8088 npm run build

# 4. Pro Mode production build (requires local Docker WordPress + Pro on port 8088)
./wordpress/scripts/switch-endpoint-mode.sh pro
CONTENT_MODE=pro WORDPRESS_API_URL=http://localhost:8088 RKX_API_NAMESPACE=rkx/v1 npm run build

# 5. Optional: verify local HTTPS and WordPress media delivery (if configured, see section 9)
curl -I https://demo.headless-journal.local/
curl -I https://demo.headless-journal.local/wp-content/uploads/2026/11/maintainable-apis.svg
```

---

## 11. Attribution & License

* Built with [Astro](https://astro.build) and [RKX API Studio](https://rkxbeta.com/plugins/rkx-api-studio).
* Released under the **MIT Open Source License**.
