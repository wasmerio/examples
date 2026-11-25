/// <reference types="astro/client" />

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    /** Legacy Solitude tooltip text, consumed by the delegated tooltip runtime. */
    heotip?: string;
  }
}

/** Template implementations and props are checked by astro check. */
declare module '*.astro' {
  const component: import('astro/runtime/server/index.js').AstroComponentFactory;
  export default component;
}
