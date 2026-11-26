// schema v2：拍平、中英双认、唯一必填「名字」。复杂度进渲染器，不进配置面。
// 别名表与 URL 工具在 scripts/helpers.mjs（与 node 脚本共用，单一权威）。
// @ts-ignore -- 纯 ESM 模块无类型声明；vite/vitest/astro 都能正常打包
import { TOP_ALIAS, WORK_ALIAS, LANG_NAME_ALIAS, THEME_ALIAS, APPEARANCE_ALIAS, repoFromUrl, repoNamesFrom, fixUrl, isBlank, slugify } from "../../scripts/helpers.mjs";
export { slugify };

export type ThemeName = "朱砂" | "靛蓝" | "森绿" | "暖褐" | "墨黑";
export type Appearance = "自动" | "亮" | "暗";

export interface LinkItem {
  label: string;
  url: string;
}

export interface WorkItem {
  /** 条目身份键：跨语言稳定，用于翻译对应与缩略图查找。由主文件决定 */
  key: string;
  name: string;
  desc?: string;
  link?: string;
  source?: string;
  image?: string;
  date?: string;
  via?: string;
  group?: string;
  star?: boolean;
}

export interface StatItem {
  label: string;
  value: string | number;
  auto?: "stars" | "repos" | "forks"; // 构建时填：stars=总星数、repos=公开仓库数、forks=累计 Fork 数
}

export interface SiteData {
  lang: string;
  url?: string;
  footer?: string;
  mark?: string; // 顶栏左上的小标记（如「365 · Open Source」）；不写=不显示
  themeName: ThemeName;
  appearance: Appearance;
  opensource?: number; // star 阈值；写了才显示「开源项目」节
  opensourceSince?: string; // 此日期后创建的仓库绕过阈值全列（365 计划期）。判据只能是 created_at：实测站里这批仓库没有统一 topic，按 topic 筛不出来（别再改回 topic 判定）
  starLine?: number; // 排序分界：star 超过此数的置顶按 star 排、其余按最近更新排（默认 30）；同时是「开源上限」的分界，线上的高星组永远全显。「最近更新」取默认分支上最后一条非 bot 提交（humanUpdated），没有才回落 pushed_at，见 helpers.selectOpensourceRepos
  opensourceMax?: number; // 尾巴（star ≤ 星标线）最多再列几个；总数会向上补到 3 的倍数凑满网格行；0=只列高星组（不补）；高星组永远全显；不写=不限
  opensourceNames?: Record<string, string>; // 开源节仓库名→显示名映射（仅改展示名，缩略图/链接仍按原 repo）
  opensourceDescriptions?: Record<string, string>; // 开源节仓库名→描述映射（按语言覆盖 GitHub 原描述；en 翻译写在 projects.en.yaml）
  opensourceExclude?: string[]; // 手动排除的仓库名（不进开源节，如本模板仓自身）
  accent?: { accent: string; accent2: string }; // 仅当写了「颜色」时存在，用于内联覆盖强调色
  name: string;
  title?: string;
  intro?: string;
  avatar?: string;
  links: LinkItem[];
  stats: StatItem[];
  featured: WorkItem[]; // 重点条目（不再出现在 groups）
  groups: { title: string | null; items: WorkItem[] }[]; // null=默认组，序=首现
}

/** #rrggbb 按比例变深，供 hover 色；解析失败返回原值 */
function shade(hex: string, ratio = 0.85): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const f = (x: number) => Math.round(x * ratio).toString(16).padStart(2, "0");
  return `#${f((n >> 16) & 255)}${f((n >> 8) & 255)}${f(n & 255)}`;
}

/** 按别名表归一键；中英同现中文优先并告警 */
function normalizeKeys(
  raw: Record<string, unknown>,
  alias: Record<string, string>,
  where: string,
  warn: (m: string) => void,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const chosenBy: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const canon = alias[k];
    if (!canon) {
      warn(
        `${where}「${k}」不是认识的字段，已忽略${/^(site|profile|sections)$/.test(k) ? "——这像旧版写法，请改用新版拍平字段（见 README 的 YAML 参考）" : ""}`,
      );
      continue;
    }
    const isZh = /[^\x00-\x7f]/.test(k);
    if (canon in out) {
      // 别名表里每个字段恰好一中一英，这个分支只在中英同现时触发，且下面的逻辑始终让中文胜出
      warn(`${where}「${k}」与「${chosenBy[canon]}」是同一个字段，用了中文的那个`);
      if (!isZh) continue; // 已有值且当前是英文键 → 保留已有（中文优先）
    }
    out[canon] = v;
    chosenBy[canon] = k;
  }
  return out;
}

/** 取顶层列表字段：字段存在但不是数组（常见于漏写「- 」）时告警并当空处理；字段本不存在则静默 */
function asListField(
  top: Record<string, unknown>,
  key: string,
  label: string,
  warn: (m: string) => void,
): unknown[] {
  const v = top[key];
  if (v === undefined) return [];
  if (Array.isArray(v)) return v;
  warn(`「${label}」要写成列表：每条以「- 」开头，例如「- 名字: …」`);
  return [];
}

export function parseSite(raw: unknown): { site: SiteData; warnings: string[] } {
  const warnings: string[] = [];
  const warn = (m: string) => warnings.push(m);
  if (raw === null || typeof raw !== "object" || Array.isArray(raw))
    throw new Error("配置必须是「字段: 值」的映射 / config must be a key-value mapping");
  const top = normalizeKeys(raw as Record<string, unknown>, TOP_ALIAS, "", warn);
  const nameValue = top.name;
  if ((typeof nameValue !== "string" && typeof nameValue !== "number") || isBlank(nameValue))
    throw new Error('「名字」必填 / "名字" (name) is required');

  // 链接：单键映射列表 → LinkItem[]，值走 fixUrl。
  // 空标签会渲染成只有图标的空按钮，空网址则是无效 href；两者都告警并跳过，
  // 与编辑器 incompleteEntries 的必填口径保持一致。
  const links: LinkItem[] = [];
  for (const [i, item] of asListField(top, "links", "链接", warn).entries()) {
    const e = item && typeof item === "object" && !Array.isArray(item) ? Object.entries(item) : [];
    if (e.length !== 1 || typeof e[0][1] !== "string") {
      warn(`链接第 ${i + 1} 条不是「- 标签: 网址」的写法，已跳过`);
      continue;
    }
    const label = String(e[0][0]);
    const url = e[0][1];
    if (isBlank(label) || isBlank(url)) {
      warn(`链接第 ${i + 1} 条缺「标签」或「网址」，已跳过`);
      continue;
    }    links.push({ label, url: fixUrl(url) });
  }
  const hasGithub = links.some((l) => /github\.com/i.test(l.url));

  // 作品：分拣 featured / groups
  const featured: WorkItem[] = [];
  const groupMap = new Map<string | null, WorkItem[]>();
  for (const [i, rawItem] of asListField(top, "works", "作品", warn).entries()) {
    if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
      warn(`作品第 ${i + 1} 条不是映射，已跳过`);
      continue;
    }
    const w = normalizeKeys(rawItem as Record<string, unknown>, WORK_ALIAS, `作品第 ${i + 1} 条`, warn);
    if (isBlank(w.name)) {
      warn(`作品第 ${i + 1} 条缺「名字」，已跳过`);
      continue;
    }
    let star = false;
    if (w.star !== undefined) {
      if (typeof w.star === "boolean") star = w.star;
      else warn(`作品「${String(w.name)}」的「重点」应为 true/false，已忽略`);
    }
    const name = String(w.name);
    const item: WorkItem = {
      key: slugify(name) || name,
      name,
      ...(typeof w.desc === "string" && { desc: w.desc }),
      ...(typeof w.link === "string" && { link: fixUrl(w.link) }),
      ...(typeof w.source === "string" && { source: fixUrl(w.source) }),
      ...(typeof w.image === "string" && { image: w.image }),
      ...(w.date !== undefined && { date: String(w.date) }),
      ...(typeof w.via === "string" && { via: w.via }),
      ...(typeof w.group === "string" && { group: w.group }),
      ...(star && { star }),
    };
    if (star) featured.push(item);
    else {
      const g = item.group ?? null;
      if (!groupMap.has(g)) groupMap.set(g, []);
      groupMap.get(g)!.push(item);
    }
  }

  // 数据：单键映射列表；「自动」需要 GitHub 链接。
  // 空标签/空值同样会渲染成空白数据条，按编辑器的必填口径告警并跳过。
  const stats: StatItem[] = [];
  for (const [i, item] of asListField(top, "stats", "数据", warn).entries()) {
    const e = item && typeof item === "object" && !Array.isArray(item) ? Object.entries(item) : [];
    if (e.length !== 1) {
      warn(`数据第 ${i + 1} 条不是「- 标签: 值」的写法，已跳过`);
      continue;
    }
    const [rawLabel, v] = e[0];
    const label = String(rawLabel);
    if (isBlank(label) || isBlank(v)) {
      warn(`数据第 ${i + 1} 条缺「标签」或「值」，已跳过`);
      continue;
    }
    // 自动值：「自动/auto/星标」→ 总星数；「项目数/仓库数/repos」→ 非 fork/归档的公开仓库数。都需 GitHub 链接。
    const autoKind: "stars" | "repos" | "forks" | null =
      v === "自动" || v === "auto" || v === "星标"
        ? "stars"
        : v === "项目数" || v === "仓库数" || v === "repos" || v === "auto-repos"
          ? "repos"
          : v === "forks" || v === "fork" || v === "Fork数" || v === "累计Fork"
            ? "forks"
            : null;
    if (autoKind) {
      if (!hasGithub) {
        warn(`数据「${label}」写了「${String(v)}」（自动值）但链接里没有 GitHub，已跳过`);
        continue;
      }
      stats.push({ label: String(label), value: 0, auto: autoKind });
    } else if (typeof v === "string" || typeof v === "number") stats.push({ label: String(label), value: v });
    else warn(`数据「${label}」的值要是文字或数字，已跳过`);
  }

  // 语言：语言名双认
  let lang = "zh-CN";
  if (top.lang !== undefined) {
    const s = String(top.lang);
    lang = (LANG_NAME_ALIAS as Record<string, string>)[s] ?? s;
  }

  // 主题：中英双认，未知回退朱砂 + 告警
  let themeName: ThemeName = "朱砂";
  if (top.theme !== undefined) {
    const s = String(top.theme).trim();
    const canon = (THEME_ALIAS as Record<string, string>)[s] ?? (THEME_ALIAS as Record<string, string>)[s.toLowerCase()];
    if (canon) themeName = canon as ThemeName;
    else warn(`「主题」不认识「${s}」，用默认的朱砂。可选：朱砂/靛蓝/森绿/暖褐/墨黑`);
  }
  // 外观：中英双认，未知回退默认「亮」+ 告警。默认亮；写「自动」才跟随系统深色（纯 CSS）
  let appearance: Appearance = "亮";
  if (top.appearance !== undefined) {
    const s = String(top.appearance).trim();
    const canon = (APPEARANCE_ALIAS as Record<string, string>)[s] ?? (APPEARANCE_ALIAS as Record<string, string>)[s.toLowerCase()];
    if (canon) appearance = canon as Appearance;
    else warn(`「外观」不认识「${s}」，用默认的亮。可选：自动/亮/暗`);
  }
  // 开源项目：star 阈值（true=默认 10），开启自动「开源项目」节
  let opensource: number | undefined;
  if (top.opensource !== undefined) {
    if (top.opensource === true) opensource = 10;
    else if (typeof top.opensource === "number" && Number.isFinite(top.opensource)) opensource = top.opensource;
    else warn(`「开源项目」要写数字（star 阈值，如 10）或 true，已忽略`);
  }
  // 开源项目起始：此日期后创建的仓库全列（绕过阈值）
  const opensourceSince = top.opensourceSince !== undefined ? String(top.opensourceSince) : undefined;
  const starLine = typeof top.starLine === "number" && Number.isFinite(top.starLine) ? top.starLine : undefined;
  const opensourceMax = typeof top.opensourceMax === "number" && Number.isFinite(top.opensourceMax) ? top.opensourceMax : undefined;
  // 开源命名 / 开源描述：都是「仓库名: 值」映射，只收标量值（字符串/数字），空映射不落
  const parseRepoMap = (val: unknown, label: string): Record<string, string> | undefined => {
    if (val === undefined) return undefined;
    if (!val || typeof val !== "object" || Array.isArray(val)) {
      warn(`「${label}」要写成「仓库名: 值」的映射，已忽略`);
      return undefined;
    }
    const m: Record<string, string> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (typeof v === "string" || typeof v === "number") m[k] = String(v);
    }
    return Object.keys(m).length ? m : undefined;
  };
  const opensourceNames = parseRepoMap(top.opensourceNames, "开源命名");
  const opensourceDescriptions = parseRepoMap(top.opensourceDescriptions, "开源描述");
  // 开源排除：仓库名列表；收非空字符串，空列表不落。条目可以是裸仓库名，也可以是完整
  // GitHub 网址（repoNamesFrom 归一）——后者不归一会静默匹配不上，见 helpers.mjs 的说明
  let opensourceExclude: string[] | undefined;
  if (top.opensourceExclude !== undefined) {
    if (Array.isArray(top.opensourceExclude)) {
      const list = repoNamesFrom(top.opensourceExclude);
      if (list.length) opensourceExclude = list;
    } else {
      warn(`「开源排除」要写成仓库名的列表（- 仓库名），已忽略`);
    }
  }

  const hasColor = typeof top.color === "string" && top.color !== "";
  return {
    site: {
      lang,
      name: String(top.name),
      ...(typeof top.title === "string" && { title: top.title }),
      ...(typeof top.intro === "string" && { intro: top.intro }),
      ...(typeof top.avatar === "string" && { avatar: top.avatar }),
      ...(typeof top.url === "string" && { url: top.url }),
      ...(typeof top.footer === "string" && { footer: top.footer }),
      ...(typeof top.mark === "string" && { mark: top.mark }),
      themeName,
      appearance,
      ...(opensource !== undefined && { opensource }),
      ...(opensourceSince !== undefined && { opensourceSince }),
      ...(starLine !== undefined && { starLine }),
      ...(opensourceMax !== undefined && { opensourceMax }),
      ...(opensourceNames !== undefined && { opensourceNames }),
      ...(opensourceDescriptions !== undefined && { opensourceDescriptions }),
      ...(opensourceExclude !== undefined && { opensourceExclude }),
      ...(hasColor && { accent: { accent: top.color as string, accent2: shade(top.color as string) } }),
      links,
      stats,
      featured,
      groups: [...groupMap.entries()].map(([title, items]) => ({ title, items })),
    },
    warnings,
  };
}

export function normalizeSite(raw: unknown): SiteData {
  return parseSite(raw).site;
}
