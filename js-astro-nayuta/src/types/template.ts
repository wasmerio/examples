import type { MarkdownHeading } from 'astro';
import type { CollectionEntry } from 'astro:content';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { z } from 'astro/zod';

/** Common validated metadata; template-specific fields remain unknown until parsed. */
export type TemplateHeader = CollectionEntry<'pages'>['data'];

/** Common source identity and metadata for Markdown, MDX and Astro pages. */
export type PageEntry<Data = Record<never, never>> = Pick<
  CollectionEntry<'pages'>,
  'id' | 'filePath'
> & {
  data: TemplateHeader & Data;
};

/** Template schemas produce additional metadata to merge into the common header. */
export type TemplateSchema = z.ZodType<Record<string, unknown>>;

/** Metadata stays readable by Bun tooling without loading the Astro component. */
export interface TemplateDefinition {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly schema?: TemplateSchema;
  readonly load: () => Promise<{ default: AstroComponentFactory }>;
}

/** Shared input contract; authored body content is supplied through the default slot. */
export interface TemplateProps<
  Schema extends TemplateSchema | undefined = undefined,
> {
  entry: PageEntry<
    Schema extends TemplateSchema ? z.output<Schema> : Record<never, never>
  >;
  headings: MarkdownHeading[];
  isHome: boolean;
}
