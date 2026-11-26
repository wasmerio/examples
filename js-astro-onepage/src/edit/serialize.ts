// 把 EditConfig 序列化成干净合法的 projects.yaml 文本：固定顺序、剪空值。
// 键跟界面语言走：中文界面出中文键（名字/作品…），英文界面出英文键（name/works…）——
// 两套都是 v2 的合法别名，parseSite 都认，往返不失真。
// 顺序：名字→头衔→介绍→头像→链接→数据→作品→网址→颜色→主题→外观→开源项目→开源项目起始→星标线→开源上限→开源排除→开源命名→开源描述→页脚→标记→语言。
import yaml from "js-yaml";
import type { EditConfig, EditWork } from "./types";
import type { EditorLang } from "./ui";

// 一套「内部字段 → YAML 键名」映射；zh 出中文键、en 出英文别名。
// 英文别名与 scripts/helpers.mjs 的 TOP_ALIAS/WORK_ALIAS 保持一致（作品的「介绍」英文别名是 intro）。
interface KeyMap {
  name: string; title: string; intro: string; avatar: string;
  links: string; stats: string; works: string;
  url: string; color: string; theme: string; appearance: string; opensource: string; opensourceSince: string; starLine: string; opensourceMax: string; opensourceExclude: string; opensourceNames: string; opensourceDescriptions: string; footer: string; mark: string; lang: string;
  wName: string; wDesc: string; wLink: string; wSource: string;
  wImage: string; wDate: string; wVia: string; wGroup: string; wStar: string;
}
const ZH: KeyMap = {
  name: "名字", title: "头衔", intro: "介绍", avatar: "头像",
  links: "链接", stats: "数据", works: "作品",
  url: "网址", color: "颜色", theme: "主题", appearance: "外观", opensource: "开源项目", opensourceSince: "开源项目起始", starLine: "星标线", opensourceMax: "开源上限", opensourceExclude: "开源排除", opensourceNames: "开源命名", opensourceDescriptions: "开源描述", footer: "页脚", mark: "标记", lang: "语言",
  wName: "名字", wDesc: "介绍", wLink: "链接", wSource: "源码",
  wImage: "图", wDate: "日期", wVia: "出处", wGroup: "分类", wStar: "重点",
};
const EN: KeyMap = {
  name: "name", title: "title", intro: "intro", avatar: "avatar",
  links: "links", stats: "stats", works: "works",
  url: "url", color: "color", theme: "theme", appearance: "appearance", opensource: "opensource", opensourceSince: "opensource_since", starLine: "star_line", opensourceMax: "opensource_max", opensourceExclude: "opensource_exclude", opensourceNames: "opensource_names", opensourceDescriptions: "opensource_descriptions", footer: "footer", mark: "mark", lang: "lang",
  wName: "name", wDesc: "intro", wLink: "link", wSource: "source",
  wImage: "image", wDate: "date", wVia: "via", wGroup: "group", wStar: "star",
};
const KEYS: Record<EditorLang, KeyMap> = { "zh-CN": ZH, en: EN };

// 主题/外观的值随界面语言：中文界面原样出规范中文，英文界面出英文别名。
const THEME_VALUE: Record<EditorLang, Record<string, string>> = {
  "zh-CN": { 朱砂: "朱砂", 靛蓝: "靛蓝", 森绿: "森绿", 暖褐: "暖褐", 墨黑: "墨黑" },
  en: { 朱砂: "cinnabar", 靛蓝: "indigo", 森绿: "pine", 暖褐: "sepia", 墨黑: "mono" },
};
const AP_VALUE: Record<EditorLang, Record<string, string>> = {
  "zh-CN": { 自动: "自动", 亮: "亮", 暗: "暗" },
  en: { 自动: "auto", 亮: "light", 暗: "dark" },
};

// 剪枝规则：丢 undefined/null/空串/空数组/空对象；保留 false 与 0（否则布尔/数值会误删）；
// NaN/Infinity（如导入的 .nan）不是合法数值，按空值剪掉，避免导出 .nan。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prune(v: any): any {
  if (Array.isArray(v)) {
    const a = v.map(prune).filter((x) => x !== undefined);
    return a.length ? a : undefined;
  }
  if (v !== null && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      const pv = prune(val);
      if (pv !== undefined) o[k] = pv;
    }
    return Object.keys(o).length ? o : undefined;
  }
  if (v === "" || v === null || v === undefined) return undefined;
  if (typeof v === "number" && !Number.isFinite(v)) return undefined;
  return v; // 保留 false / 0 / 非空字符串 / 有限数字
}

/** 一条作品 → 键对象；「重点」只在 true 时输出（false 不落 YAML）。 */
function workToObj(w: EditWork, k: KeyMap): Record<string, unknown> | undefined {
  return prune({
    [k.wName]: w.name,
    [k.wDesc]: w.desc,
    [k.wLink]: w.link,
    [k.wSource]: w.source,
    [k.wImage]: w.image,
    [k.wDate]: w.date,
    [k.wVia]: w.via,
    [k.wGroup]: w.group,
    [k.wStar]: w.star ? true : undefined,
  });
}

export function configToYaml(config: EditConfig, lang: EditorLang = "zh-CN"): string {
  const k = KEYS[lang];
  const doc =
    prune({
      [k.name]: config.name,
      [k.title]: config.title,
      [k.intro]: config.intro,
      [k.avatar]: config.avatar,
      // 链接/数据 是单键映射列表；空标签的条目先滤掉再成形（标签是用户自己写的，不本地化）
      [k.links]: config.links.filter((l) => l.label || l.url).map((l) => ({ [l.label]: l.url })),
      [k.stats]: config.stats.filter((s) => s.label).map((s) => ({ [s.label]: s.value })),
      [k.works]: config.works.filter((w) => w.name).map((w) => workToObj(w, k)),
      [k.url]: config.url,
      [k.color]: config.color,
      [k.theme]: THEME_VALUE[lang][config.theme],
      [k.appearance]: AP_VALUE[lang][config.appearance],
      [k.opensource]: config.opensource.trim() && Number.isFinite(Number(config.opensource)) ? Number(config.opensource) : undefined,
      [k.opensourceSince]: config.opensourceSince.trim() || undefined,
      [k.starLine]: config.starLine.trim() && Number.isFinite(Number(config.starLine)) ? Number(config.starLine) : undefined,
      [k.opensourceMax]: config.opensourceMax.trim() && Number.isFinite(Number(config.opensourceMax)) ? Number(config.opensourceMax) : undefined,
      [k.opensourceExclude]: config.opensourceExclude, // 空列表由 prune 剪掉
      [k.opensourceNames]: config.opensourceNames, // 空映射由 prune 剪掉
      [k.opensourceDescriptions]: config.opensourceDescriptions,
      [k.footer]: config.footer,
      [k.mark]: config.mark,
      [k.lang]: config.lang,
    }) ?? {};
  // lineWidth:-1 关掉长字符串折行（折行的 YAML 更丑也更易被误改）；noRefs 关锚点别名
  return yaml.dump(doc, { lineWidth: -1, noRefs: true });
}
