import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeSite, type SiteData, type WorkItem } from "./schema";
import { mergeLocale } from "./merge";
import { buildLocales, type Locale } from "./locales";
// @ts-ignore -- 纯 ESM 模块无类型声明
import { repoFromUrl, fixUrl, loadConfig, selectOpensourceRepos, DEFAULT_STAR_LINE } from "../../scripts/helpers.mjs";

export type { Locale };

// 以项目根目录为基准（构建时 import.meta.url 会指向 dist，不可靠）
const p = (rel: string) => resolve(process.cwd(), rel);

export interface GhRepo {
  stars: number;
  language: string | null;
  updated: string;
  /** 默认分支上最后一条非 bot 提交；开源节「最近更新」排序优先用它，取不到才回落 updated */
  humanUpdated?: string;
  url: string;
  description: string | null;
  homepage?: string | null;
  fork?: boolean;
  archived?: boolean;
  created?: string;
}

export interface GhData {
  fetched: string;
  totalStars: number;
  repoCount: number; // 非 fork/归档的公开仓库数（数据条「项目数」自动值用）
  totalForks: number; // 非 fork/归档的公开仓库累计 Fork 数（数据条「forks」自动值用）
  repos: Record<string, GhRepo>;
}

export interface Assets {
  avatar?: string;
  shots: Record<string, string>;
}

// loadConfig 固定用 CORE_SCHEMA 解析（见 scripts/helpers.mjs）：防未加引号的「日期: 2024-01-15」
// 被解析成 JS Date，正式页面渲染出带时区的乱码
const baseRaw: unknown = loadConfig(readFileSync(p("src/data/projects.yaml"), "utf8"));

/** 主文件：站点的唯一结构来源 */
export const baseSite: SiteData = normalizeSite(baseRaw);

const built = buildLocales(readdirSync(p("src/data")), baseSite.lang);
for (const w of built.warnings) console.warn(`[onepage] ${w}`);

/** 要发布的语言，locales[0] 住在 / */
export const locales: Locale[] = built.locales;

const localeCache = new Map<string, SiteData>();

/** 按语言取站点数据；主语言直接返回主文件，其余合并翻译覆盖文件 */
export function siteFor(code: string): SiteData {
  if (code === baseSite.lang) return baseSite;
  const cached = localeCache.get(code);
  if (cached) return cached;
  const file = `projects.${code}.yaml`;
  const { site, warnings } = mergeLocale(
    baseSite,
    loadConfig(readFileSync(p(`src/data/${file}`), "utf8")),
    code,
    file,
  );
  for (const w of warnings) console.warn(`[onepage] ${w}`);
  localeCache.set(code, site);
  return site;
}

export const gh: GhData = existsSync(p("src/data/github.json"))
  ? JSON.parse(readFileSync(p("src/data/github.json"), "utf8"))
  : { fetched: "", totalStars: 0, repoCount: 0, totalForks: 0, repos: {} };

export const assets: Assets = existsSync(p("src/data/assets.json"))
  ? JSON.parse(readFileSync(p("src/data/assets.json"), "utf8"))
  : { shots: {} };

// 站主的 GitHub 用户名：取「链接」里第一条 github 链接的用户名（仓库链接或纯主页均可）
export const ghUser: string | undefined = (() => {
  for (const l of baseSite.links) {
    const r = repoFromUrl(l.url);
    if (r) return r.owner;
    const m = /github\.com\/([^/?#]+)/.exec(l.url);
    if (m) return m[1];
  }
  return undefined;
})();

/**
 * 作品对应的 GitHub 仓库数据（star 等）：从 源码（优先）或 链接 里提取仓库形状的 URL，
 * 且用户名等于站主本人时才查——他人仓库不显示 star，避免把别人的星数挂到自己名下。
 */
export function repoOf(work: WorkItem): GhRepo | undefined {
  const r = repoFromUrl(work.source ?? work.link);
  if (!r || !ghUser || r.owner.toLowerCase() !== ghUser.toLowerCase()) return undefined;
  return gh.repos[r.repo];
}

export function fmtStars(n?: number): string {
  if (!n) return "";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/** 缩略图：本地 image 直用；否则用跨语言稳定的身份键查构建时缓存 */
export function thumbOf(item: WorkItem): string | undefined {
  if (item.image && !/^https?:/.test(item.image)) return item.image;
  return assets.shots[item.key];
}

/**
 * 从抓来的仓库列表装配「开源项目」节：
 * 过滤（非 fork/归档、与重点/手列去重、star≥阈值 或 创建于 since 之后），
 * 排序：star > starLine 的高星作品排前、按 star 降序；其余排后、按最近更新（humanUpdated，
 * 缺省回落 pushed_at，见 helpers.selectOpensourceRepos）降序。映射成 WorkItem。
 * max（开源上限）只截断尾巴（star ≤ starLine），高星组永远全显——规则见 helpers.selectOpensourceRepos。
 * 纯函数（不读全局 gh/baseSite），便于单测。
 */
export function buildOpensourceItems(
  repos: Record<string, GhRepo>,
  site: Pick<SiteData, "featured" | "groups" | "opensource" | "opensourceSince" | "starLine" | "opensourceNames" | "opensourceExclude">,
  user?: string,
  max?: number,
): WorkItem[] {
  if (site.opensource === undefined) return [];
  const used = new Set<string>();
  const collect = (w: WorkItem) => {
    const rp = repoFromUrl(w.source ?? w.link);
    if (rp && user && rp.owner.toLowerCase() === user.toLowerCase()) used.add(rp.repo.toLowerCase());
  };
  site.featured.forEach(collect);
  site.groups.forEach((g) => g.items.forEach(collect));
  // 显示名映射：仓库名→漂亮名，大小写不敏感。key 仍用原 repo 名（缩略图/去重按它），只改 name。
  const nameMap = new Map(
    Object.entries(site.opensourceNames ?? {}).map(([k, v]) => [k.toLowerCase(), v]),
  );
  // 选取逻辑（过滤/去重/排序/上限）在 helpers.selectOpensourceRepos，与 fetch 抓图共用，单一权威
  return (
    selectOpensourceRepos(repos, {
      usedRepos: used,
      threshold: site.opensource,
      since: site.opensourceSince,
      starLine: site.starLine ?? DEFAULT_STAR_LINE,
      max,
      exclude: new Set((site.opensourceExclude ?? []).map((s) => s.toLowerCase())),
    }) as [string, GhRepo][]
  ).map(([name, r]) => ({
    key: name,
    name: nameMap.get(name.toLowerCase()) ?? name,
    ...(r.description && { desc: r.description }),
    ...(r.homepage && { link: fixUrl(r.homepage) }),
    source: r.url,
  }));
}

/** 开源节的全部候选条目（不截断），只用来数总数 / 给测试校验截断规则 */
export const opensourceAll: WorkItem[] = buildOpensourceItems(gh.repos, baseSite, ghUser);

/**
 * 站点「开源项目」节实际渲染的条目（构建时装配，语言无关）：
 * 高星组（star > 星标线）永远全显，尾巴按「开源上限」截断。
 */
export const opensourceItems: WorkItem[] = buildOpensourceItems(
  gh.repos,
  baseSite,
  ghUser,
  baseSite.opensourceMax,
);

/** 开源节候选总数；大于 opensourceItems.length 时页面出「在 GitHub 看更多」按钮 */
export const opensourceTotal: number = opensourceAll.length;
