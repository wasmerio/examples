# FreshRSS deployment evidence

- Ticket: [ECO-528](https://linear.app/wasmer/issue/ECO-528/publish-freshrss-as-a-reusable-wasmer-app-template).
- Runtime source: `1b813c13d096dbd0cebebe5774ab0c44ca3ff441`; later commits change documentation/evidence only.
- FreshRSS: 1.30.4, upstream `08f97bd497ace733c151ea1c709d85cd5b65cc53`; all 1,273 original files remain unchanged.
- Public catalog: <https://wasmer.io/templates/freshrss>, ID `at_VKAmI3tvCzOK`.
- Demo: <https://freshrss-template.wasmer.app/i/>, app `da_K0DIkt5Ua5a9`.
- Demo redeployment: build `f90e71a5-ce98-4b8a-b336-8d92341e792d`, 15 seconds, version `dav_nzrI7tauAVpG`.
- Independent catalog app: <https://freshrss-copy-1106.wasmer.app/i/>, ID `da_RrWI0t5UjNjO`.
- Independent build: `d78475bf-5aa8-4ae6-9dd3-1967f6f51793`, 72 seconds, version `dav_K1EIZtBugQva`.

## Runtime and core results

- Wasmer 64-bit PHP 8.3.21: all 21 installer checks passed.
- IPv4 DNS shim: public DNS resolves; three private addresses rejected; original FreshRSS address filtering and cURL pinning remain unchanged.
- Empty volume without administrator secret: root and installer return HTTP 503; no readiness marker.
- Installed local volume restarted without password: one account, one SQLite database, one feed and 10 entries retained; account configuration unchanged.
- Hosted demo after redeployment: existing administrator password still works; one feed, 10 total articles and nine unread retained.
- PHP browser session expired during redeployment; login again succeeds. Session storage is temporary; account/feed/read state is persistent.
- Independent catalog app: private login by default; administrator login and Update feeds succeeded, producing 10 FreshRSS release articles.
- No credentials are shown in the screenshots or stored in the recipe.

## Scheduling and volume results

- Demo volume `avol_LmILtxkCXZrr` and API-created job `cron_RjPIgt1JtoQq` survived redeployment.
- Demo job is enabled at `*/20 * * * *`; three observed invocations succeeded with exit code zero.
- Independent volume `avol_rWI0tDwCVPoM` mounts `/data`.
- Independent job `cron_n73IatMGtOWe` was present immediately after deployment, before any ensure/create call: source `CONFIG`, enabled, schedule `*/20 * * * *`, command `refresh`.
- The flattened catalog repository therefore applies root `app.yaml` automatically. Anybuild 0.26.4's monorepo-subdirectory path did not merge nested cron configuration; the README documents the separate setup needed there.

## Rendered review

- `freshrss-1b813c1-desktop.jpg`: 1440×900; hosted reader with nine unread entries.
- `freshrss-1b813c1-reader-desktop.jpg`: 1425×802 desktop content crop; opened article body.
- `freshrss-1b813c1-tablet.jpg`: corrected 768×1024 capture; upstream responsive reader controls.
- `freshrss-1b813c1-mobile.jpg`: 390×844; original narrow-screen reader layout.
- `freshrss-dd12e5f-copy-login.jpg`: 1440×900; independent private app's login, fields empty.
- `freshrss-dd12e5f-catalog-copy.jpg`: 1440×900; independent app after login and successful refresh, 10 unread entries.
- `freshrss-dd12e5f-persistence.jpg`: 1440×900; 10 total entries and nine unread after hosted redeployment.
- `freshrss-7747fba-secret-guard.jpg`: 1440×900; actual Wasmer PHP 64-bit missing-secret HTTP 503 page on local port 18129, same runtime code and new empty data volume.
- Canonical references: upstream `app/views/index/index.phtml`, `app/views/index/reader.phtml`, `app/views/helpers/index/article.phtml` and theme assets under `p/themes`.
- Original FreshRSS controls, surfaces, colors, typography and responsive styles are preserved; no template UI replacements or style overrides.
- Not run: every extension, full localization/accessibility matrix, or IPv6-only DNS feeds (unsupported).
