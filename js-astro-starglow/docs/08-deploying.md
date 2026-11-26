# Deploying to GitHub Pages

The included `deploy.yml` publishes `dist/` to GitHub Pages on every push to `main`. Other static hosts work too: build command `pnpm build`, output directory `dist`.

## Before the first push

None of this is done by the repository. Do it by hand in the GitHub settings of your repository before the first push to `main`.

- [ ] Settings → Pages → Build and deployment → Source: **GitHub Actions**. Do this before the first push to `main`, otherwise the deploy fails at its Pages configuration step.
- [ ] Settings → Environments → `github-pages`: limit deployment branches to `main`, so only the default branch can deploy.
- [ ] Settings → Actions → General: set workflow permissions to "Read repository contents". Optionally also require actions to be pinned to a full-length commit SHA: every action here already is.
- [ ] Turn on Dependabot alerts and Dependabot security updates (under Settings → Advanced Security). `.github/dependabot.yml` only configures version updates.
- [ ] Optional: a ruleset on `main` that requires a pull request and the passing status check `Format, lint, check, build, links, dist assertions` (the `checks` job in `.github/workflows/checks.yml`).
- [ ] Fill every `[[TODO: …]]` marker (`./dev.sh pnpm markers` lists them). The first deploy fails until they are gone, by design.
- [ ] Add the repository variable `SITE_URL` with your origin (Settings → Secrets and variables → Actions → Variables). The deploy build forwards it; unset, the default in `astro.config.ts` is used. For a project site (`https://<user>.github.io/<repo>/`) also add `BASE_PATH` with `/<repo>`.
- [ ] Settings → Security: turn on private vulnerability reporting, which `SECURITY.md` links to.
- [ ] Optional, Search Console: add the repository variable `PUBLIC_GOOGLE_SITE_VERIFICATION` with the verification value (Settings → Secrets and variables → Actions → Variables). It is a public meta value, so a variable, not a secret. The deploy build forwards it.
- [ ] Route-name reservation: a repository owned by the account is served under the same host, so never create one named after a top-level path of this site: `404.html`, `_astro`, `about`, `blog`, `contact`, `favicon.svg`, `lab`, `notes`, `og.png`, `pagefind`, `projects`, `robots.txt`, `rss.xml`, `search`, `sitemap-0.xml`, `sitemap-index.xml`, `tags`. `pagefind` and `_astro` hold build output, the rest are routes and files. Regenerate the list with `ls dist` after `./dev.sh build` when sections are added.
