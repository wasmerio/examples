# Laravel starter

A Laravel 13 application with a Blade welcome page, a JSON status route and the shared
Wasmer starter components. PHP 8.3.29 is used by the Anybuild recipe. No Node toolchain
or database is required to render the welcome page.

## Build and run

From this directory, use Anybuild 0.33.3 with Docker available:

```sh
anybuild --builder docker --runner wasmer --start
```

For the catalog's repository-root build, use:

```sh
anybuild --subdir php-laravel-starter --anybuild-path Anybuild.php-laravel-starter --builder docker --runner wasmer --start
```

Open the address printed by Anybuild. `/api/status` returns the Laravel and PHP versions;
`/up` is Laravel's health endpoint. The template catalog entry is added only after this
source PR merges; this PR does not publish a catalog deployment link.

With native PHP 8.3+ and Composer installed, run `composer install`, copy `.env.example`
to `.env`, run `php artisan key:generate` and `php artisan serve`.

## Configure deployment

Set an `APP_KEY` deployment secret before using sessions or encrypted data. Anybuild
preserves a supplied key; without one it generates a fresh key for each build. Changing
that key invalidates existing sessions and previously encrypted data. Keep `APP_DEBUG=false`.
The sample uses cookie sessions, file cache and synchronous queues.

The deployment command runs `php artisan migrate --force`. SQLite is initialized for the
sample migrations, but the bundled database file is not persistent storage. Configure a
persistent database with Laravel's `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`,
`DB_USERNAME` and `DB_PASSWORD` settings before storing application data.

## Dependencies and shared UI

`laravel/framework` is pinned to 13.42.0. The build resolves transitive dependencies and
writes its generated `composer.lock` inside the build artifact; no lockfile is committed.
This keeps the source PR below the repository's 2,000-line limit, but rebuilding later may
resolve different transitive versions. Commit a reviewed lockfile in your own application
when you need reproducible dependency resolution. No development tools are preinstalled.

The page imports `public/wasmer-starter-ui.js`, generated from the repository's canonical
`_shared/starter-ui/wasmer-starter-ui.js`. It uses the shared card, title, text, badge,
feedback, layout and action components with their standard appearance.

From the repository root, refresh or verify the copy with:

```sh
node scripts/sync-starter-ui.mjs php-laravel-starter/public/wasmer-starter-ui.js
node scripts/sync-starter-ui.mjs --check php-laravel-starter/public/wasmer-starter-ui.js
```
