# Releasing Popular

Maintainer documentation. Versions are tagged in **lockstep** across
[hugo-theme-popular](https://github.com/Mariatta/hugo-theme-popular) and
[astro-theme-popular](https://github.com/Mariatta/astro-theme-popular); this
file ships identically in both (PARITY.md Tier 1).

## The release ritual

1. **Write the changelog in a PR.** Move the `## [Unreleased]` entries under
   a new `## [X.Y.Z] - date` heading (blank line after every heading). Bump
   the version shown in the footer: on Hugo, `popularVersion` in the theme's
   `hugo.toml`; on Astro, `"version"` in **all three** of `package.json`,
   `package/package.json` and `create-popular-site/package.json` (keep the two
   repos' versions equal). The release workflow validates all three and
   refuses a mismatch, because `create-popular-site` scaffolds sites pinned to
   `^<its own version>`: a lagging scaffolder hands new sites an old theme.
   Use the same branch name in both repos so the parity CI pairs them; cut
   both branches from freshly pulled mains.
2. **Merge the pair together.**
3. **Dispatch the release in both repos:**

   ```bash
   gh workflow run release.yml -R Mariatta/hugo-theme-popular -f version=X.Y.Z
   gh workflow run release.yml -R Mariatta/astro-theme-popular -f version=X.Y.Z
   ```

The workflow validates (semver input, changelog section present, tag free,
cross-repo parity, and on Astro the version fields), then tags `vX.Y.Z`,
publishes the GitHub Release with the changelog section as notes, and (Astro)
publishes **two** packages to npm: `astro-theme-popular` (the theme) and
`create-popular-site` (the scaffolder behind `npm create popular-site@latest`).

`create-popular-site` ships its templates in the tarball but not in the repo:
`prepack` collects them from `demos/*`, so `demos/` stays the single source of
truth. That means it must be published from a checkout that still has `demos/`,
which the workflow does. Publishing it by hand from a bare tarball would ship
a scaffolder with no templates.

Merging a PR does **not** release anything; the dispatch is the deliberate
act. Nothing releases with the repos out of parity.

## npm credentials

Two different credentials for two different jobs; don't mix them up.

### CI (the release workflow): trusted publishing, no token

The workflow authenticates to npm with its OIDC identity (like PyPI's
trusted publishers): nothing expires, nothing is stored, and provenance
attestations are generated automatically. One-time setup on npmjs.com,
package page → **Settings** → **Trusted Publisher**:

- Publisher: **GitHub Actions**
- Organization or user: `Mariatta`
- Repository: `astro-theme-popular`
- Workflow filename: `release.yml`
- Environment: leave blank

**Do this for both packages.** `astro-theme-popular` and `create-popular-site` are
separate packages on npmjs.com and each needs its own Trusted Publisher entry,
pointing at the same repo and the same workflow file. A missing entry on the
second one fails the release *after* the tag is pushed, which is the case the
local-publish fallback below exists for.

### Bootstrapping a brand-new package name

npm will not let you configure a trusted publisher for a package that does not
exist yet, and the release workflow publishes only through OIDC. So the *first*
version of a new package name has to be published by hand, once:

```bash
cd <package-dir>
npm login          # browser flow, once per machine
npm publish        # prompts for your authenticator OTP
```

Then add the Trusted Publisher as above, and every release after that is
hands-off. Two things to get right:

- **Publish from a full checkout.** `create-popular-site`'s `prepack` collects
  its templates from `demos/` and `scripts/templates/`; a bare tarball would
  publish a scaffolder that can scaffold nothing.
- **Bootstrap at a version whose theme release already exists.** The scaffolder
  pins `astro-theme-popular@^<its own version>`, and a caret on `0.x` does not
  cross the minor. `create-popular-site@0.10.0` was bootstrapped with templates
  from a `main` that had moved past the published 0.10.0 theme, so every site it
  scaffolded failed to build, and it had to be deprecated. If the templates have
  moved on, cut the theme release first, or expect to deprecate the bootstrap.

The workflow side is already wired: `permissions: id-token: write` and
Node 24 (trusted publishing needs npm >= 11.5.1). Any old `NPM_TOKEN`
secret and granular tokens can be deleted
(`gh secret delete NPM_TOKEN -R Mariatta/astro-theme-popular`).

### Local (one-off publishes): your own login

`npm login` once per machine (browser flow); `npm publish` from `package/`
then prompts for your authenticator OTP interactively. This is the fallback
when a release's npm step failed after tagging: the workflow cannot be
re-dispatched for an existing tag, so publish that version manually:

```bash
git pull && cd package && npm publish
```

The registry version must always equal the latest git tag; the workflow's
validate step enforces the version fields so the two cannot drift for
future releases.

## Troubleshooting

- **Auth errors in the workflow's npm step** (`EOTP`, 401/404 on PUT):
  the Trusted Publisher is missing or misconfigured on npmjs.com (the repo
  and workflow filename must match exactly); see above. Fix it, publish the
  stranded version manually, and the next release is hands-off.
- **Local `npm whoami` says E401 / publish 404s on PUT**: your login
  session was revoked (npm expires sessions aggressively now); `npm login`
  again and retry.
- **"tag vX.Y.Z already exists"**: that version is released; the workflow
  refuses reruns by design. If npm is behind, use the local publish.
- **Parity refusal**: the two repos' shared files differ; sync them
  (`bash scripts/sync-shared.sh --check` shows the drift) and re-dispatch.
- **A paired PR's parity check fails right after pushing**: the twin branch
  probably didn't exist yet when the check ran; re-run the failed job once
  both branches are pushed.
