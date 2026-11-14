# Symfony starter for Wasmer Edge

A Symfony 7.4 (LTS) skeleton on PHP 8.3 with an HTML page and a JSON endpoint, running on Wasmer Edge.

After catalog registration, [deploy this template](https://wasmer.io/templates/symfony-starter) from the Wasmer templates page.

## How it works

- `src/Controller/HomeController.php` serves `/` and `/api/hello` with attribute routes.
- `.env` sets `APP_ENV=prod`. For local development, create `.env.local` with `APP_ENV=dev`.
- Wasmer installs Composer dependencies and serves `public/index.php`.

## Configuration

Set an `APP_SECRET` secret on your app before you add forms, sessions or login.

## Run it locally

```bash
composer install
echo 'APP_ENV=dev' > .env.local
php -S localhost:8000 -t public
```

Then open http://localhost:8000/.

Catalog registration follows source merge; this PR does not publish the catalog entry. Direct dependencies are pinned, and build tools generate dependency resolutions; transitive dependencies can change between builds.

## Shared UI

The landing page uses the framework-neutral Wasmer starter components documented in `_shared/starter-ui/DESIGN.md`. Run `node scripts/sync-starter-ui.mjs --check php-symfony-starter/public/starter-ui.js` from the repository root to check the generated copy.

Set `APP_SECRET` to a unique random secret before adding sessions, signed links or other security features. This stateless starter does not enable them. No shared development secret is committed.
