// 把 projects.yaml 文本解析成 EditConfig：loadConfig（CORE_SCHEMA）防日期被吞成 Date，别名归一（中英都认）。
// 只保证列表字段存在（方便 UI map），绝不给标量填默认值（否则往返会失真）。
// @ts-ignore -- 纯 ESM 模块无类型声明；vite/vitest/astro 都能正常打包
import { TOP_ALIAS, WORK_ALIAS, THEME_ALIAS, APPEARANCE_ALIAS, loadConfig } from "../../scripts/helpers.mjs";
import { emptyConfig, emptyWork, type EditConfig } from "./types";

export { emptyConfig };

const str = (v: unknown): string => (v === undefined || v === null ? "" : String(v));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asArray(v: any): any[] {
  return Array.isArray(v) ? v : [];
}

// 按别名表归一键（中英都认）；中英同现时中文键（含非 ASCII）优先，与 schema.ts 同语义。
function normKeys(
  obj: Record<string, unknown>,
  alias: Record<string, string>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const canon = alias[k];
    if (!canon) continue;
    const isZh = /[^\x00-\x7f]/.test(k);
    if (canon in out && !isZh) continue; // 已有值且当前是英文键 → 保留已有（中文优先）
    out[canon] = v;
  }
  return out;
}

// 单键映射列表元素 → [标签, 值]；形状不符返回 null（调用方跳过该条）。
function singleEntry(item: unknown): [string, unknown] | null {
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;
  const e = Object.entries(item as Record<string, unknown>);
  return e.length === 1 ? [String(e[0][0]), e[0][1]] : null;
}

export function yamlToConfig(text: string): { config: EditConfig; error?: string } {
  let raw: unknown;
  try {
    // loadConfig 固定用 CORE_SCHEMA（原因见 scripts/helpers.mjs）：未加引号的 日期: 2026-05-01
    // 不会被解析成 JS Date（否则表单显示乱码、导出又变 ISO 串）。
    raw = loadConfig(text);
  } catch (e) {
    return { config: emptyConfig(), error: e instanceof Error ? e.message : String(e) };
  }
  if (raw === null || raw === undefined) return { config: emptyConfig() };
  if (typeof raw !== "object" || Array.isArray(raw)) {
    return { config: emptyConfig(), error: "顶层要写成「字段: 值」的映射，例如「名字: 你的名字」" };
  }

  const top = normKeys(raw as Record<string, unknown>, TOP_ALIAS);
  const config = emptyConfig();
  config.name = str(top.name);
  config.title = str(top.title);
  config.intro = str(top.intro);
  config.avatar = str(top.avatar);
  config.url = str(top.url);
  config.color = str(top.color);
  const themeRaw = str(top.theme);
  config.theme = (THEME_ALIAS as Record<string, string>)[themeRaw] ?? (THEME_ALIAS as Record<string, string>)[themeRaw.toLowerCase()] ?? "";
  const apRaw = str(top.appearance);
  config.appearance = (APPEARANCE_ALIAS as Record<string, string>)[apRaw] ?? (APPEARANCE_ALIAS as Record<string, string>)[apRaw.toLowerCase()] ?? "";
  config.opensource = str(top.opensource === true ? 10 : top.opensource);
  config.opensourceSince = str(top.opensourceSince);
  config.starLine = str(top.starLine);
  config.opensourceMax = str(top.opensourceMax);
  // 开源命名 / 开源描述：仓库名→值映射，原样保留（只收标量值），无专用 UI 但往返不丢
  const readMap = (src: unknown, dst: Record<string, string>) => {
    if (src && typeof src === "object" && !Array.isArray(src)) {
      for (const [k, v] of Object.entries(src as Record<string, unknown>)) {
        if (typeof v === "string" || typeof v === "number") dst[k] = String(v);
      }
    }
  };
  readMap(top.opensourceNames, config.opensourceNames);
  readMap(top.opensourceDescriptions, config.opensourceDescriptions);
  if (Array.isArray(top.opensourceExclude)) {
    config.opensourceExclude = top.opensourceExclude.filter((x): x is string => typeof x === "string" && x !== "");
  }
  config.footer = str(top.footer);
  config.mark = str(top.mark);
  config.lang = str(top.lang);

  for (const item of asArray(top.links)) {
    const e = singleEntry(item);
    if (e) config.links.push({ label: e[0], url: str(e[1]) });
  }

  for (const item of asArray(top.stats)) {
    const e = singleEntry(item);
    if (!e) continue;
    // 数字原样保留（往返不失真），其余转字符串
    const value = typeof e[1] === "number" ? e[1] : str(e[1]);
    config.stats.push({ label: e[0], value });
  }

  for (const item of asArray(top.works)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const w = normKeys(item as Record<string, unknown>, WORK_ALIAS);
    config.works.push({
      ...emptyWork(),
      name: str(w.name),
      desc: str(w.desc),
      link: str(w.link),
      source: str(w.source),
      image: str(w.image),
      date: str(w.date),
      via: str(w.via),
      group: str(w.group),
      star: w.star === true,
    });
  }

  return { config };
}
