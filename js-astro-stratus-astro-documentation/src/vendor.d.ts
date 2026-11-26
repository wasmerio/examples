declare module "markdown-it" {
  interface Options {
    html?: boolean;
    xhtmlOut?: boolean;
    breaks?: boolean;
    langPrefix?: string;
    linkify?: boolean;
    typographer?: boolean;
  }

  interface MarkdownIt {
    render(src: string, env?: Record<string, unknown>): string;
    renderInline(src: string, env?: Record<string, unknown>): string;
  }

  // markdown-it is callable both with and without `new` at runtime.
  interface MarkdownItConstructor {
    new (options?: Options | string): MarkdownIt;
    (options?: Options | string): MarkdownIt;
  }

  const MarkdownIt: MarkdownItConstructor;
  export default MarkdownIt;
}

// Ships untyped: registers the <lite-vimeo> custom element as a side effect.
declare module "@choctawnationofoklahoma/lite-vimeo";
