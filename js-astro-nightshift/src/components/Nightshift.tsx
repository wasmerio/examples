import { MotionConfig } from "motion/react";
import { Hero, Nav } from "./Hero";
import { Night } from "./Night";
import { Receipt } from "./Receipt";
import { FinalCta, Footer, HouseRules, Pricing, Quote } from "./Closing";
import { OnepasteBanner } from "./OnepasteBanner";

// Riso print world: every colour is an ink or the paper, and overlapping inks multiply like on a real duplicator.
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;800;900&family=Schibsted+Grotesk:wght@400;500;600;700&family=Martian+Mono:wdth,wght@87.5,400;87.5,600&display=swap');

html { background: #e8ecec; scroll-behavior: smooth; scrollbar-color: #151b5b #e8ecec; }
.ns {
  --paper: #e8ecec;
  --ink: #151b5b;
  --blue: #2c4be0;
  --night: #0f1442;
  --orange: #ff5a1f;
  --sun: #ffc93c;
  --thermal: #fbfbf7;
  font-family: 'Schibsted Grotesk', ui-sans-serif, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ns ::selection { background: #ff5a1f; color: #151b5b; }
.ns :focus-visible { outline: 2.5px solid #ff5a1f; outline-offset: 3px; border-radius: 6px; }
.ns .font-display { font-family: 'Big Shoulders Display', ui-sans-serif, sans-serif; font-feature-settings: "tnum"; }
.ns .font-mono { font-family: 'Martian Mono', ui-monospace, monospace; font-stretch: 87.5%; }

/* Paper grain sits above everything at low strength so flat ink fills read as printed, not rendered. */
.ns-grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.08 0 0 0 0 0.1 0 0 0 0 0.35 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: .22;
}
.ns-halftone {
  background-image: radial-gradient(circle at center, currentColor 0 1.4px, transparent 1.6px);
  background-size: 7px 7px;
}
.ns-multiply { mix-blend-mode: multiply; }

/* The slipped plate: a blue copy of the button sits under the orange one and slides out on hover. */
.ns-btn { position: relative; isolation: isolate; background: none; transition: transform .45s cubic-bezier(.16,1,.3,1); }
.ns-btn::before, .ns-btn::after { content: ""; position: absolute; inset: 0; border-radius: inherit; transition: transform .45s cubic-bezier(.16,1,.3,1); }
.ns-btn::after { z-index: -1; background: #ff5a1f; }
.ns-btn::before { z-index: -2; background: #2c4be0; }
.ns-btn:hover::before, .ns-btn:focus-visible::before { transform: translate(5px, 5px); }
.ns-btn:hover { transform: translate(-2px, -2px); }
.ns-btn:active { transform: translate(1px, 1px); }
.ns-btn:active::before { transform: translate(1px, 1px); }

.ns-window { transition: fill .35s ease-out; }

.ns-zigzag {
  --z: 9px;
  mask:
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / calc(2 * var(--z)) var(--z) repeat-x,
    linear-gradient(#000 0 0) top / 100% calc(100% - var(--z) + 1px) no-repeat;
}

.ns-underline { background: linear-gradient(currentColor, currentColor) left bottom / 0 2px no-repeat; transition: background-size .45s cubic-bezier(.16,1,.3,1); }
.ns-underline:hover, .ns-underline:focus-visible { background-size: 100% 2px; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .ns *, .ns *::before, .ns *::after { transition-duration: 0s !important; transition-delay: 0s !important; animation: none !important; }
}
`;

export default function Nightshift() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="ns relative min-h-screen overflow-x-clip bg-(--paper) text-(--ink)">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div aria-hidden="true" className="ns-grain pointer-events-none fixed inset-0 z-[70]" />
        <Nav />
        <main>
          <Hero />
          <Night />
          <Receipt />
          <HouseRules />
          <Pricing />
          <Quote />
          <FinalCta />
        </main>
        <Footer />
        <OnepasteBanner />
      </div>
    </MotionConfig>
  );
}
