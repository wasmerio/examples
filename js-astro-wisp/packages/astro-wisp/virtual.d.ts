/* 由 astro-wisp 集成通过 injectTypes 注入站点的 .astro/ 类型目录；也供主题源码自身类型检查。 */
declare module 'virtual:wisp/config' {
  const config: import('astro-wisp').WispRuntime;
  export default config;
}
declare module 'virtual:wisp/locale' {
  export const lang: string;
}
declare module 'virtual:wisp/cjk-font-url' {
  const src: string;
  export default src;
}
declare module 'virtual:wisp/theme-css' {}
declare module 'virtual:wisp/user-css' {}
declare module 'virtual:wisp/components/BackToTop' {
  const C: typeof import('astro-wisp/components/BackToTop.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Citations' {
  const C: typeof import('astro-wisp/components/Citations.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/CopyButton' {
  const C: typeof import('astro-wisp/components/CopyButton.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Diagram' {
  const C: typeof import('astro-wisp/components/Diagram.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Figure' {
  const C: typeof import('astro-wisp/components/Figure.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Footer' {
  const C: typeof import('astro-wisp/components/Footer.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Header' {
  const C: typeof import('astro-wisp/components/Header.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Icon' {
  const C: typeof import('astro-wisp/components/Icon.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Lightbox' {
  const C: typeof import('astro-wisp/components/Lightbox.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Pagination' {
  const C: typeof import('astro-wisp/components/Pagination.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/PostCard' {
  const C: typeof import('astro-wisp/components/PostCard.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/PostMeta' {
  const C: typeof import('astro-wisp/components/PostMeta.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/PrevNext' {
  const C: typeof import('astro-wisp/components/PrevNext.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/SeriesNav' {
  const C: typeof import('astro-wisp/components/SeriesNav.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/ReadingProgress' {
  const C: typeof import('astro-wisp/components/ReadingProgress.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/SkipLink' {
  const C: typeof import('astro-wisp/components/SkipLink.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/TagList' {
  const C: typeof import('astro-wisp/components/TagList.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/ThemeToggle' {
  const C: typeof import('astro-wisp/components/ThemeToggle.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Toc' {
  const C: typeof import('astro-wisp/components/Toc.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Base' {
  const C: typeof import('astro-wisp/layouts/Base.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Page' {
  const C: typeof import('astro-wisp/layouts/Page.astro').default;
  export default C;
}
declare module 'virtual:wisp/components/Post' {
  const C: typeof import('astro-wisp/layouts/Post.astro').default;
  export default C;
}
