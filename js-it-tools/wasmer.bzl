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
        sws_version = "2.38.0",
        static_redirects_config = """[[advanced.redirects]]
source = "/source"
destination = "/source/README.txt"
kind = 302

[[advanced.redirects]]
source = "/source/"
destination = "/source/README.txt"
kind = 302
""",
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
    staticfile_serve(config, site, name = "it-tools")
