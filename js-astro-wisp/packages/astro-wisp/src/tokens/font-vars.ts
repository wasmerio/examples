/** Fonts API 注册的 CSS 变量（`<Font cssVariable>`），与 src/fonts.ts 一致。 */
export const FONT_VARS = {
  sans: '--font-wisp-sans',
  mono: '--font-wisp-mono',
  hand: '--font-wisp-hand',
} as const;

/**
 * 调色板字体栈中的族名 → Fonts API 变量。Fonts API 生成的族名带哈希，令牌必须通过变量引用；
 * 变量带原族名作回退，未输出 `<Font>` 的页面整条 font-family 也不会失效。
 */
export const FONT_STACK_VARS: Record<string, string> = {
  'Inter Variable': FONT_VARS.sans,
  'JetBrains Mono Variable': FONT_VARS.mono,
  Excalifont: FONT_VARS.hand,
};
