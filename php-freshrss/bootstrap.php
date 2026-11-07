<?php
declare(strict_types=1);

$data = getenv('DATA_PATH') ?: __DIR__ . '/data';
if (!is_dir($data) && !mkdir($data, 0700, true)) {
    throw new RuntimeException('Cannot create the FreshRSS data directory');
}
// Copy only absent defaults; a new deployment must never replace stored data.
$defaults = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(__DIR__ . '/upstream/data', FilesystemIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);
foreach ($defaults as $entry) {
    $target = $data . '/' . $defaults->getSubPathName();
    if ($entry->isDir()) {
        if (!is_dir($target)) mkdir($target, 0700, true);
    } elseif (!file_exists($target)) {
        copy($entry->getPathname(), $target);
    }
}
putenv('DATA_PATH=' . $data);
$password = getenv('FRESHRSS_ADMIN_PASSWORD') ?: '';
if (strlen($password) < 16) {
    // The router explains setup without exposing an unclaimed web installer.
    exit(0);
}
$user = getenv('FRESHRSS_ADMIN_USER') ?: 'admin';
if (!preg_match('/^[A-Za-z0-9]{1,38}$/D', $user)) {
    throw new RuntimeException('FRESHRSS_ADMIN_USER must be alphanumeric');
}
function runFreshRSS(array $arguments): void {
    $process = proc_open(array_merge(['php'], $arguments), [STDIN, STDOUT, STDERR], $pipes, __DIR__);
    if (!is_resource($process) || proc_close($process) !== 0) throw new RuntimeException('FreshRSS setup failed');
}
$lock = fopen($data . '/.setup.lock', 'c');
if ($lock === false || !flock($lock, LOCK_EX)) throw new RuntimeException('Cannot lock FreshRSS setup');
try {
    if (!is_file($data . '/applied_migrations.txt')) {
        runFreshRSS([
            'upstream/cli/do-install.php', '--default-user=' . $user, '--db-type=sqlite',
            '--environment=production', '--auth-type=form', '--disable-update=true',
            '--allow-anonymous=' . (getenv('FRESHRSS_ALLOW_ANONYMOUS') === 'true' ? 'true' : 'false'),
            '--allow-anonymous-refresh=false', '--api-enabled=false',
            '--base-url=' . (getenv('FRESHRSS_BASE_URL') ?: ''),
        ]);
    }
    if (!is_file($data . '/users/' . $user . '/config.php')) {
        runFreshRSS(['upstream/cli/create-user.php', '--user=' . $user, '--password=' . $password]);
    }
    file_put_contents($data . '/.wasmer-ready', "FreshRSS setup complete\n");
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}
