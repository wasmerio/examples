// 检测配置里还留着模板作者（Benson / rockbenben / me.newzone.top）的痕迹，
// 给非开发者一句人话提醒，免得 fork 后自己的站上挂着别人的身份。schema v2 拍平形态。
import type { EditConfig } from "./types";

export type ResidueKind = "github" | "url" | "name" | "footer" | "enYaml";
export interface ResidueFinding {
  kind: ResidueKind;
}

// 作者英文翻译的稳定专属片段：调用方（edit.astro）把 projects.en.yaml 内容传进来算布尔，
// 不必把整份英文翻译序列化进 /edit 页面的 HTML 发给每个访客。
const AUTHOR_EN_MARK = 'Founder of "365 Open Source"';

/** 一份 projects.en.yaml 文本是否还带着模板作者痕迹。 */
export function enYamlHasAuthorResidue(text: string): boolean {
  return text.includes(AUTHOR_EN_MARK) || /rockbenben/i.test(text);
}

// 返回结构化 findings（而非中文串），让 UI 按 kind 用当前界面语言渲染文案。
// loadedCurrent：enYaml 这条只在用户点过「载入当前站配置」之后才纳入——空白起步
// 或粘贴/上传自己的内容都不算「载入当前站配置」，不该被别人的英文翻译残留糊脸。
// 默认 true（视为已载入），兼容旧调用方在不关心这条门控时的原语义。
export function detectResidue(
  config: EditConfig,
  enResidue?: boolean,
  loadedCurrent = true,
): ResidueFinding[] {
  const findings: ResidueFinding[] = [];
  if (config.links.some((l) => /github\.com/i.test(l.url) && /rockbenben/i.test(l.url)))
    findings.push({ kind: "github" });
  if (/me\.newzone\.top/i.test(config.url)) findings.push({ kind: "url" });
  if (config.name === "Benson") findings.push({ kind: "name" });
  if (/rockbenben/i.test(config.footer)) findings.push({ kind: "footer" });
  if (enResidue && loadedCurrent) findings.push({ kind: "enYaml" });
  return findings;
}
