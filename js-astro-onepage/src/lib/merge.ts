// v2 翻译：顶层可译字段 + 作品(按原名) + 文字(零散原文→译文)。结构性字段永远取主文件。
//
// 覆盖文件是一张「原文 → 译文」的映射，不依赖顺序：
//   顶层：头衔/介绍/页脚（可译文本字段）
//   作品：键 = 主文件里该条目的原文「名字」，值是 {名字/介绍/出处} 的译文
//   文字：零散原文 → 译文，覆盖分类名、数据标签、链接标签
//
// 结构性字段（链接/源码/图/重点/日期）永远取主文件——英文版把链接改坏只在
// 一种语言下复现，站主很难发现。任何键错、字段越界都只进 warnings，不抛错。
import type { SiteData, WorkItem } from "./schema";

export interface MergeResult {
  site: SiteData;
  warnings: string[];
}

const TOP_TRANSLATABLE = {
  头衔: "title",
  title: "title",
  介绍: "intro",
  intro: "intro",
  页脚: "footer",
  footer: "footer",
} as const;
const WORK_TRANSLATABLE = {
  名字: "name",
  name: "name",
  介绍: "desc",
  intro: "desc",
  出处: "via",
  via: "via",
} as const;

export function mergeLocale(
  base: SiteData,
  overlay: unknown,
  lang: string,
  file = `projects.${lang}.yaml`,
): MergeResult {
  const warnings: string[] = [];
  const warn = (m: string) => warnings.push(`${file}: ${m}`);
  const site: SiteData = JSON.parse(JSON.stringify(base));
  site.lang = lang;
  if (overlay === null || overlay === undefined) return { site, warnings };
  if (typeof overlay !== "object" || Array.isArray(overlay)) {
    warn("整个文件应是「原文: 译文」映射，已忽略");
    return { site, warnings };
  }
  const o = overlay as Record<string, unknown>;

  const worksKey = "作品" in o ? "作品" : "works" in o ? "works" : null;
  const textKey = "文字" in o ? "文字" : "text" in o ? "text" : null;
  const descKey = "开源描述" in o ? "开源描述" : "opensource_descriptions" in o ? "opensource_descriptions" : null;
  for (const [k, v] of Object.entries(o)) {
    if (k === worksKey || k === textKey || k === descKey) continue;
    const canon = (TOP_TRANSLATABLE as Record<string, string>)[k];
    if (!canon) {
      warn(`「${k}」不可翻译或不认识，已忽略`);
      continue;
    }
    if (typeof v === "string") (site as Record<string, unknown>)[canon] = v;
    else warn(`「${k}」的译文应是一段文字，已忽略`);
  }

  // 作品：键 = 主文件原名；同名只译第一条并告警
  if (worksKey) {
    const map = o[worksKey];
    if (!map || typeof map !== "object" || Array.isArray(map)) warn("「作品」应是「原文名字: {…}」映射，已忽略");
    else {
      const all: WorkItem[] = [...site.featured, ...site.groups.flatMap((g) => g.items)];
      const seen = new Set<string>();
      const byName = new Map<string, WorkItem>();
      for (const w of all) {
        if (byName.has(w.name)) {
          if (!seen.has(w.name)) {
            warn(`主文件里「${w.name}」出现多次，翻译只作用于第一条`);
            seen.add(w.name);
          }
          continue;
        }
        byName.set(w.name, w);
      }
      for (const [name, fields] of Object.entries(map as Record<string, unknown>)) {
        const target = byName.get(name);
        if (!target) {
          warn(`作品「${name}」在主文件中找不到，已忽略`);
          continue;
        }
        if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
          warn(`作品「${name}」的译文应是映射，已忽略`);
          continue;
        }
        for (const [fk, fv] of Object.entries(fields as Record<string, unknown>)) {
          const canon = (WORK_TRANSLATABLE as Record<string, string>)[fk];
          if (!canon) {
            warn(`作品「${name}」的「${fk}」不可翻译，已忽略`);
            continue;
          }
          if (typeof fv === "string") (target as Record<string, unknown>)[canon] = fv;
          else warn(`作品「${name}」的「${fk}」应是一段文字，已忽略`);
        }
      }
    }
  }

  // 文字：分类名 / 数据标签 / 链接标签
  if (textKey) {
    const dict = o[textKey];
    if (!dict || typeof dict !== "object" || Array.isArray(dict)) warn("「文字」应是「原文: 译文」映射，已忽略");
    else {
      const d = dict as Record<string, unknown>;
      const used = new Set<string>();
      const tr = (s: string) => {
        if (typeof d[s] === "string") {
          used.add(s);
          return d[s] as string;
        }
        return s;
      };
      for (const g of site.groups) if (g.title) g.title = tr(g.title);
      for (const s of site.stats) s.label = tr(s.label);
      for (const l of site.links) l.label = tr(l.label);
      for (const k of Object.keys(d)) if (!used.has(k)) warn(`文字「${k}」在页面上找不到对应原文，已忽略`);
    }
  }

  // 开源描述：仓库名→译文描述，按仓库名覆盖 base 的对应项（开源节按语言换描述）
  if (descKey) {
    const map = o[descKey];
    if (!map || typeof map !== "object" || Array.isArray(map)) warn("「开源描述」应是「仓库名: 译文」映射，已忽略");
    else {
      site.opensourceDescriptions = { ...(site.opensourceDescriptions ?? {}) };
      for (const [repo, dv] of Object.entries(map as Record<string, unknown>)) {
        if (typeof dv === "string") site.opensourceDescriptions[repo] = dv;
        else warn(`开源描述「${repo}」应是一段文字，已忽略`);
      }
    }
  }
  return { site, warnings };
}
