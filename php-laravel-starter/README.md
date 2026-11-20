# Laravel starter

A Laravel 13 application with a Blade welcome page, a JSON status route and the shared
Wasmer starter components. PHP 8.3.29 is used by the Anybuild recipe. No Node toolchain
or database is required to render the welcome page.

## Build and run

From the repository root, use Anybuild 0.33.3 with Docker available. This is the build CI runs,
and it uses the root `Anybuild.php-laravel-starter` recipe:

```sh
anybuild auto . --docker --wasmer --subdir php-laravel-starter
```

From this directory, `anybuild auto . --docker --wasmer` uses the local `Anybuild` recipe. Add
`--start` to serve the result and open the address printed by Anybuild. `/api/status` returns the Laravel and PHP versions;
`/up` is Laravel's health endpoint. The template catalog entry is added only after this
source PR merges; this PR does not publish a catalog deployment link.

With native PHP 8.3+ and Composer installed, run `composer install`, copy `.env.example`
to `.env`, run `php artisan key:generate` and `php artisan serve`.

## Configure deployment

The welcome page and `/api/status` are read-only routes that can run on Wasmer Edge
without an `APP_KEY` or a database. Add routes that need sessions, forms or authentication
outside the starter route group in `routes/web.php` so they use Laravel's web middleware.
Set an `APP_KEY` secret on your app before using sessions or encrypted data; generate one with
`php artisan key:generate --show`. The build never generates a key and does not run
`php artisan config:cache`, because Anybuild's prepare steps run at build time: a cached
configuration would ship build-time values in every copy of the artifact and ignore secrets
set later. `APP_KEY`, `DB_*` and other settings are read from the app's environment at runtime.
Changing the key invalidates existing sessions and previously encrypted data. Keep `APP_DEBUG=false`.
The local `.env.example` uses cookie sessions, file cache and synchronous queues.

The deployment command runs `php artisan migrate --force`. SQLite is initialized for the
sample migrations, but the bundled database file is not persistent storage. Configure a
persistent database with Laravel's `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`,
`DB_USERNAME` and `DB_PASSWORD` settings before storing application data.

## Check an unconfigured deploy

In a clean copy with dependencies installed, run `php tests/starter-routes.php` before
creating a `.env` or setting `APP_KEY`. This checks the welcome page, API status and health
route under the same keyless configuration as a new hosted deployment.

## Dependencies and shared UI

`laravel/framework` is pinned to 13.42.0, and `composer.lock` locks the full dependency tree
so every build installs the same versions. Run `composer update --no-install` after changing
`composer.json` and commit the updated lockfile. No development tools are preinstalled.

The page imports `public/wasmer-starter-ui.js`, generated from the repository's canonical
`_shared/starter-ui/wasmer-starter-ui.js`. It uses the shared card, title, text, badge,
feedback, layout and action components with their standard appearance.

From the repository root, refresh or verify the copy with:

```sh
node scripts/sync-starter-ui.mjs php-laravel-starter/public/wasmer-starter-ui.js
node scripts/sync-starter-ui.mjs --check php-laravel-starter/public/wasmer-starter-ui.js
```
