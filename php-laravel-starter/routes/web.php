<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');

Route::get('/api/status', function () {
    return response()->json([
        'status' => 'ok',
        'framework' => 'Laravel',
        'version' => app()->version(),
        'php' => PHP_VERSION,
    ]);
});
