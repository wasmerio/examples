# Creating a Template

[< Development guide](index.md)

Templates control the body presentation of the homepage and standalone content
pages. To add one, create its TypeScript definition and Astro component, then add
the definition to the shared registry. This guide uses a `projects` template:

```text
src/templates/
├── projects/
│   ├── index.ts
│   └── Template.astro
├── define.ts
└── registry.ts
```

[`src/layouts/template.astro`](../../src/layouts/template.astro) handles metadata
validation, body rendering, default breadcrumbs, and the shared frame. Templates
receive the prepared data and place the authored body through a slot. Post detail
and system pages use the frame directly; this registry applies to authored pages.

## 1. Define the Template

Create `src/templates/projects/index.ts`:

```ts
import { z } from 'astro/zod';
import { defineTemplate } from '@templates/define';

export const schema = z.object({
  projects: z
    .array(z.object({ name: z.string(), href: z.string() }))
    .default([]),
});

export default defineTemplate({
  id: 'projects',
  name: 'Projects',
  description: 'A reading introduction followed by project links.',
  schema,
  load: () => import('@templates/projects/Template.astro'),
});
```

`defineTemplate()` preserves the inferred schema type and checks the ID format.
The definition follows `TemplateDefinition` from
[`@type/template`](../../src/types/template.ts):

| Field         | Purpose                                                                              |
| ------------- | ------------------------------------------------------------------------------------ |
| `id`          | Unique ID used by content and tooling; lowercase kebab-case, starting with a letter. |
| `name`        | Optional display name for tools.                                                     |
| `description` | Optional description for tools.                                                      |
| `schema`      | Optional Zod schema for template-specific metadata.                                  |
| `load`        | Function returning a dynamic import of the Astro component.                          |

Define only template-specific fields in the schema. Common fields such as `title`
and sidebar switches are already validated by
[`pageSchema`](../../src/content.config.ts). The entry point merges parsed fields
back into `entry.data`, preserving unrelated custom fields. The frame, sidebars,
template, and authored body all receive the resulting entry, including defaults
and transformed values. Templates do not need to parse or cast their metadata.

For a template that only changes presentation, omit `schema` and its export.

`load()` delays importing the Astro component until rendering. This lets Bun
tooling read the registry without needing to compile `.astro` files. The loader
runs during the static build; it does not defer rendering in the browser. Keep
component imports inside this function.

## 2. Create the Body Component

Create `src/templates/projects/Template.astro`:

```astro
---
import type { schema } from '@templates/projects';
import type { TemplateProps } from '@type/template';
import Prose from '@layouts/components/Prose.astro';

type Props = TemplateProps<typeof schema>;
const { entry } = Astro.props;
---

<Prose>
  <h1>{entry.data.title}</h1>
  <slot />
</Prose>

<ul>
  {
    entry.data.projects.map((project) => (
      <li>
        <a href={project.href}>{project.name}</a>
      </li>
    ))
  }
</ul>
```

`TemplateProps<typeof schema>` infers the schema's output, including defaults and
transforms. Import the exported schema with `import type`; deriving props from a
definition that loads the same component would create a circular type dependency.
Use plain `TemplateProps` for a template without a schema.

| Prop       | Meaning                                                               |
| ---------- | --------------------------------------------------------------------- |
| `entry`    | Source identity plus common and template-specific validated metadata. |
| `headings` | Markdown/MDX headings; an empty array for Astro-authored pages.       |
| `isHome`   | Whether this is the root homepage.                                    |

The authored body is supplied through the default `<slot />`. Place it where the
template needs it, using `Prose` around reading content. Templates own the page
title, body arrangement, and scoped styles. The shared entry point supplies the
document frame and forwards `entry` and `headings` to the authored body.

The bundled [default](../../src/templates/default/Template.astro) and
[friend](../../src/templates/friend/Template.astro) components provide further
examples. Follow [Visual design](design.md) for typography and color tokens, and
[Architecture](architecture.md#styling) for CSS scoping.

## 3. Register the Template

Import the definition into
[`src/templates/registry.ts`](../../src/templates/registry.ts) and append it to
the existing `templates` list:

```ts
import projectsTemplate from '@templates/projects';

export const templates = [
  defaultTemplate,
  friendTemplate,
  projectsTemplate,
] as const;
```

Each definition owns its ID. Duplicate registrations fail immediately; an
unregistered ID in content fails with the source file and available IDs.
Keep the central content configuration independent of template components and
the registry.

The registry also exports `getTemplate(id, source?)` and `listTemplates()`.
`getTemplate()` returns the definition, including its schema and lazy loader.
`listTemplates()` returns display metadata without loading components, so Bun
tools can enumerate templates without an Astro build:

```sh
bun -e 'import { listTemplates } from "./src/templates/registry"; console.log(listTemplates());'
```

## 4. Use the Template

Select the ID in any homepage or standalone page. For example, create
`src/content/pages/projects.mdx`:

```mdx
---
title: Projects
template: projects
projects:
  - name: Nayuta
    href: https://github.com/yuanzui-cf/nayuta
---

An introduction to my projects.
```

Astro-authored pages select the same ID and fields through their exported `page`
object. See [Content](content.md) for supported files, routing, and metadata, and
[Sidebars](content.md#sidebars) for per-page sidebar components.

Check that defaults and transformed values reach the template, authored body,
and sidebars, and that the body slot renders correctly for the supported content
formats. Review the resulting page at desktop and mobile widths using the
project's [visual design conventions](design.md).
