load("//anybuild:serve.bzl", "build")
load("//anybuild/tools:node.bzl", "node_toolchain")
load("//anybuild/tools:node_static.bzl", "nodestatic_config")
load("//anybuild/tools:staticfile.bzl", "staticfile_serve", "sws_config_mount", "sws_config_step")

def configure(app_subdir = None):
    config = nodestatic_config(
        schema = 1,
        app_subdir = app_subdir,
        node_framework = "vite",
        node_server = "node",
        node_version = "24.16.0",
        node_package_manager = "npm",
        node_build_command = "npm run build",
        commands = {"install": "npm ci --no-audit --no-fund"},
        static_dir = "dist",
        static_redirects_config = """[[advanced.headers]]
source = "/**"
[advanced.headers.headers]
Content-Security-Policy = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-eval' blob: https://cdn.jsdelivr.net/npm/@bentopdf/pymupdf-wasm@0.11.16/ https://cdn.jsdelivr.net/npm/@bentopdf/gs-wasm@0.1.1/assets/ https://cdn.jsdelivr.net/npm/coherentpdf@2.5.5/dist/ https://cdn.jsdelivr.net/npm/tesseract.js@v7.0.0/dist/ https://cdn.jsdelivr.net/npm/tesseract.js-core@v7.0.0/; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com https://rawcdn.githack.com; connect-src 'self' blob: https://fonts.gstatic.com https://cdn.jsdelivr.net https://bentopdf-cors-proxy.bentopdf.workers.dev https://rawcdn.githack.com; object-src 'none'; base-uri 'self'; frame-src 'self' blob:; frame-ancestors 'self'; form-action 'self'"
X-Frame-Options = "SAMEORIGIN"
X-Content-Type-Options = "nosniff"
X-XSS-Protection = "1; mode=block"
Referrer-Policy = "strict-origin-when-cross-origin"
Permissions-Policy = "geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()"
Cross-Origin-Opener-Policy = "same-origin"
Cross-Origin-Embedder-Policy = "credentialless"
Cross-Origin-Resource-Policy = "cross-origin"

[[advanced.headers]]
source = "/docs"
[advanced.headers.headers]
Content-Security-Policy = "default-src 'self'; script-src 'self' 'sha256-DQUgNM9X0iH2019NkUxeBvnBoEoRKkHBc/I0iLqPNPA=' 'sha256-La1r0VSk0Po4KFI0duEKhmPu+u0I416JW3oONqtdf4M='; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com https://rawcdn.githack.com; connect-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://bentopdf-cors-proxy.bentopdf.workers.dev https://rawcdn.githack.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'"

[[advanced.headers]]
source = "/docs/**"
[advanced.headers.headers]
Content-Security-Policy = "default-src 'self'; script-src 'self' 'sha256-DQUgNM9X0iH2019NkUxeBvnBoEoRKkHBc/I0iLqPNPA=' 'sha256-La1r0VSk0Po4KFI0duEKhmPu+u0I416JW3oONqtdf4M='; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com https://rawcdn.githack.com; connect-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://bentopdf-cors-proxy.bentopdf.workers.dev https://rawcdn.githack.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'"
""",
        sws_version = "2.38.0",
    )
    toolchain = node_toolchain(config, serving = False)
    temp = mount("temp")
    static_app = mount("static_app")
    static_config = sws_config_mount(config)
    site = build(
        steps = [
            use(*toolchain.build_deps),
            workdir(temp.path),
            copy(app_subdir or ".", ".", ignore = [".git", "node_modules", ".cache", "dist"]),
            run("npm ci --no-audit --no-fund", group = "install"),
            run("npm run build", outputs = ["dist"], group = "build"),
            run("cp -R dist/. '{}/'".format(static_app.path)),
            sws_config_step(config, static_config),
        ],
        mounts = [static_app, static_config],
        static_app = static_app,
        static_config = static_config,
    )
    staticfile_serve(
        config,
        site,
        name = "bentopdf",
    )
