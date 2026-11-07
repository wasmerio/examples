# go-httpbin + Wasmer

Run your own HTTP testing service with [go-httpbin](https://github.com/mccutchen/go-httpbin): inspect requests, echo JSON, follow redirects, and generate HTTP status responses. The upstream endpoint directory and response pages are served unchanged.

## Demo

Deploy this example to get a live URL. Open `/` for the upstream endpoint directory, `/get?message=hello` to inspect a request, `/redirect/2` for a redirect chain, or `/status/418` for a test error response.

## How it Works

- `go.mod` pins upstream **v2.25.0**, whose own `go.mod` requires **Go 1.25.0**. `go.sum` verifies the module content; no `@latest` dependency is used.
- `main.go` serves the upstream handler on `0.0.0.0:$PORT`, defaulting to `8080`. The app needs no database, external service, persistent storage, GPU, or API key.
- Upstream embeds its original HTML, styles, forms, and image assets into the Go module. This template adds no replacement page, controls, or styling.
- The `Anybuild` recipe compiles the app and includes its MIT license in the runtime package. The repository-root `Anybuild.go-httpbin` loader supports monorepo builds with `--subdir go-httpbin`.
- Wasmer builds use the WASIX-enabled Go compiler selected by Anybuild. Ordinary Go's `wasip1` compiler does not establish HTTP server compatibility; a successful native build alone is not a Wasmer deployment test.

## Running Locally

Use Go 1.25 or newer:

```bash
go mod download
mkdir -p .cache
go build -trimpath -o .cache/go-httpbin .
PORT=18127 .cache/go-httpbin
```

Open <http://127.0.0.1:18127/>. With the server running, check the core endpoints:

```bash
python3 scripts/check.py http://127.0.0.1:18127
```

The nine smoke cases cover the upstream home page, query/header inspection, JSON POST, reflected header filtering, redirects, and status responses. The same script accepts a deployed HTTPS URL.

## Configuration

- `PORT`: listening port, default `8080`.
- `ALLOWED_REDIRECT_DOMAINS`: comma-separated external hosts permitted by `/redirect-to`, default `example.com`. Relative redirect endpoints work normally.
- Generic request-header reflection excludes `Authorization` and `Cookie`. Dedicated upstream authentication and cookie endpoints retain their normal behavior.
- Upstream defaults bound request/response bodies to 1 MiB and generated delays to 10 seconds. This is a request-testing app, not a persistent webhook inbox.

## Deploying to Wasmer

Import `https://github.com/wasmerio/examples` and select `go-httpbin` as the application root, or upload this self-contained folder. Keep the supplied `Anybuild` definition so the Go compiler and start command remain explicit.

For a local Wasmer build with Anybuild 0.26.4 and a Docker-compatible builder:

```bash
anybuild build . --wasmer --docker
anybuild run . --wasmer --start
```

From the repository root, inspect the monorepo configuration with:

```bash
anybuild plan . --subdir go-httpbin --wasmer
```

The build/run commands prepare and run locally; they do not publish an app. Hosted deployment, browser review, WebSocket echo, streaming, and the complete upstream endpoint catalog must be verified separately rather than inferred from the core HTTP smoke cases.

## License and Upstream

go-httpbin is copyright Will McCutchen and uses the [MIT license](https://github.com/mccutchen/go-httpbin/blob/v2.25.0/LICENSE). The template uses the same license and preserves that notice in [LICENSE](LICENSE), which is also copied into the deployed package. Canonical UI references are the pinned upstream [endpoint directory](https://github.com/mccutchen/go-httpbin/blob/v2.25.0/httpbin/static/index.html.tmpl) and [POST form](https://github.com/mccutchen/go-httpbin/blob/v2.25.0/httpbin/static/forms-post.html.tmpl).
