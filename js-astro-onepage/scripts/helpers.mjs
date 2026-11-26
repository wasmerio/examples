import yaml from "js-yaml";

/**
 * 配置 YAML 的唯一解析入口：构建（src/lib/data.ts）、
 * 抓取（fetch-github.mjs）、校验（validate-config.mjs）、编辑器（importer.ts / edit.astro）
 * 全部必须走这里，不再各写一份 `yaml.load(text, { schema: ... })`。
 *
 * 固定用 CORE_SCHEMA（YAML 1.2 核心 schema）而非 js-yaml 默认 schema：默认 schema 会把
 * 未加引号的 日期: 2024-01-15（合法且常见的写法）解析成 JS Date 对象，之后但凡被
 * String(date) 或模板拼接就会产出带时区的乱码（如 "Mon Jan 15 2024 08:00:00 GMT+0800…"），
 * 而且解析阶段没有任何告警——正式页面会悄悄出现这种乱码。CORE_SCHEMA 没有
 * timestamp/merge 这类隐式类型，日期、版本号等值一律原样保留成字符串。
 */
export function loadConfig(text) {
  return yaml.load(text, { schema: yaml.CORE_SCHEMA });
}

/** 唯一权威实现：src/lib/schema.ts 直接从本文件导入，不再各写一份 */
export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * 条目身份键的唯一权威公式：repo 优先，其次 slugify(name)，最后兜底原名字符串。
 * repo: "" 也会回退（空字符串不是有效身份键）；纯标点名字 slugify 后会变成空串，
 * 用原名兜底避免塌缩成 ""；name 非字符串（YAML 数字/日期）一律先转字符串，不崩构建。
 * schema.ts 与 fetch-github.mjs 都从这里调用，不再各写一份手写公式。
 */
export function itemKey(repo, name) {
  return repo || slugify(name ?? "") || String(name ?? "");
}

export function ghUserFrom(url) {
  return url?.match(/github\.com\/([^/?#]+)/)?.[1] ?? null;
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'" };

/**
 * 从 HTML 提取 og:image 内容；容忍属性顺序、引号风格（含压缩后的无引号属性）、name= 写法。
 * 必须反转义 HTML 实体：GitHub 仓库自定义 Social preview 的 og:image 现在是带签名的
 * 预签名 URL（X-Amz-Signature… &jwt=…），属性里 & 一律写成 &amp;，不还原就会把查询参数
 * 粘成一个，下载直接 401，整站缩略图静默消失。
 */
export function parseOgImage(html) {
  const tag = html.match(
    /<meta[^>]*(?:property|name)\s*=\s*["']?og:image(?:["']|(?=[\s/>]))[^>]*>/i,
  )?.[0];
  if (!tag) return null;
  const m = tag.match(/content\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
  const raw = m?.[1] ?? m?.[2] ?? m?.[3] ?? null;
  return raw === null ? null : raw.replace(/&(amp|lt|gt|quot|apos|#39);/g, (_, e) => ENTITIES[e]);
}

const CT_EXT = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export function extFromContentType(ct) {
  return CT_EXT[(ct ?? "").split(";")[0].trim()] ?? ".png";
}

/** schema v2 别名表：输入键（中/英）→ 内部键。TS 与 node 脚本共用，单一权威 */
export const TOP_ALIAS = {
  名字: "name", name: "name", 头衔: "title", title: "title",
  介绍: "intro", intro: "intro", 头像: "avatar", avatar: "avatar",
  链接: "links", links: "links", 作品: "works", works: "works",
  数据: "stats", stats: "stats", 网址: "url", url: "url",
  颜色: "color", color: "color", 页脚: "footer", footer: "footer",
  语言: "lang", lang: "lang",
  主题: "theme", theme: "theme",
  外观: "appearance", appearance: "appearance",
  开源项目: "opensource", opensource: "opensource",
  开源项目起始: "opensourceSince", opensource_since: "opensourceSince",
  星标线: "starLine", star_line: "starLine",
  开源上限: "opensourceMax", opensource_max: "opensourceMax",
  开源命名: "opensourceNames", opensource_names: "opensourceNames",
  开源描述: "opensourceDescriptions", opensource_descriptions: "opensourceDescriptions",
  开源排除: "opensourceExclude", opensource_exclude: "opensourceExclude",
  标记: "mark", mark: "mark",
};
export const WORK_ALIAS = {
  名字: "name", name: "name", 介绍: "desc", intro: "desc",
  链接: "link", link: "link", 源码: "source", source: "source",
  图: "image", image: "image", 日期: "date", date: "date",
  出处: "via", via: "via", 分类: "group", group: "group",
  重点: "star", star: "star",
};
/** 语言名双认：防「语言: 中文」被当未知码回退成英文界面 */
export const LANG_NAME_ALIAS = {
  中文: "zh-CN", 简体: "zh-CN", 繁体: "zh-TW", 繁體: "zh-TW",
  英文: "en", English: "en", english: "en",
  日语: "ja", 日本語: "ja", 韩语: "ko", 한국어: "ko",
};

/** 主题名双认：中文规范名 ↔ 英文别名，输入都归一到中文规范值 */
export const THEME_ALIAS = {
  朱砂: "朱砂", cinnabar: "朱砂",
  靛蓝: "靛蓝", indigo: "靛蓝",
  森绿: "森绿", pine: "森绿",
  暖褐: "暖褐", sepia: "暖褐",
  墨黑: "墨黑", mono: "墨黑",
};
/** 外观值双认 */
export const APPEARANCE_ALIAS = {
  自动: "自动", auto: "自动",
  亮: "亮", light: "亮",
  暗: "暗", dark: "暗",
};

/** 星标线默认值（单一权威）：不写「星标线」时的兜底。data.ts / fetch-github.mjs / 编辑器文案与测试都引用它，避免「30」写死在多处各自腐烂 */
export const DEFAULT_STAR_LINE = 30;

/** 开源节在 lg 下是 3 列网格：总数向上对齐到 3 的倍数，让最后一行排满（改版式列数时要同步这里） */
export const DEFAULT_ALIGN_STEP = 3;

/** 补抓前等的限流窗口（fetchShotsWithRetry 用）：按分钟级窗口给，太短等于没等 */
export const SHOT_COOLDOWN_MS = 60000;

/**
 * 开源节的仓库选取（过滤/去重/排序/可选上限），供 src/lib/data.ts 渲染与 fetch-github.mjs 抓图共用，
 * 单一权威避免两处逻辑跑偏。repos = github.json 形状 {name: {stars, created, updated, humanUpdated, fork, archived, …}}。
 * usedRepos = 已被重点/手列占用的仓库名集合（小写）。exclude = 手动排除的仓库名集合（小写）。
 * 排序：star>starLine 的按 star 降序在前，其余按最近更新降序。
 *
 * 「最近更新」取 humanUpdated（默认分支上最后一条非 bot 提交，见 fetch-github.mjs 的
 * fetchHumanUpdated），没有才回落 updated（pushed_at）。pushed_at 是「最后一次对任意
 * 引用（任何分支/tag）有写操作」，CI 跑一次、删个分支、打个 release 都会把它顶到今天——
 * 拿它排「最近还在维护的项目」等于让自动化替作者领活跃度。回落是必须的：拿不到 token /
 * GraphQL 失败时 humanUpdated 整片缺失，此时行为与改动前完全一致。
 *
 * max（开源上限）只限制**尾巴**（star ≤ starLine 的那批）最多列几个；高星组永远全显。
 * 写 0 = 尾巴一个都不列（只留高星组）；不写 = 不限。
 * align = 网格列数（默认 3）：总数向上补到它的整数倍，多补的几张取自尾巴的下一批（候选不够就按实际数量）。
 * 写 0/1 = 不对齐。max=0 是对齐的例外——那是明确的「不要尾巴」，不替用户加回来。
 * 理由：高星组才是「代表作」，且它只会随时间变大——若把 max 当「总共显示几个」，
 * 高星组一旦超过 max，被砍掉的恰好是 star 最高、最该露脸的那批（且需要人工回来调数字）。
 * 现在 max 只削长尾，配置一次就不用再管。
 */
export function selectOpensourceRepos(repos, { usedRepos, threshold, since, starLine = DEFAULT_STAR_LINE, max, align = DEFAULT_ALIGN_STEP, exclude } = {}) {
  const excluded = exclude ?? new Set();
  const entries = Object.entries(repos).filter(
    ([name, r]) =>
      !r.fork &&
      !r.archived &&
      !usedRepos.has(name.toLowerCase()) &&
      !excluded.has(name.toLowerCase()) &&
      (r.stars >= threshold || (since !== undefined && (r.created ?? "") >= since)),
  );
  // 排序用的人工更新时间；没有就退回 pushed_at（见函数注释：为什么要这层回落）
  const touched = (r) => r.humanUpdated || r.updated || "";
  entries.sort((a, b) => {
    const aHi = a[1].stars > starLine;
    const bHi = b[1].stars > starLine;
    if (aHi !== bHi) return aHi ? -1 : 1;
    if (aHi) return b[1].stars - a[1].stars || a[0].localeCompare(b[0]);
    return touched(b[1]).localeCompare(touched(a[1])) || a[0].localeCompare(b[0]);
  });
  if (max === undefined) return entries;
  // 排序保证高星组是前缀，所以尾巴起点 = 第一个非高星项；高星组全取，尾巴再取 max 个
  const tailStart = entries.findIndex(([, r]) => r.stars <= starLine);
  const highCount = tailStart === -1 ? entries.length : tailStart;
  let take = highCount + Math.max(0, max);
  // 向上对齐到网格列数的整数倍：多补几张凑满最后一行（候选不够时 slice 自然只给到实际数量）
  if (max > 0 && align > 1) take = Math.ceil(take / align) * align;
  return entries.slice(0, take);
}

/**
 * 缩略图抓取的重试编排（依赖注入，可无网络测试）。
 *
 * 为什么单独一轮补抓，而不是在单项里原地长等：GitHub 的自动社交卡
 * （opengraph.githubassets.com）是动态渲染器、按 IP 突发限流，一批图里总有一两张会落在
 * 限流窗口里。原地等满 Retry-After 会让一项吃掉几分钟，而同批后面的项本来一次就能过——
 * 限流是按窗口的，所以整批只该在跑完后再等一个窗口一起补抓，而不是每张各自赌运气。
 *
 * grab 返回资源路径（如 /shots/x.webp）；返回 null 表示「这条不需要图」（本地引用等），
 * 与「抓失败」是三种不同结果，不能混成一种。抛错才算失败，进补抓队列。
 * lost 是补抓后仍然失败的项：调用方要把它报出去（缺失必须可见、且一句「重跑即可补」可自救），
 * 不要在这里悄悄兜底换一张旧图把问题盖掉。
 * onRetry(失败数, 冷却毫秒) 只用来打进度行（不传就闷头等 60s，日志上像卡住了）。
 */
export async function fetchShotsWithRetry(
  items,
  { grab, cooloffMs = SHOT_COOLDOWN_MS, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), onRetry } = {},
) {
  const shots = {};
  const first = [];
  for (const it of items) {
    try {
      const r = await grab(it);
      if (r) shots[it.slug] = r;
    } catch (e) {
      first.push({ it, message: e?.message ?? String(e) });
    }
  }
  if (!first.length) return { shots, lost: [] };
  onRetry?.(first.length, cooloffMs);
  await sleep(cooloffMs);
  const lost = [];
  for (const { it, message } of first) {
    try {
      const r = await grab(it);
      if (r) shots[it.slug] = r;
    } catch (e) {
      lost.push({ slug: it.slug, message: e?.message ?? message });
    }
  }
  return { shots, lost };
}

/** github.com/<用户>/<仓库> 形状才算仓库；纯用户主页/其他站返回 null */
export function repoFromUrl(u) {
  const m = /github\.com\/([^/?#]+)\/([^/?#]+)/.exec(String(u ?? ""));
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, "") } : null;
}

/**
 * 仓库名列表归一（开源排除用）：既收裸仓库名（js-opencc），也收完整 GitHub 网址
 * （https://github.com/rockbenben/js-opencc）——用户看的是仓库页面，手上通常只有链接，
 * 直接粘进 YAML 是最自然的写法。
 * 不归一的代价是静默失效：URL 会被当成一个字面仓库名去比对，永远匹配不上，
 * 且既不报错也不告警，排除名单看着写好了、仓库照旧出现在页面上。排查起来只能靠人眼。
 * 非字符串/空串丢掉（是否该告警由调用方决定，它有 where 文案可用）。
 */
export function repoNamesFrom(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((x) => typeof x === "string" && x.trim() !== "")
    .map((x) => repoFromUrl(x.trim())?.repo ?? x.trim());
}

/** 空串 / 纯空白都算没填；schema 与 validate 脚本共用同一判据 */
export function isBlank(v) {
  return String(v ?? "").trim() === "";
}

/** 零配置纠错：裸邮箱补 mailto:、裸域名补 https://；带协议/站内路径原样 */
export function fixUrl(u) {
  const s = String(u ?? "").trim();
  if (!s || /^[a-z][a-z0-9+.-]*:/i.test(s) || s.startsWith("/") || s.startsWith("#")) return s;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return `mailto:${s}`;
  if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(s)) return `https://${s}`;
  return s;
}
