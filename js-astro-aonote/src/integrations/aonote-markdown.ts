import type { AstroIntegration } from 'astro';
import { unified, type RemarkPlugin } from '@astrojs/markdown-remark';
import { site } from '../site.config';
import {
  remarkAonotePreprocess,
  remarkCodeMeta,
  remarkDeflist,
  remarkDirective,
  remarkDirectiveRehype,
  remarkEmoji,
  remarkGfm,
  remarkMath,
  remarkTableCaptions,
} from '../plugins/remark-aonote';
import { remarkStripDuplicateTitle } from '../plugins/remark-strip-duplicate-title';
import { rehypeAonoteAnchorlink } from '../plugins/rehype-aonote-anchorlink';
import { rehypeAonoteEnhance } from '../plugins/rehype-aonote';
import { rehypeAonoteFinalize } from '../plugins/rehype-aonote-finalize';
import { rehypeAonoteMathml } from '../plugins/rehype-aonote-mathml';
import { rehypeAonoteSlug } from '../plugins/rehype-aonote-slug';
import { transformerAonote } from '../plugins/shiki-aonote';

/** Central Aonote markdown pipeline (remark/rehype/shiki) for posts and pages. */
export function aonoteMarkdown(): AstroIntegration {
  const locale = site.language;

  return {
    name: 'aonote-markdown',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            // Astro 7 replaced the default Markdown pipeline with Sätteri. This theme
            // keeps the unified (remark/rehype) pipeline explicitly so its custom
            // plugins keep working — requires @astrojs/markdown-remark.
            processor: unified({
              remarkPlugins: [
                remarkAonotePreprocess,
                remarkStripDuplicateTitle,
                remarkGfm,
                remarkTableCaptions,
                remarkMath,
                // remark-deflist and remark-directive-rehype declare their plugins
                // with unified's generic `Plugin` (unist `Node`) rather than
                // `Plugin<[], mdast.Root>`. Astro 7 tightened remarkPlugins to
                // RemarkPlugin, so these two need a cast. Runtime behavior is
                // unaffected — they receive the mdast Root either way.
                remarkDeflist as unknown as RemarkPlugin,
                remarkDirective,
                remarkDirectiveRehype as unknown as RemarkPlugin,
                remarkCodeMeta,
                remarkEmoji,
              ],
              rehypePlugins: [
                rehypeAonoteSlug,
                () => rehypeAonoteAnchorlink({ locale }),
                rehypeAonoteMathml,
                () => rehypeAonoteEnhance({ locale }),
                () => rehypeAonoteFinalize({ locale }),
              ],
            }),
            // shikiConfig is a shared (non-processor) option: it stays a sibling of
            // `processor`, not a member of unified({...}).
            shikiConfig: {
              themes: {
                light: 'github-light',
                dark: 'github-dark-dimmed',
              },
              wrap: true,
              transformers: [transformerAonote()],
            },
          },
        });
      },
    },
  };
}
