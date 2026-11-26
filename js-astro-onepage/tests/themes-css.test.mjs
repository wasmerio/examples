import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/global.css", "utf8");

// 抽取某个选择器后面第一对花括号里的内容（够用的粗解析：主题块内无嵌套 {}）
function block(selector) {
  const i = css.indexOf(selector);
  if (i < 0) return null;
  const open = css.indexOf("{", i);
  const close = css.indexOf("}", open);
  return open < 0 || close < 0 ? null : css.slice(open + 1, close);
}

const LIGHT = ["--color-paper", "--color-card", "--color-ink", "--color-ink-2", "--color-line", "--color-cell", "--color-accent", "--color-accent-2"];
const DARK = ["--paper-d", "--card-d", "--ink-d", "--ink2-d", "--line-d", "--cell-d", "--accent-d", "--accent2-d"];
const THEMES = ["朱砂", "靛蓝", "森绿", "暖褐", "墨黑"];

describe("每套主题令牌完整", () => {
  it.each(THEMES)("%s：定义全部 8 个暗版令牌", (name) => {
    const b = block(`:root[data-theme="${name}"]`);
    expect(b, `缺 :root[data-theme="${name}"] 块`).toBeTruthy();
    for (const v of DARK) expect(b, `${name} 缺 ${v}`).toContain(v + ":");
  });
  it.each(["靛蓝", "森绿", "暖褐", "墨黑"])("%s：定义全部 8 个 light 令牌（朱砂 light 走 @theme，豁免）", (name) => {
    const b = block(`:root[data-theme="${name}"]`);
    for (const v of LIGHT) expect(b, `${name} 缺 ${v}`).toContain(v + ":");
  });
  it("朱砂 light 不重定义 --color-*（保持 @theme 逐值不变）", () => {
    const b = block(`:root[data-theme="朱砂"]`);
    for (const v of LIGHT) expect(b, `朱砂 不该重定义 ${v}`).not.toContain(v + ":");
  });
});

describe("暗版激活与 color-scheme", () => {
  it("强制暗块把 8 个活动令牌重指到 --*-d", () => {
    const b = block(`:root[data-appearance="暗"]`);
    expect(b).toBeTruthy();
    for (const v of LIGHT) expect(b).toContain(v + ":");
    expect(b).toContain("var(--paper-d)");
  });
  it("系统暗（自动）激活块存在", () => {
    expect(css).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
    expect(css).toContain(`:root[data-appearance="自动"]`);
  });
  it("三种 color-scheme 都在", () => {
    expect(css).toMatch(/\[data-appearance="亮"\][^}]*color-scheme:\s*light/);
    expect(css).toMatch(/\[data-appearance="暗"\][^}]*color-scheme:\s*dark/);
    expect(css).toMatch(/\[data-appearance="自动"\][^}]*color-scheme:\s*light dark/);
  });
});
