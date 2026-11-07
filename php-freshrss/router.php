<?php
declare(strict_types=1);
$data = getenv('DATA_PATH') ?: __DIR__ . '/data';
if (!is_file($data . '/.wasmer-ready')) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo "FreshRSS needs administrator setup.\nSet the secret FRESHRSS_ADMIN_PASSWORD (at least 16 characters) in your Wasmer app environment and redeploy.\nOptional: FRESHRSS_ADMIN_USER and FRESHRSS_BASE_URL.\n";
    return true;
}
// PHP serves only upstream/p. Configuration, SQLite and sessions stay outside it.
return false;
