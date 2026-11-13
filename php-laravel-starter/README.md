# Laravel starter for Wasmer Edge

A fresh Laravel 13 application on PHP 8.3, ready for Wasmer Edge. Sessions use encrypted cookies and the cache uses files, so the welcome page needs no database.

[Deploy this template](https://wasmer.io/templates/laravel-starter) from the Wasmer templates page.

## How it works

- Routes are in `routes/web.php`; the welcome page is `resources/views/welcome.blade.php`.
- Wasmer installs Composer and npm dependencies, builds the Vite assets and caches config, routes and views.
- `Anybuild` adds two steps to the standard Laravel build: it creates `.env` from `.env.example` and generates an `APP_KEY` when none is set.
- After each deploy Wasmer runs `php artisan migrate --force` against the SQLite database in `database/database.sqlite`.

## Configuration

Set an `APP_KEY` secret on your app (generate one with `php artisan key:generate --show`). Without it, each deploy gets a new key and signs everyone out. To use a database, attach one to the app and set `DB_CONNECTION` and the `DB_*` variables.

## Run it locally

```bash
composer install
npm install && npm run build
cp .env.example .env
php artisan key:generate
php artisan serve
```

Then open http://localhost:8000/.
