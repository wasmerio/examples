# Wasmer starter components

Python, PHP and static responses cannot import the React components from frontend-edge.
The examples repository had no reusable UI implementation for those runtimes. These
custom elements extend the design system at that boundary, with native semantic controls
inside their shadow roots. They run without a framework or a network dependency.

Authoritative references, frontend-edge commit `b656a37f`:

- `src/wsmr-components/molecules/AppCard/AppCard.tsx`: default surface, 12px radius,
  24px horizontal/32px vertical padding; desktop horizontal padding is 32px.
- `src/wsmr-components/molecules/AppCard/AppCardTitle.tsx`: 20px card titles with 1.4 line height.
- `src/ui-components/Button/index.tsx` and `molecules/ActionButton/ActionButton.tsx`:
  default/outline actions, 32px default and 44px large controls, full radius, focus and disabled states.
- `src/wsmr-components/atoms/Input/index.tsx`: 40px inputs, 6px radius and focus states.
- `src/wsmr-components/atoms/Callout/index.tsx`: 16px padding, 2px radius, semantic feedback variants.
- `src/wsmr-components/atoms/Badge/index.tsx`: 12px badge typography and radius.
- `tailwind.config.ts` and `src/app/[locale]/globals.css`: color, gradient and shadow values.

Use the components directly. Do not replace their surfaces or size them with page CSS.
`wasmer-stack` and `wasmer-starter` provide layout. `wasmer-card` has header and footer
slots; its default slot is the content. Actions support `variant="outline"`, `size="lg"`,
`disabled`, `loading`, and a supported `wrap` variant for longer localized labels.
Set `label` on every `wasmer-input`. Form-associated inputs submit through their native form.

The font stack prefers Gilroy when the host supplies it, then the user's system font;
standalone starters do not redistribute the licensed font. Only the layout and control
library are shared; template authors retain their framework's normal rendering model.

`fixture.html` is the review surface for default, disabled, loading, error, success,
forms and long text. Capture hover/focus and 390, 768, 1152 and 1440px widths.
Every distributed copy records its source hash and is checked by the sync script.
