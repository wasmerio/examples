/**
 * Starread Theme Environment Type Declarations
 * 
 * 星阅主题环境类型声明
 * 
 * This file provides type declarations for Astro components, markdown files,
 * and other file types used in the theme.
 */

/// <reference types="astro/client" />

/**
 * Type declaration for Astro components
 * 
 * Astro 组件类型声明
 */
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro';

  interface Props {
    [key: string]: unknown;
  }

  const component: AstroComponentFactory<Props>;
  export default component;
}

/**
 * Type declaration for markdown files
 * 
 * Markdown 文件类型声明
 */
declare module '*.md' {
  interface MarkdownContent {
    frontmatter: Record<string, unknown>;
    content: string;
  }

  const content: MarkdownContent;
  export default content;
}

/**
 * Type declaration for MDX files
 * 
 * MDX 文件类型声明
 */
declare module '*.mdx' {
  import type { ComponentType } from 'react';

  const component: ComponentType;
  export default component;
}

/**
 * Type declaration for CSS files
 * 
 * CSS 文件类型声明
 */
declare module '*.css' {
  const content: string;
  export default content;
}

/**
 * Type declaration for SCSS files
 * 
 * SCSS 文件类型声明
 */
declare module '*.scss' {
  const content: string;
  export default content;
}

/**
 * Type declaration for SVG files
 * 
 * SVG 文件类型声明
 */
declare module '*.svg' {
  const content: string;
  export default content;
}

/**
 * Type declaration for image files
 * 
 * 图片文件类型声明
 */
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

/**
 * Type declaration for JSON files
 * 
 * JSON 文件类型声明
 */
declare module '*.json' {
  const content: Record<string, unknown>;
  export default content;
}