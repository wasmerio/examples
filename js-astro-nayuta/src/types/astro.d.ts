// Plain tsc cannot read .astro files; astro check validates their concrete props.
declare module '*.astro' {
  const Component: import('astro/runtime/server/index.js').AstroComponentFactory;
  export default Component;
}
