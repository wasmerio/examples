load("//anybuild:serve.bzl", "build", "serve")
load("//anybuild/tools:php.bzl", "php_config")

def configure(app_subdir = None):
    config = php_config(
        schema = 1,
        app_subdir = app_subdir,
        php_version = "8.3",
        php_architecture = "64-bit",
        phpix = False,
        composer_enable = False,
        php_public_dir = "upstream/p",
        port = 8080,
    )
    temp = mount("temp")
    app = mount("app")
    output = build(
        steps = [
            use(dep("node", "24.16.0")),
            workdir(temp.path),
            copy(app_subdir or ".", ".", ignore = [".git", ".anybuild", ".cache", "upstream", "data"]),
            # Anybuild excludes its entry file from directory copies.
            write("{}/Anybuild".format(temp.path), 'load("wasmer.bzl", "configure")\nconfigure()\n'),
            run("node scripts/build.mjs", group = "build"),
            run('cp -R upstream bootstrap.php router.php refresh.php dns-compat.php php.ini "{}/"'.format(app.path)),
        ],
        serve_deps = [dep("php", "8.3", architecture = "64-bit"), dep("bash")],
        mounts = [app],
        env = {"DATA_PATH": "/data", "PHP_INI_SCAN_DIR": "/app"},
    )
    serve(
        config,
        output,
        name = "freshrss",
        cwd = app.serve_path,
        commands = {
            "start": "bash -c 'php bootstrap.php && exec php -S 0.0.0.0:8080 -t upstream/p router.php'",
            "refresh": "php /app/refresh.php",
        },
        volumes = [volume("freshrss-data", "/data")],
    )
