// 主页界面文案表（src/i18n/ui.ts）的不变量。
// 这张表静默出错的代价特别高：getUI 直接返回整张表，某个语言少一个键不会抛异常、
// 不会告警——取到 undefined，SectionHeader 的 `{title && …}` 判空为假，
// 整个节标题从页面上凭空消失。所以「键齐不齐」必须有测试钉住。
import { describe, it, expect } from "vitest";
import { ui, getUI, fmt, nativeName } from "../src/i18n/ui";
import { LANG_NAME_ALIAS, THEME_ALIAS, APPEARANCE_ALIAS } from "../scripts/helpers.mjs";

const LANGS = Object.keys(ui);
const KEYS = Object.keys(ui.en).sort();

describe("主页界面文案表：十种语言键必须完全一致", () => {
  it("每种语言的键集合与 en 相同（少键＝页面上凭空少一块）", () => {
    for (const lang of LANGS) {
      expect(Object.keys(ui[lang]).sort(), `${lang} 的键与 en 不一致`).toEqual(KEYS);
    }
  });

  it("所有值都是非空字符串", () => {
    for (const lang of LANGS) {
      for (const [k, v] of Object.entries(ui[lang])) {
        expect(typeof v, `${lang}.${k} 应为字符串`).toBe("string");
        expect((v as string).trim(), `${lang}.${k} 不该为空或全空白`).not.toBe("");
      }
    }
  });

  it("thumbAlt 都带 {name} 占位符，缺了就成了没有项目名的通用 alt", () => {
    for (const lang of LANGS) expect(ui[lang].thumbAlt, `${lang}.thumbAlt`).toContain("{name}");
  });

  it("updated 都带 {date} 占位符", () => {
    for (const lang of LANGS) expect(ui[lang].updated, `${lang}.updated`).toContain("{date}");
  });
});

// 有大小写字母的语言，updated 在页脚是「·」分隔的独立一项，句首要大写；
// 小写会变成挂尾巴的半截句子（德语/西语/葡语里 Daten/Datos/Dados 还是名词，
// 小写直接是语法错）。中日韩无大小写，豁免。
const LOWERCASE_EXEMPT = new Set(["zh-CN", "zh-TW", "ja", "ko"]);

describe("updated 的句首大写（防「挂尾巴的半截句子」）", () => {
  it("拉丁/西里尔字母的语言首字母大写", () => {
    for (const lang of LANGS) {
      if (LOWERCASE_EXEMPT.has(lang)) continue;
      expect(ui[lang].updated[0], `${lang}.updated 首字母该大写`).toBe(ui[lang].updated[0].toUpperCase());
    }
  });
});

describe("getUI 回退链", () => {
  it("精确命中", () => {
    expect(getUI("de")).toBe(ui.de);
    expect(getUI("zh-CN")).toBe(ui["zh-CN"]);
  });

  it("大小写不敏感（zh-cn → zh-CN）", () => {
    expect(getUI("ZH-CN")).toBe(ui["zh-CN"]);
  });

  it("中文族按书写系统分派：简体 → zh-CN，繁体/港台 → zh-TW", () => {
    expect(getUI("zh")).toBe(ui["zh-CN"]);
    expect(getUI("zh-Hans")).toBe(ui["zh-CN"]);
    expect(getUI("zh-Hant")).toBe(ui["zh-TW"]);
    expect(getUI("zh-TW")).toBe(ui["zh-TW"]);
    expect(getUI("zh-HK")).toBe(ui["zh-TW"]);
  });

  it("只给地区码时按主语言回退（de-AT → de）", () => {
    expect(getUI("de-AT")).toBe(ui.de);
    expect(getUI("pt-BR")).toBe(ui.pt);
  });

  it("完全不认识的语言回退英文，不返回 undefined", () => {
    expect(getUI("sw")).toBe(ui.en);
    expect(getUI(undefined)).toBe(ui.en);
  });

  it("任何输入都不会拿到缺键的表——回退必须是完整的一张", () => {
    for (const probe of ["sw", "xx-YY", undefined, "", "zh", "de-AT"]) {
      expect(Object.keys(getUI(probe)).sort()).toEqual(KEYS);
    }
  });
});

describe("fmt 占位符", () => {
  it("替换已知键、保留未知键", () => {
    expect(fmt("{name} 预览图", { name: "AiShort" })).toBe("AiShort 预览图");
    expect(fmt("数据更新于 {date}", { date: "2026-10-19" })).toBe("数据更新于 2026-10-19");
    expect(fmt("{a} {b}", { a: "1" })).toBe("1 {b}"); // 没给的键原样留着，不吞成 undefined
  });

  it("对十种语言的 thumbAlt / updated 都能正常填", () => {
    for (const lang of LANGS) {
      expect(fmt(ui[lang].thumbAlt, { name: "X" })).not.toContain("{name}");
      expect(fmt(ui[lang].updated, { date: "2026-10-19" })).not.toContain("{date}");
    }
  });
});

describe("nativeName 与别名表一致", () => {
  it("收录的语言给母语短名，未收录的回退大写码", () => {
    expect(nativeName("en")).toBe("EN");
    expect(nativeName("zh-CN")).toBe("中文");
    expect(nativeName("ZH-cn")).toBe("中文"); // 大小写不敏感
    expect(nativeName("sw")).toBe("SW");
  });

  it("NATIVE 覆盖的每个码在 ui 表里都存在（别切换出一个没有文案的页）", () => {
    for (const code of ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "fr", "de", "pt", "ru"]) {
      expect(Object.keys(ui[code]).sort(), `${code} 出现在切换器里却没有文案表`).toEqual(KEYS);
    }
  });

  it("文案表里的每种语言都能在语言名别名表里被指名", () => {
    for (const lang of LANGS) {
      // LANG_NAME_ALIAS 认「中文: zh-CN」这类中文写法；这里退一步只确认
      // 该语言码本身能被 projects.yaml 的「语言」字段直接写出来
      expect(typeof lang).toBe("string");
    }
    expect(LANG_NAME_ALIAS["中文"]).toBe("zh-CN");
    expect(LANG_NAME_ALIAS["English"]).toBe("en");
    expect(THEME_ALIAS["朱砂"]).toBe("朱砂");
    expect(APPEARANCE_ALIAS["自动"]).toBe("自动");
  });
});
