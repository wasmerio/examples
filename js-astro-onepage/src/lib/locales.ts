/**
 * 语言发现：文件名即配置。有 projects.<码>.yaml 就发布该语言、删文件即下线。
 *
 * 扫 src/data/projects.*.yaml：主语言在前、其余按语言码字典序。
 * v2 去掉了 site.languages 发布控制——回到最初机制，配置面不再管发布哪些语言。
 */

/** BCP-47 的一个够用子集：en / zh-CN / pt-BR，挡掉 projects.backup.yaml 这类误留文件 */
const LANG_RE = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/;

export interface Locale {
  code: string;
  /** 是否住在 /（站点首页）。即主文件的语言 */
  isPrimary: boolean;
  /** 该语言首页的站内路径 */
  href: string;
}

export interface BuildResult {
  locales: Locale[];
  /** 恒为空数组：文件名自动发现没有可告警的配置面，保留字段是为签名统一 */
  warnings: string[];
}

/** projects.en.yaml → "en"；不是合法语言文件则 null */
export function localeFromFilename(file: string): string | null {
  const code = /^projects\.(.+)\.yaml$/.exec(file)?.[1];
  return code && LANG_RE.test(code) ? code : null;
}

const mkLocales = (codes: string[]): Locale[] =>
  codes.map((code, i) => ({ code, isPrimary: i === 0, href: i === 0 ? "/" : `/${code}/` }));

/**
 * @param files    src/data/ 下的文件名列表
 * @param baseLang 主文件的 site.lang
 *
 * 语言码一律按小写比较（LANG_RE 的次级子标签允许任意大小写，"zh-CN" 与 "zh-cn"
 * 若按精确字符串比较会被当成两种语言，产出内容几乎重复的「影子语言」页面；
 * Windows 文件系统大小写不敏感，这类误建更容易发生）。
 * 但输出保留规范写法——等于 site.lang 的取 site.lang 的写法、其余取文件名的写法，
 * 因为它要进 <html lang> 和 hreflang。
 */
export function buildLocales(files: string[], baseLang: string): BuildResult {
  const baseLower = baseLang.toLowerCase();

  // 扫文件：小写语言码 -> 文件名里最先出现的原始写法。与主语言同码的文件忽略（主文件优先）
  const fileCodes = new Map<string, string>();
  for (const file of files) {
    const code = localeFromFilename(file);
    if (code === null) continue;
    const lower = code.toLowerCase();
    if (lower === baseLower || fileCodes.has(lower)) continue;
    fileCodes.set(lower, code);
  }

  return {
    locales: mkLocales([baseLang, ...[...fileCodes.values()].sort()]),
    warnings: [],
  };
}
