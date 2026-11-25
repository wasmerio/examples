import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import site from './site.config.ts';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import { satteri } from '@astrojs/markdown-satteri';
import outputLayout from './src/integrations/output-layout.ts';
import { solitudeMarkdown, solitudeMath } from './src/integrations/markdown.ts';

export default defineConfig({
  site: site.site,
  base: site.base,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx(), icon(), outputLayout()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    processor: satteri({
      features: { math: site.theme.katex.enable, headingAttributes: true },
      mdastPlugins: [solitudeMath(site)],
      hastPlugins: [solitudeMarkdown(site)],
    }),
    syntaxHighlight: site.theme.highlight.enable ? 'shiki' : false,
    shikiConfig: { themes: site.theme.highlight.themes, defaultColor: false },
  },
});
