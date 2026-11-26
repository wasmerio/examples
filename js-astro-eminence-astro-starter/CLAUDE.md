Astro site built around Cloudflare Workers hosting, with SEO and i18n support. `main` is live production — every merge auto-deploys, treat changes as shipping to real users.

For full project conventions, see [`AGENTS.md`](AGENTS.md).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Library skills (opt-in)

| Skill                | Path                                           | Purpose                                             |
| -------------------- | ---------------------------------------------- | --------------------------------------------------- |
| daisyui              | `.agents/skills/daisyui/SKILL.md`              | daisyUI 5 component classes, themes, colors         |
| eminence-astro-suite | `.agents/skills/eminence-astro-suite/SKILL.md` | Head metadata, integration config, SEO output files |

## Experts

Opt-in specialist skills in `.agents/skills/`. Default behavior: diagnose and implement fixes. Say **audit only** for a report without code changes. Full guide: [`.agents/EXPERTS.md`](.agents/EXPERTS.md).

| Skill                | Path                                           | Purpose                                                   |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| performance-expert   | `.agents/skills/performance-expert/SKILL.md`   | Core Web Vitals, bundles, images, fonts, hydration        |
| honest-seo-expert    | `.agents/skills/honest-seo-expert/SKILL.md`    | Integrity-first SEO via eminence-astro-suite + schema-dts |
| security-expert      | `.agents/skills/security-expert/SKILL.md`      | OWASP, SSR/actions, secrets, Workers bindings             |
| accessibility-expert | `.agents/skills/accessibility-expert/SKILL.md` | WCAG 2.2 AA, semantics, keyboard, contrast                |
| ux-expert            | `.agents/skills/ux-expert/SKILL.md`            | Flows, forms, navigation, clarity                         |
| conversion-designer  | `.agents/skills/conversion-designer/SKILL.md`  | Goal-driven layout, CTAs, visual design                   |

To invoke: read the full `SKILL.md` for the expert before making changes.
