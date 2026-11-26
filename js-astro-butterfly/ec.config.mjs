// @ts-check
import { defineEcConfig, definePlugin } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';

const LABELS = { 'vue-html': 'Vue', vue: 'Vue', js: 'JS', ts: 'TS', jsx: 'JSX', tsx: 'TSX', bash: 'Bash', sh: 'Shell' };
const PLAIN = new Set(['', 'txt', 'text', 'plaintext', 'plain']);

/** Butterfly "mac" header: traffic-light dots + language label when no explicit title. */
function pluginLanguageTitle() {
  return definePlugin({
    name: 'language-title',
    hooks: {
      preprocessMetadata: ({ codeBlock }) => {
        if (codeBlock.props.title) return;
        const lang = codeBlock.language ?? '';
        if (PLAIN.has(lang)) return;
        codeBlock.props.title = LABELS[/** @type {keyof typeof LABELS} */ (lang)] ?? lang.toUpperCase();
      },
    },
  });
}

/**
 * Lines don't wrap, so a block's height follows from its line count. The
 * build uses that twice (content.css):
 * - `--ec-lines` lets off-screen blocks skip rendering (content-visibility)
 *   while reserving their real height. A long post is mostly code-token
 *   spans, and every full style pass (first layout, the start of each view
 *   transition) otherwise walks all of them.
 * - Long blocks arrive collapsed (`is-limited`, cut at 360px) instead of being
 *   measured and collapsed after load: that forced a layout per block, and the
 *   page shrank after the router had restored the scroll position. 18 lines
 *   (~425px on desktop) is the first count past the old 420px threshold.
 *   code.ts adds the expand button.
 */
const LONG_BLOCK_LINES = 18;
function pluginBlockSize() {
  return definePlugin({
    name: 'block-size',
    hooks: {
      postprocessRenderedBlockGroup: ({ renderedGroupContents, renderData }) => {
        const lines = renderedGroupContents.reduce((n, { codeBlock }) => n + codeBlock.getLines().length, 0);
        const props = renderData.groupAst.properties;
        props.style = `${props.style ? `${props.style};` : ''}--ec-lines:${lines}`;
        if (lines < LONG_BLOCK_LINES) return;
        const cls = props.className;
        props.className = [...(Array.isArray(cls) ? cls : cls ? [String(cls)] : []), 'is-limited', 'has-expand'];
      },
    },
  });
}

export default defineEcConfig({
  themes: ['one-dark-pro'],
  useDarkModeMediaQuery: false,
  plugins: [pluginLineNumbers(), pluginLanguageTitle(), pluginBlockSize()],
  shiki: { transformers: [transformerColorizedBrackets()] },
  defaultProps: {
    frame: 'terminal',
    showLineNumbers: true,
    overridesByLang: { 'bash,sh,shell,powershell': { showLineNumbers: false } },
  },
  frames: {
    showCopyToClipboardButton: false, // replaced by the header toolbar (src/theme/scripts/code.ts)
    extractFileNameFromCode: false, // never remove a first-line comment from the code
  },
  styleOverrides: {
    borderRadius: '10px',
    borderWidth: '0px',
    codeFontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', 'SF Mono', Consolas, 'Liberation Mono', monospace",
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',
    codePaddingBlock: 'var(--code-padding-block, 12px)',
    codePaddingInline: 'var(--code-padding-inline, 16px)',
    uiFontFamily: 'inherit',
    gutterBorderWidth: '0px',
    gutterForeground: '#9aa4b2',
    frames: {
      shadowColor: 'transparent',
      frameBoxShadowCssValue: 'none',
      terminalTitlebarBackground: '#21252b',
      terminalTitlebarBorderBottomColor: 'rgba(255,255,255,0.06)',
      terminalTitlebarForeground: '#9aa4b2',
      terminalBackground: '#282c34',
    },
  },
});
