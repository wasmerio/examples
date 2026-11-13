# Symfony starter for Wasmer Edge

A Symfony 7.4 (LTS) skeleton on PHP 8.3 with an HTML page and a JSON endpoint, running on Wasmer Edge.

[Deploy this template](https://wasmer.io/templates/symfony-starter) from the Wasmer templates page.

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
