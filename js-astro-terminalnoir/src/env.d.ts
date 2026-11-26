/// <reference types="astro/client" />

// Plain tsc needs the factory type; astro check validates component props.
declare module '*.astro' {
  const component: Parameters<import('astro/container').experimental_AstroContainer['renderToString']>[0];
  export default component;
}
