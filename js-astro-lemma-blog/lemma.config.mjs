// Lemma: every site-specific setting lives here. The theme (layouts,
// components, plugins, styles) reads this file and has no settings of its own.
//
// Edits take effect in a running dev server (astro.config.mjs watches this
// file and re-renders every post). Files that are files by nature stay files:
// the avatar image, the icons in public/, the posts, and the BibTeX files.

/** @typedef {string | [body: string, args: number] | [body: string, args: number, defaultArg: string]} Macro */

export default {
  site: {
    url: 'https://chengrui.dev',
    title: 'Chengrui Zhang',
    author: 'Chengrui Zhang',
    // Author as BibTeX expects it ("Last, First"), for the "cite this post" block.
    authorBibtex: 'Zhang, Chengrui',
    // The tagline: home page, meta description, RSS.
    description: {
      zh: '方程, 模型, 以及其他.',
      en: 'Equations, models, and other things.',
    },
    // The home page, above the posts:
    // - curve: a mark of dots running along a curve: 'monge-ampere' (level
    //   sets of det D^2 u = 1), 'ring', 'rose', 'lissajous', 'lemniscate',
    //   'spirograph', or null for none.
    // - formula: TeX shown beside it in place of the tagline (the tagline
    //   still serves the meta description and RSS); null shows the tagline.
    intro: {
      curve: 'monge-ampere',
      formula: '\\det D^2 u = f',
    },
    // Header avatar, relative to the repository root; must be under src/assets/.
    avatar: 'src/assets/avatar.jpg',
    // Footer links.
    links: {
      email: 'jczhang@live.it',
      github: 'jczhang02',
    },
    // Files in public/.
    icons: {
      favicon: '/favicon.ico',
      png192: '/icon-192.png',
      appleTouch: '/apple-touch-icon.png',
    },
  },

  // The pages exist for these two languages only: Chinese at /, English at /en/.
  locales: {
    default: 'zh',
    list: ['zh', 'en'],
  },

  theme: {
    // CSS custom properties (--bg, --text, ...) on :root and :root[data-theme='dark'].
    colors: {
      // Light: warm paper.
      light: {
        bg: '#faf9f5',
        text: '#191917',
        muted: '#6b6a64',
        rule: '#e6e3d9',
        surface: '#f2f0e8',
        accent: '#b5532f',
        selection: '#ead9cc',
        // Floating surfaces (popovers): lighter paper lifted by shadow.
        raised: '#fffefb',
        shadowRaised: '0 1px 2px rgb(25 25 23 / 0.06), 0 12px 32px -8px rgb(25 25 23 / 0.2)',
      },
      dark: {
        bg: '#171715',
        text: '#e9e6de',
        muted: '#9c998f',
        rule: '#2e2d29',
        surface: '#201f1c',
        accent: '#e08b66',
        selection: '#4a3328',
        // Shadows barely read on dark; a faint ring carries the edge instead.
        raised: '#22211e',
        shadowRaised: '0 0 0 1px rgb(255 255 255 / 0.07), 0 16px 40px -8px rgb(0 0 0 / 0.6)',
      },
    },
    fonts: {
      // Latin font first in each stack, so English glyphs never come from the CJK font.
      stacks: {
        sans: "'Inter Variable', 'Noto Sans SC Variable', system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif",
        serif: "'Source Serif 4 Variable', 'Noto Serif SC Variable', 'Songti SC', 'STSong', serif",
        kai: "'Source Serif 4 Variable', 'LXGW WenKai Screen', 'Kaiti SC', 'STKaiti', serif",
        // The Nerd Font is used if installed locally; visitors get the same letterforms from the webfont.
        mono: "'JetBrainsMono Nerd Font Mono', 'JetBrainsMono Nerd Font', 'JetBrains Mono Variable', ui-monospace, Menlo, Consolas, 'Noto Sans SC Variable', monospace",
      },
      // Font CSS to load, in this order (npm packages; install a new one with bun add).
      imports: [
        '@fontsource-variable/inter',
        '@fontsource-variable/inter/wght-italic.css',
        // opsz: Source Serif 4 adapts its letterforms to the size (text vs. display).
        '@fontsource-variable/source-serif-4/opsz.css',
        '@fontsource-variable/source-serif-4/opsz-italic.css',
        '@fontsource-variable/jetbrains-mono',
        '@fontsource-variable/jetbrains-mono/wght-italic.css',
      ],
      // CJK font CSS (hundreds of unicode-range subsets) goes in a stylesheet of
      // its own, so the main stylesheet stays small and a style edit does not
      // make visitors download the font CSS again. Loaded on every page.
      cjkImports: [
        '@fontsource-variable/noto-sans-sc',
        '@fontsource-variable/noto-serif-sc',
        'lxgw-wenkai-screen-webfont/lxgwwenkaiscreen.css',
      ],
    },
    layout: {
      measure: '46rem',
      textBase: '1.125rem',
      leading: 1.75,
    },
  },

  // Shiki themes; low-contrast token colors are raised to 4.5:1 against
  // theme.colors.*.surface, the code block background.
  code: {
    themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
  },

  math: {
    // Site-wide TeX macros, available in every post. A string is a macro
    // without arguments; [body, n] takes n arguments; [body, n, default] makes
    // the first argument optional. Per-post macros go in the post's
    // frontmatter under `macros`, same format.
    /** @type {Record<string, Macro>} */
    macros: {
      N: '\\mathbb{N}',
      Z: '\\mathbb{Z}',
      Q: '\\mathbb{Q}',
      R: '\\mathbb{R}',
      C: '\\mathbb{C}',
      F: '\\mathbb{F}',
      eps: '\\varepsilon',
      id: '\\operatorname{id}',
      Hom: '\\operatorname{Hom}',
      End: '\\operatorname{End}',
      Aut: '\\operatorname{Aut}',
      Spec: '\\operatorname{Spec}',
      im: '\\operatorname{im}',
      coker: '\\operatorname{coker}',
      set: ['\\left\\{ #1 \\right\\}', 1],
      inner: ['\\left\\langle #1, #2 \\right\\rangle', 2],
    },
    // MathJax TeX packages loaded up front; anything else is still reachable
    // through \require or autoload.
    // Not bboldx: it redefines \mathbb (\R) in its own light face; a post
    // that wants it writes \require{bboldx}.
    packages: [
      'ams', 'newcommand', 'configmacros', 'begingroup', 'mathtools', 'physics',
      'cancel', 'cases', 'empheq', 'mhchem', 'bussproofs', 'amscd', 'extpfeil',
      'centernot', 'upgreek', 'gensymb', 'units', 'textcomp', 'colortbl',
      'boldsymbol', 'color', 'html', 'enclose', 'bbox', 'dsfont', 'bbm',
    ],
  },

  bibliography: {
    // BibTeX files with the entries posts cite, relative to the repository
    // root; missing files are skipped, and a key in several files is taken
    // from the first.
    files: ['./src/bibliography.bib'],
    // CSL style for the reference list (AMS numeric, from the CSL styles repository, CC BY-SA 3.0).
    style: './plugins/ams-numeric.csl',
  },

  theorems: {
    // Labels of theorem-like environments, figures and tables, per language.
    labels: {
      zh: {
        theorem: '定理', lemma: '引理', proposition: '命题', corollary: '推论',
        definition: '定义', example: '例', remark: '注', proof: '证明',
        figure: '图', table: '表',
      },
      en: {
        theorem: 'Theorem', lemma: 'Lemma', proposition: 'Proposition', corollary: 'Corollary',
        definition: 'Definition', example: 'Example', remark: 'Remark', proof: 'Proof',
        figure: 'Figure', table: 'Table',
      },
    },
  },

  // Reading time under a post's title.
  reading: {
    hanPerMinute: 400,
    wordsPerMinute: 230,
    // Math takes longer than its length suggests: a fixed time per item.
    seconds: { inlineMath: 2, math: 12, environment: 8, codeLine: 2 },
  },

  media: {
    // Videos larger than this go to R2 (bun run media:push); Cloudflare's per-file limit.
    maxBytes: 25 * 1024 * 1024,
    r2: { bucket: 'blog-media', origin: 'https://media.chengrui.dev' },
  },

  // bun run deploy: Cloudflare Workers static assets (no Worker code).
  deploy: {
    worker: 'jczhang-blog',
    accountId: '7087de4e3396c29d639ba6c4919c0e29',
    domain: 'chengrui.dev',
    compatibilityDate: '2026-10-01',
    // IndexNow key (8-128 letters, digits or dashes; public by design): the
    // site serves it at /<key>.txt, and a deploy sends the pages it added or
    // changed to Bing and the other IndexNow search engines. null: no IndexNow.
    indexNow: '9d8ed351f724c3c4bb2dd1f843c90cb1',
  },
};
