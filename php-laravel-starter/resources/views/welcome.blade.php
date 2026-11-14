<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A Laravel application running on Wasmer Edge.">
    <title>Laravel starter · Wasmer</title>
    <style>body { margin: 0; }</style>
    <script type="module" src="{{ asset('wasmer-starter-ui.js') }}"></script>
</head>
<body>
    <wasmer-starter>
        <wasmer-card>
            <wasmer-stack slot="header" vertical>
                <wasmer-badge>Laravel {{ app()->version() }}</wasmer-badge>
                <wasmer-title>Your Laravel app is running</wasmer-title>
                <wasmer-text>Build your next idea with Laravel on Wasmer Edge.</wasmer-text>
            </wasmer-stack>
            <wasmer-notice variant="success">This page is rendered by Laravel Blade using PHP {{ PHP_VERSION }}.</wasmer-notice>
            <wasmer-text>Edit resources/views/welcome.blade.php to make it yours. Add routes in routes/web.php when you are ready.</wasmer-text>
            <wasmer-stack>
                <wasmer-action href="{{ url('/api/status') }}" size="lg">Check API status</wasmer-action>
                <wasmer-action href="https://laravel.com/docs/13.x" variant="outline" size="lg" target="_blank">Laravel docs</wasmer-action>
            </wasmer-stack>
            <wasmer-text slot="footer">A small starting point: no JavaScript build step, no database needed for this page.</wasmer-text>
        </wasmer-card>
    </wasmer-starter>
    <noscript>Enable JavaScript to display the shared Wasmer interface. The API status endpoint remains available at /api/status.</noscript>
</body>
</html>
