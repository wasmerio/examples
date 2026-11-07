# FreshRSS + Wasmer

Deploy [FreshRSS](https://github.com/FreshRSS/FreshRSS), a personal RSS and Atom
reader, with SQLite storage and a feed refresh job every 20 minutes.

## Demo

Deploy your own copy, set the administrator secret described below, and open its
URL. Your feeds and account belong to that deployment. Anonymous reading is off
unless explicitly enabled; this recipe includes no shared administrator password.

## How it works

- The build downloads FreshRSS 1.30.4 at the commit and SHA-256 in `UPSTREAM.json`.
  No upstream PHP, controls or styles are changed.
- Wasmer runs 64-bit PHP 8.3.21 through `php/php-64@8.3.2102`; FreshRSS needs GMP
  only on 32-bit PHP. SQLite, cURL and all installer requirements are available.
- Only `upstream/p` is public. The `freshrss-data` volume mounts at `/data` and
  stores configuration, SQLite, cache and accounts across deployments.
- Startup copies absent defaults and calls the upstream CLI installer and account
  creator once. An existing data volume is preserved.
- `app.yaml` runs the upstream updater through `refresh` every 20 minutes. Wasmer
  selects a region supporting persistent volumes. This is a regional application.
- WASIX PHP lacks `dns_get_record`. A small compatibility file returns IPv4 DNS
  addresses through its native resolver. FreshRSS still checks those addresses
  and pins cURL to them to block private-network access and DNS rebinding.
  Feeds available only through IPv6 DNS are unsupported.

## Administrator setup

Before first startup, set these in the Wasmer application environment:

- **`FRESHRSS_ADMIN_PASSWORD`**: a secret of at least 16 characters, required.
- `FRESHRSS_ADMIN_USER`: optional alphanumeric login, defaults to `admin`.
- `FRESHRSS_BASE_URL`: your full public app URL, recommended.
- `FRESHRSS_ALLOW_ANONYMOUS`: optional `true` for a public read-only demo.

An unconfigured deployment returns HTTP 503 with setup instructions rather than
exposing an unclaimed installer. After setting the secret, redeploy. Startup
creates the account, then serves FreshRSS's original login and reader. Password
environment changes do not reset an existing account; use FreshRSS settings.

## Running locally

Use Node.js 24, `tar`, and PHP 8.1+ with FreshRSS's required extensions. Run:

```sh
node scripts/build.mjs
export DATA_PATH="$PWD/data"
# Set FRESHRSS_ADMIN_PASSWORD privately before running bootstrap.php.
php bootstrap.php
php -S 127.0.0.1:18128 -t upstream/p router.php
```

To use the actual Wasmer runtime, build and run with Anybuild instead:

```sh
anybuild build . --wasmer
anybuild . --wasmer --start --volume freshrss-data:/data
```

## Deploying to Wasmer

Select the public FreshRSS template, create its GitHub repository and deploy.
Set the secret and base URL above, then redeploy and sign in. For a monorepo
import, use `php-freshrss` as the root directory; the repository-root
`Anybuild.php-freshrss` loader preserves that configuration.

Back up `/data` before upgrades. Review a new upstream release, update the commit
and checksum, then test login, feed parsing, scheduled refresh and persistence.
Optional SMTP and third-party extensions need their own configuration.

## License and source

FreshRSS and this recipe use AGPL-3.0. Its full license is preserved in `LICENSE`.
Every build exposes the exact upstream archive and this recipe beneath `/source/`
for corresponding-source access. Existing upstream notices are retained.
