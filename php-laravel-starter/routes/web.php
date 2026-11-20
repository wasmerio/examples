<?php

use Illuminate\Support\Facades\Route;

// The read-only starter routes can run before an app key or database is configured.
Route::withoutMiddleware('web')->group(function () {
    Route::view('/', 'welcome');

    Route::get('/api/status', function () {
        return response()->json([
            'status' => 'ok',
            'framework' => 'Laravel',
            'version' => app()->version(),
            'php' => PHP_VERSION,
        ]);
    });
});
