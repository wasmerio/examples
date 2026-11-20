<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Session\Middleware\StartSession;

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();
// Keep failing assertions observable as a nonzero exit code.
restore_exception_handler();

if (filled(config('app.key'))) {
    throw new RuntimeException('Run this test without an app key.');
}

foreach (['/' => 'Your Laravel app is running', '/api/status' => '"status":"ok"', '/up' => 'Application up'] as $path => $expected) {
    $request = Request::create($path);
    $response = $kernel->handle($request);
    if ($response->getStatusCode() !== 200 || ! str_contains($response->getContent(), $expected)) {
        throw new RuntimeException("Unconfigured starter route {$path} did not return its expected HTTP 200 response.");
    }
    if ($response->headers->getCookies() !== []) {
        throw new RuntimeException("Unconfigured starter route {$path} set a cookie.");
    }
    $kernel->terminate($request, $response);
}

$router = $app->make(Router::class);
$webRoute = $router->get('/test-web-middleware', static fn (Request $request) => $request->session()->token())
    ->middleware('web');
$middleware = $router->gatherRouteMiddleware($webRoute);
foreach ([EncryptCookies::class, StartSession::class, PreventRequestForgery::class] as $required) {
    if (! in_array($required, $middleware, true)) {
        throw new RuntimeException('Application routes must retain Laravel web middleware.');
    }
}

config([
    'app.key' => 'base64:'.base64_encode(random_bytes(32)),
    'session.driver' => 'array',
]);
$request = Request::create('/test-web-middleware');
$response = $kernel->handle($request);
if ($response->getStatusCode() !== 200 || $response->headers->getCookies() === []) {
    throw new RuntimeException('A web route with an explicit key must support sessions and cookies.');
}
$kernel->terminate($request, $response);

echo "Passed: welcome, API status and health work without an app key, and standard web routes retain their middleware.\n";
