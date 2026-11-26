import { emptyConfig, emptyWork, type EditConfig } from "./types";

// 草稿存在本机 localStorage：表单不提交、也没有后端，刷新/关页就是全部丢失。
// 只存内部字段名，界面语言切换不影响恢复；解析失败/版本不符一律丢弃，绝不半信半疑地恢复。
export const DRAFT_KEY = "onepage-editor-draft";
const VERSION = 1;

const SCALAR_KEYS = [
  "name",
  "title",
  "intro",
  "avatar",
  "url",
  "color",
  "theme",
  "appearance",
  "opensource",
  "opensourceSince",
  "starLine",
  "opensourceMax",
  "footer",
  "mark",
  "lang",
] as const;

interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const str = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return "";
};

const strMap = (v: unknown): Record<string, string> => {
  if (!isObj(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === "string" || (typeof val === "number" && Number.isFinite(val))) {
      out[k] = String(val);
    }
  }
  return out;
};

export function hasAnyContent(config: EditConfig): boolean {
  return (
    SCALAR_KEYS.some((k) => config[k].trim() !== "") ||
    config.links.length > 0 ||
    config.works.length > 0 ||
    config.stats.length > 0 ||
    config.opensourceExclude.length > 0 ||
    Object.keys(config.opensourceNames).length > 0 ||
    Object.keys(config.opensourceDescriptions).length > 0
  );
}

export function serializeDraft(config: EditConfig): string {
  return JSON.stringify({ v: VERSION, config });
}

export function parseDraft(raw: string | null): EditConfig | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObj(data) || data.v !== VERSION || !isObj(data.config)) return null;

  const src = data.config;
  const config = emptyConfig();
  for (const k of SCALAR_KEYS) {
    if (typeof src[k] === "string") config[k] = src[k] as string;
  }

  config.links = Array.isArray(src.links)
    ? src.links.filter(isObj).map((l) => ({ label: str(l.label), url: str(l.url) }))
    : [];
  config.stats = Array.isArray(src.stats)
    ? src.stats.filter(isObj).map((s) => ({
        label: str(s.label),
        value: typeof s.value === "number" && Number.isFinite(s.value) ? s.value : str(s.value),
      }))
    : [];
  config.works = Array.isArray(src.works)
    ? src.works.filter(isObj).map((w) => ({
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
      }))
    : [];
  config.opensourceExclude = Array.isArray(src.opensourceExclude)
    ? src.opensourceExclude.filter((x): x is string => typeof x === "string")
    : [];
  config.opensourceNames = strMap(src.opensourceNames);
  config.opensourceDescriptions = strMap(src.opensourceDescriptions);
  return config;
}

export function readDraft(store?: Store): EditConfig | null {
  try {
    const s = store ?? localStorage;
    const raw = s.getItem(DRAFT_KEY);
    const config = parseDraft(raw);
    if (!config || !hasAnyContent(config)) {
      s.removeItem(DRAFT_KEY);
      return null;
    }
    return config;
  } catch {
    return null;
  }
}

export function writeDraft(config: EditConfig, store?: Store): void {
  try {
    const s = store ?? localStorage;
    if (hasAnyContent(config)) s.setItem(DRAFT_KEY, serializeDraft(config));
    else s.removeItem(DRAFT_KEY);
  } catch {
    /* 隐私模式等禁写 localStorage：编辑器照常可用，只是不保存草稿 */
  }
}

export function clearDraft(store?: Store): void {
  try {
    (store ?? localStorage).removeItem(DRAFT_KEY);
  } catch {
    /* 同上 */
  }
}
