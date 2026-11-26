# Expert Agents

Opt-in skills for this project. **Experts** diagnose and fix by default (add **audit only** for reports only). **Library skills** are reference docs — invoke when doing UI or head/metadata work.

## How to invoke

| Platform           | How to invoke                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Cursor**         | Type `@` and pick the skill name, or attach `.agents/skills/<name>/SKILL.md` to chat                                                |
| **GitHub Copilot** | Copilot reads `.github/copilot-instructions.md`; say e.g. "Follow honest-seo-expert in `.agents/skills/honest-seo-expert/SKILL.md`" |
| **Codex**          | Read the skill path from the Experts section in `AGENTS.md`                                                                         |
| **Claude Code**    | Read the skill path from the Experts section in `CLAUDE.md`, or attach the `SKILL.md` file                                          |

## Library skills (opt-in)

| Skill                | Path                                           | Purpose                                             |
| -------------------- | ---------------------------------------------- | --------------------------------------------------- |
| daisyui              | `.agents/skills/daisyui/SKILL.md`              | daisyUI 5 component classes, themes, colors         |
| eminence-astro-suite | `.agents/skills/eminence-astro-suite/SKILL.md` | Head metadata, integration config, SEO output files |

`honest-seo-expert` and `conversion-designer` may direct you to read these when invoked.

## Experts

| Skill                | Path                                           | Purpose                                                             |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| performance-expert   | `.agents/skills/performance-expert/SKILL.md`   | Core Web Vitals, bundles, images, fonts, hydration, Cloudflare edge |
| honest-seo-expert    | `.agents/skills/honest-seo-expert/SKILL.md`    | Integrity-first SEO via eminence-astro-suite + schema-dts           |
| security-expert      | `.agents/skills/security-expert/SKILL.md`      | OWASP, SSR/actions, secrets, Workers bindings                       |
| accessibility-expert | `.agents/skills/accessibility-expert/SKILL.md` | WCAG 2.2 AA, semantics, keyboard, contrast                          |
| ux-expert            | `.agents/skills/ux-expert/SKILL.md`            | Flows, forms, navigation, clarity, mobile usability                 |
| conversion-designer  | `.agents/skills/conversion-designer/SKILL.md`  | Goal-driven layout, hierarchy, CTAs, visual design                  |

Full invocation guide and boundaries: this file. Skill bodies: each `SKILL.md`.

## Scope boundaries

When experts overlap:

- **accessibility-expert** wins on WCAG compliance (contrast, labels, keyboard).
- **conversion-designer** wins on visual treatment (color, typography, layout polish).
- **ux-expert** wins on interaction flow (wording logic, steps, error handling).
- **honest-seo-expert** wins on metadata and structured data.
- **performance-expert** wins on load metrics and bundle weight.

## Example prompts

```
@performance-expert — LCP on the homepage hero is 4.2s, fix it.

@honest-seo-expert — Add JSON-LD and metadata for src/pages/about.astro.

@security-expert — Review src/actions/ for injection risks and fix.

@accessibility-expert — Keyboard trap in the language switcher.

@ux-expert — Contact form errors are unclear; improve the flow.

@conversion-designer — Homepage should drive contact form signups; redesign the hero.

@daisyui — Build a modal and form with daisyUI classes.

@eminence-astro-suite — Configure Open Graph defaults in astro.config.mjs.
```

Audit-only variant: append **audit only** to any expert prompt above.
