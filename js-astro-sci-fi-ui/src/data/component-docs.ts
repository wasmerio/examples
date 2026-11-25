export type ComponentDocEntry = {
  slug: string;
  title: string;
  description: string;
  /** Minimal usage snippet (Astro / JSX as applicable) */
  code: string;
};

export type ComponentDocGroup = {
  id: string;
  label: string;
  items: ComponentDocEntry[];
};

export const componentDocGroups: ComponentDocGroup[] = [
  {
    id: "core",
    label: "Core",
    items: [
      {
        slug: "frame",
        title: "Frame",
        description: "Angled SVG border or square edges; optional glow and shimmer.",
        code: `---
import Frame from "../components/core/Frame.astro";
---
<Frame variant="primary" glow>
  <div class="p-4">Content</div>
</Frame>`,
      },
      {
        slug: "panel",
        title: "Panel",
        description: "Framed surface with padding, optional glass or raised layer.",
        code: `---
import Panel from "../components/core/Panel.astro";
---
<Panel variant="primary" glow layer="raised">
  <p>Panel body</p>
</Panel>`,
      },
      {
        slug: "text",
        title: "Text",
        description: "Heading, label, and data typography presets.",
        code: `---
import Text from "../components/core/Text.astro";
---
<Text variant="heading" as="h2">Status</Text>
<Text variant="label">Subsystem</Text>
<Text variant="data">00:14:22</Text>`,
      },
      {
        slug: "button",
        title: "Button",
        description: "Primary, secondary, or ghost; optional animated border and sound hooks.",
        code: `---
import Button from "../components/core/Button.astro";
---
<Button variant="primary">Confirm</Button>
<Button variant="ghost" sound={false}>Quiet</Button>`,
      },
    ],
  },
  {
    id: "effects",
    label: "Effects",
    items: [
      {
        slug: "glow",
        title: "Glow",
        description: "Outer or inner glow wrapper for slots.",
        code: `---
import Glow from "../components/effects/Glow.astro";
---
<Glow mode="outer">
  <span class="rounded-sm bg-[color-mix(in_oklab,var(--sf-bg-elevated)_92%,transparent)] px-3 py-2 [text-shadow:0_0_8px_var(--sf-glow-primary)]">
    Highlighted block
  </span>
</Glow>`,
      },
      {
        slug: "scanlines",
        title: "Scanlines",
        description: "HUD scanline overlay; fixed or local, optional drift animation.",
        code: `---
import Scanlines from "../components/effects/Scanlines.astro";
---
<Scanlines fixed animated />`,
      },
      {
        slug: "animated-border",
        title: "AnimatedBorder",
        description: "React island: conic-gradient border (Framer Motion).",
        code: `---
import AnimatedBorder from "../components/effects/AnimatedBorder.jsx";
---
<AnimatedBorder client:visible>
  <div class="p-4">Island content</div>
</AnimatedBorder>`,
      },
    ],
  },
  {
    id: "hud",
    label: "HUD",
    items: [
      {
        slug: "hud-mount",
        title: "HudMount",
        description: "Pointer-events-none layer for stacking HUD decorations.",
        code: `---
import HudMount from "../components/hud/HudMount.astro";
---
<HudMount>
  <!-- corners, reticle, etc. -->
</HudMount>`,
      },
      {
        slug: "hud-corners",
        title: "HudCorners",
        description: "Four L-shaped corner brackets with optional glow.",
        code: `---
import HudCorners from "../components/hud/HudCorners.astro";
---
<div class="relative h-40">
  <HudCorners inset="0" arm="1.75rem" />
</div>`,
      },
      {
        slug: "hud-reticle",
        title: "HudReticle",
        description: "Center targeting reticle overlay.",
        code: `---
import HudReticle from "../components/hud/HudReticle.astro";
---
<div class="relative h-48">
  <HudReticle scale={0.75} />
</div>`,
      },
      {
        slug: "hud-bar",
        title: "HudBar",
        description: "Top or bottom status strip with named slots.",
        code: `---
import HudBar from "../components/hud/HudBar.astro";
---
<HudBar mode="inline" position="top">
  <span slot="left">SEC-A</span>
  <span slot="center">LIVE</span>
  <span slot="right">OK</span>
</HudBar>`,
      },
      {
        slug: "hud-ticker",
        title: "HudTicker",
        description: "CSS marquee strip; duplicate slot content for seamless loop.",
        code: `---
import HudTicker from "../components/hud/HudTicker.astro";
---
<HudTicker durationSec={20}>
  <span>Telemetry nominal</span>
  <span>·</span>
  <span>Link stable</span>
</HudTicker>`,
      },
      {
        slug: "hud-readout",
        title: "HudReadout",
        description: "Compact label + value readout for HUD corners.",
        code: `---
import HudReadout from "../components/hud/HudReadout.astro";
---
<HudReadout>
  <span slot="label">Pitch</span>
  +01.2°
</HudReadout>`,
      },
      {
        slug: "hud-frame",
        title: "HudFrame",
        description: "Shortcut: HudMount + optional corners + reticle + slot.",
        code: `---
import HudFrame from "../components/hud/HudFrame.astro";
---
<HudFrame corners reticle>
  <p>Your HUD content</p>
</HudFrame>`,
      },
    ],
  },
  {
    id: "radar",
    label: "Radar",
    items: [
      {
        slug: "radar",
        title: "Radar",
        description: "SVG radar with sweep animation and optional blips prop.",
        code: `---
import Radar from "../components/radar/Radar.astro";
---
<Radar
  variant="primary"
  blips={[
    { angleDeg: 45, distance: 0.5 },
    { angleDeg: 200, distance: 0.65 },
  ]}
/>`,
      },
    ],
  },
  {
    id: "terminal",
    label: "Terminal",
    items: [
      {
        slug: "terminal",
        title: "Terminal",
        description: "Framed console with header and scroll body (square Frame edges).",
        code: `---
import Terminal from "../components/terminal/Terminal.astro";
import TerminalLine from "../components/terminal/TerminalLine.astro";
---
<Terminal title="SYS.LOG">
  <TerminalLine variant="output">Ready.</TerminalLine>
</Terminal>`,
      },
      {
        slug: "terminal-line",
        title: "TerminalLine",
        description: "Semantic line variants: command, output, error, system, dim, highlight.",
        code: `---
import TerminalLine from "../components/terminal/TerminalLine.astro";
---
<TerminalLine variant="command">npm run build</TerminalLine>
<TerminalLine variant="error">Build failed</TerminalLine>`,
      },
      {
        slug: "terminal-prompt",
        title: "TerminalPrompt",
        description: "Prompt character with optional blinking cursor.",
        code: `---
import TerminalPrompt from "../components/terminal/TerminalPrompt.astro";
---
<TerminalPrompt char=">" cursor>deploy --prod</TerminalPrompt>`,
      },
    ],
  },
];

export function getAllComponentDocEntries(): ComponentDocEntry[] {
  return componentDocGroups.flatMap((g) => g.items);
}

export function getComponentDocBySlug(slug: string): ComponentDocEntry | undefined {
  return getAllComponentDocEntries().find((e) => e.slug === slug);
}
