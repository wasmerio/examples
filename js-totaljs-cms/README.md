# Total.js CMS on Wasmer Edge

[Total.js CMS](https://docs.totaljs.com/cms/) running on
[Wasmer Edge](https://wasmer.io/products/edge) using
[EdgeJS](https://github.com/wasmerio/edgejs) (the `wasmer/edgejs-quickjs`
package) as the JavaScript runtime.

Upstream sources are **not** committed here. `setup.mjs` downloads the pinned
Total.js CMS source into the gitignored `app/` directory, applies the patch
in `patches/`, and copies in the files from `overlay/`. Total.js apps have no
build step — the source is the final artifact, so the whole app (including
its single production dependency, `total5`) is shipped in the package and
runs directly on EdgeJS.

## Setup & install

```bash
node setup.mjs
cd app
npm install    # npm (not pnpm): node_modules is shipped inside the package and must contain real files
cd ..
```

## Run locally with Wasmer

```bash
wasmer run . --net --env PORT=8000
```

Then open [http://localhost:8000/admin/](http://localhost:8000/admin/)
(default CMS credentials are configured in `app/config`).

## Deploy to Wasmer Edge

Update the `name` fields in `wasmer.toml` and `app.yaml` to use your own
namespace, then:

```bash
wasmer deploy
```

## Storage & persistence

The CMS uses Total.js' built-in **filesystem database** (`app/databases/`),
so no external database server is required.

> **Note:** on Wasmer Edge the package filesystem is not persistent — content
> created through the CMS admin UI (pages, posts, uploads) will not survive
> an instance restart. For real deployments attach a
> [volume](https://docs.wasmer.io/edge/guides/volumes) or treat the
> deployment as read-mostly.

## Patches & overlay

- `patches/0001-edgejs-single-process.patch` — sets `options.watcher = false`
  in `index.js` (upstream's default debug launcher forks a detached worker
  and exits the supervisor, which is incompatible with single-process hosts),
  and pins `total5` to the verified `0.0.18` (upstream floats on `latest`).
- `overlay/package-lock.json` — lockfile matching the pinned dependency.
- `etc/passwd` (mounted at `/etc`) — the published EdgeJS package ships no
  passwd database, and Total.js calls `os.userInfo()` at startup, which
  otherwise fails with `ENOENT`.
