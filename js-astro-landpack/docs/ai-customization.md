# Customize the template with an AI agent

[Back to README](../README.md) · [Customization reference](customization.md)

Landpack includes a repository-local **landpack-customize** skill. Give your agent a project link or describe your project, and it can edit the content, branding, screenshots, shared labels, and SEO for you while retaining the Astro/Lumos structure. You do not have to edit code yourself.

## Get started

1. Download or clone Landpack and open its folder in an AI coding agent that can read and edit local files.
2. Give the agent your project URL or context using one of the prompts below.
3. Review the resulting local preview. The agent runs the template checks and reports any missing facts or assets.

The canonical skill is [.agents/skills/landpack-customize/SKILL.md](../.agents/skills/landpack-customize/SKILL.md), with a full project map and references to the maintained customization guide. It needs no hosted service or API key of its own; your chosen agent may have its own account requirements.

Agents supporting `.agents/skills` can discover the skill locally. Claude Code also has a `.claude/skills/landpack-customize` alias. If your agent does not discover skills, or an archive tool does not preserve the alias, give it the canonical file path explicitly. `AGENTS.md` and `CLAUDE.md` point to it too. Skill discovery varies by agent; the direct-file prompt is the portable option.

## Prompt with a project link

```text
Read .agents/skills/landpack-customize/SKILL.md and use it to adapt this
landing page for <project link>. Use the project's official README and
documentation as sources. Customize all content, branding, images, links,
shared labels, and SEO while preserving the template's structure.
Generate the OG image, run the checks, and show me the local preview.
```

Where skill invocation is supported:

```text
Use $landpack-customize to adapt this template for <project link>.
Keep its structure and use the project's own docs for factual claims.
```

## Prompt with a written brief

```text
Read .agents/skills/landpack-customize/SKILL.md and customize Landpack.

Project: <name and purpose>
Audience: <who it helps>
Main benefits: <three or four benefits>
Repository and documentation: <URLs, if available>
Installation: <the real command or setup steps>
License and maintainer: <verified details>
Visual direction: <colors, mood, and any supplied logos/screenshots>
Landing-page domain: <URL, or say it is not decided>

Adapt the complete page, keep the layout/component system, generate a
matching social card, and validate the result. Ask only for missing facts
that prevent accurate content; make routine design choices yourself.
```

A short brief is enough to begin. The agent can propose copy and design, but should not invent package APIs, adoption metrics, licenses, certifications, or a product UI. When a source is inaccessible, provide its relevant README/docs text or facts. If no screenshots exist, the agent can use a clearly conceptual visual instead.

## What the skill covers

- Project identity, hero copy, all sections, facts, setup commands, code examples, and FAQs.
- Shared text outside YAML, including navigation, CTA, footer, and illustration labels.
- Logo, favicon, author credit, screenshots, light/dark palette, and image descriptions.
- Hero background, browser frame, stamp, and optional content sections.
- Social card generation, metadata, production URL, sitemap, and noindex settings.
- Browser review where tools are available, type/build checks, and the built-output SEO check.

The skill maps the existing configuration and components rather than replacing the stack or generating another application. It does not deploy, configure accounts, or run the featured package's backend. The template's original license notices remain in place.

If the domain or another required fact is unknown, the agent can complete a local draft and clearly identify what is still needed. A passing local build is not a claim of live deployment, search indexing, or successful authentication integration.

## Keeping the skill useful

The skill follows a small entrypoint plus a detailed project map, with the schema and customization guide as sources of truth. Update those together when adding configuration or moving files. Keep examples tied to real behavior, avoid duplicated schema documentation, and test new helper scripts before asking agents to use them.
