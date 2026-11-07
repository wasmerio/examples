<?php
declare(strict_types=1);
$data = getenv('DATA_PATH') ?: __DIR__ . '/data';
if (!is_file($data . '/applied_migrations.txt')) {
    fwrite(STDOUT, "Feed refresh waits for administrator setup.\n");
    exit(0);
}
require __DIR__ . '/upstream/app/actualize_script.php';
