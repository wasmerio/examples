# Add a Widget Component

Before writing a new widget, check `use-widgets.md`: the catalogue covers most marketing sections, and a prop or a variant on an existing widget is usually enough.

## Steps

1. Create `src/components/widgets/MyWidget.astro`.
2. Add a `MyWidget` interface to `src/types.d.ts` that extends `Omit<Headline, 'classes'>, Widget` (or only `Widget` if the section has no headline).
3. Use the widget on a real page of the demo so it is visible and tested.
4. Run `npm run build && npm run check` and look at the section in light and dark mode, on desktop and at 375 px.

## Template

```astro
---
import { Icon } from 'astro-icon/components';
import Headline from '~/components/ui/Headline.astro';
import WidgetWrapper from '~/components/ui/WidgetWrapper.astro';
import { getColumnsClass } from '~/utils/utils';
import type { MyWidget as Props } from '~/types';

const {
  title = await Astro.slots.render('title'),
  subtitle = await Astro.slots.render('subtitle'),
  tagline = await Astro.slots.render('tagline'),
  items = [],
  columns = 3,

  id,
  isDark = false,
  classes = {},
  bg = await Astro.slots.render('bg'),
} = Astro.props;

const columnsClass = getColumnsClass(columns, 'sm:grid-cols-2');
---

<WidgetWrapper id={id} isDark={isDark} containerClass={`max-w-6xl mx-auto ${classes?.container ?? ''}`} bg={bg}>
  <Headline title={title} subtitle={subtitle} tagline={tagline} classes={classes?.headline as Record<string, string>} />

  <ul class:list={['grid gap-6 list-none', columnsClass]}>
    {
      items.map(({ title: itemTitle, description, icon }) => (
        <li class="intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">
          {icon && <Icon name={icon} class="h-8 w-8 text-primary" />}
          {itemTitle && <h3 class="text-lg font-bold text-heading">{itemTitle}</h3>}
          {description && <p class="mt-2 text-muted" set:html={description} />}
        </li>
      ))
    }
  </ul>
</WidgetWrapper>
```

## Conventions

- `WidgetWrapper` gives spacing, container width, `id`, `isDark` and the `bg` slot; `Headline` renders `tagline`/`title`/`subtitle` and forwards `classes.headline`.
- Colours through the tokens (`text-heading`, `text-muted`, `text-primary`, `bg-page`, `border-gray-200 dark:border-slate-700`), never hardcoded hex values, so `CustomStyles.astro` keeps working.
- Images through `~/components/common/Image.astro` with `widths`/`sizes`, and `alt` text. Icons from the Tabler set; verify the name exists in `@iconify-json/tabler/icons.json`.
- Items with a link render an `<a>` (`const Card = href ? 'a' : 'div'`) rather than a nested button.
- Animations use the `intersect-*` classes and are wrapped in `motion-safe:`.
- Interaction, when unavoidable, is a small web component (`<aw-my-widget>` with a `<script>` in the same file, ≤ 40 lines) with a static fallback: `FAQs` uses `<details>`, `Gallery` a `<dialog>`, `Countdown`/`Video`/`StickyCTA` a custom element. Register it with `if (!customElements.get(...))` so view transitions do not redefine it.
- Add a row to the catalogue in `use-widgets.md`.
