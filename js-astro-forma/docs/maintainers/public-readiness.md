# Public release readiness

This repository is the clean public distribution of FORMA. Its Git history starts with the reviewed public source tree; it does not include the private development repository's history.

Before publishing code, docs, configuration or assets, run:

```bash
npm run check:public
npm run ai:check
npm run build
```

The public check scans current source and documentation for private filesystem paths, local service URLs, secret assignments and known private project names. Review binary assets and Git history separately when adding files. Do not commit `.env` files, client data, private assets, build output or local reports.

See [`../../LICENSE.md`](../../LICENSE.md) and [asset and license notes](../assets-and-licenses.md) for the source code and asset terms.

## Dependency audit, 2026-10-16

Compatible dependency fixes were applied before release. `npm audit` still reports 8 findings: 6 high and 2 moderate, involving Sharp, the braces/micromatch tooling chain and postcss-selector-parser. This is not a vulnerability-free dependency tree. The supplied deployment is static; build and development tools should process trusted project input. Review current advisories before adding server rendering or processing untrusted files. No forced dependency downgrades or incompatible upgrades were applied to silence the audit.
