import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import yaml from "js-yaml";
import { parseSite, normalizeSite, slugify } from "../src/lib/schema";
// @ts-ignore -- 纯 ESM 模块无类型声明
import { loadConfig } from "../scripts/helpers.mjs";

const load = (t: string) => yaml.load(t);

describe("parseSite v2 基础", () => {
  it("最小 6 行出站", () => {
    const { site, warnings } = parseSite(load("名字: 张三\n介绍: 你好\n作品:\n  - 名字: A\n    介绍: a\n    链接: https://a.com\n"));
    expect(warnings).toEqual([]);
    expect(site.name).toBe("张三");
    expect(site.groups[0].items[0].link).toBe("https://a.com");
    expect(site.lang).toBe("zh-CN");
    expect(site.themeName).toBe("朱砂"); // 默认主题
    expect(site.appearance).toBe("亮"); // 默认外观
    expect(site.accent).toBeUndefined(); // 没写「颜色」就不内联覆盖
  });
  it("缺名字：致命", () => {
    expect(() => normalizeSite(load("介绍: x"))).toThrow(/名字|name/);
  });
  it("名字只有空格：同样视为缺失", () => {
    expect(() => normalizeSite(load('名字: "   "'))).toThrow(/名字|name/);
  });
  it("作品名字只有空格：告警并跳过", () => {
    const { site, warnings } = parseSite(load('名字: A\n作品:\n  - 名字: "   "\n    介绍: x\n'));
    expect(site.featured).toEqual([]);
    expect(site.groups.flatMap((g) => g.items)).toEqual([]);
    expect(warnings.join(" ")).toMatch(/缺「名字」/);
  });
  it("英文别名与中文写法产出一致", () => {
    const zh = parseSite(load("名字: A\n作品:\n  - 名字: W\n    重点: true\n")).site;
    const en = parseSite(load("name: A\nworks:\n  - name: W\n    star: true\n")).site;
    expect(en).toEqual(zh);
  });
  it("中英同现：中文优先并告警", () => {
    const { site, warnings } = parseSite(load("名字: 中\nname: EN\n"));
    expect(site.name).toBe("中");
    expect(warnings.join(" ")).toMatch(/name/);
  });
});

describe("重点 / 分类分拣", () => {
  const raw = load(readFileSync("tests/fixtures/writer.yaml", "utf8"));
  const { site, warnings } = parseSite(raw);
  it("零告警", () => expect(warnings).toEqual([]));
  it("重点只进 featured，不在分组重复", () => {
    expect(site.featured.map((w) => w.name)).toEqual(["十年之后的中文互联网"]);
    expect(site.groups.flatMap((g) => g.items.map((i) => i.name))).not.toContain("十年之后的中文互联网");
  });
  it("分类按首现排序，条目字段齐全", () => {
    expect(site.groups.map((g) => g.title)).toEqual(["文章", "播客"]);
    const essay = site.groups[0].items[0];
    expect(essay.date).toBe("2026-03");
    expect(essay.via).toBe("晚点");
  });
  it("无链接条目合法", () => {
    const pic = site.groups[1].items.find((i) => i.name === "手稿一页")!;
    expect(pic.link).toBeUndefined();
    expect(pic.image).toBe("/manuscript.png");
  });
  it("裸域名/裸邮箱链接被补全", () => {
    expect(site.links.find((l) => l.label === "博客")!.url).toBe("https://example.com");
    expect(site.links.find((l) => l.label === "邮箱")!.url).toBe("mailto:hi@example.com");
  });
});

describe("空链接 / 空数据条目", () => {
  it("空标签或空网址的链接告警并跳过", () => {
    const { site, warnings } = parseSite(
      load("名字: A\n链接:\n  - '': https://x.com\n  - GitHub: ''\n  - '   ': https://y.com\n  - 博客: https://example.com\n"),
    );
    expect(site.links).toEqual([{ label: "博客", url: "https://example.com" }]);
    const text = warnings.join(" ");
    expect(text).toMatch(/链接第 1 条缺「标签」或「网址」/);
    expect(text).toMatch(/链接第 2 条缺「标签」或「网址」/);
    expect(text).toMatch(/链接第 3 条缺「标签」或「网址」/);
  });

  it("空标签或空值的数据告警并跳过", () => {
    const { site, warnings } = parseSite(
      load("名字: A\n数据:\n  - '': 10\n  - Stars: ''\n  - '   ': 5\n  - 项目: 3\n"),
    );
    expect(site.stats).toEqual([{ label: "项目", value: 3 }]);
    const text = warnings.join(" ");
    expect(text).toMatch(/数据第 1 条缺「标签」或「值」/);
    expect(text).toMatch(/数据第 2 条缺「标签」或「值」/);
    expect(text).toMatch(/数据第 3 条缺「标签」或「值」/);
  });
});

describe("数据 / 语言 / 颜色", () => {
  it("数据支持字符串与数字；自动值 stars/repos/forks 标记", () => {
    const { site } = parseSite(load("名字: A\n链接:\n  - GitHub: https://github.com/u\n数据:\n  - Stars: 自动\n  - 项目: 项目数\n  - Fork: forks\n  - 其他: 30+\n"));
    expect(site.stats[0]).toMatchObject({ label: "Stars", auto: "stars" });
    expect(site.stats[1]).toMatchObject({ label: "项目", auto: "repos" });
    expect(site.stats[2]).toMatchObject({ label: "Fork", auto: "forks" });
    expect(site.stats[3]).toEqual({ label: "其他", value: "30+" });
  });
  it("自动但无 GitHub 链接：告警并跳过", () => {
    const { site, warnings } = parseSite(load("名字: A\n数据:\n  - 粉丝: 自动\n"));
    expect(site.stats).toEqual([]);
    expect(warnings.join(" ")).toMatch(/自动/);
  });
  it("语言名双认：中文→zh-CN；未知走原逻辑", () => {
    expect(parseSite(load("名字: A\n语言: 中文\n")).site.lang).toBe("zh-CN");
    expect(parseSite(load("名字: A\n语言: 繁體\n")).site.lang).toBe("zh-TW");
    expect(parseSite(load("名字: A\n语言: fr\n")).site.lang).toBe("fr");
  });
  it("颜色单值派生 accent2", () => {
    const { site } = parseSite(load('名字: A\n颜色: "#3366ff"\n'));
    expect(site.accent?.accent).toBe("#3366ff");
    expect(site.accent?.accent2).not.toBe("#3366ff"); // 深化后的 hover 色
    expect(site.accent?.accent2).toMatch(/^#[0-9a-f]{6}$/i);
  });
  it("主题：中文名、英文别名都认，未知回退朱砂并告警", () => {
    expect(parseSite(load("名字: A\n主题: 靛蓝\n")).site.themeName).toBe("靛蓝");
    expect(parseSite(load("名字: A\ntheme: indigo\n")).site.themeName).toBe("靛蓝");
    expect(parseSite(load("名字: A\n主题: Indigo\n")).site.themeName).toBe("靛蓝"); // 大小写容错
    const r = parseSite(load("名字: A\n主题: 紫气\n"));
    expect(r.site.themeName).toBe("朱砂");
    expect(r.warnings.some((w) => w.includes("主题"))).toBe(true);
  });
  it("外观：中英都认，默认亮，写自动/暗生效，未知回退亮并告警", () => {
    expect(parseSite(load("名字: A\n外观: 暗\n")).site.appearance).toBe("暗");
    expect(parseSite(load("名字: A\nappearance: dark\n")).site.appearance).toBe("暗");
    expect(parseSite(load("名字: A\n外观: 自动\n")).site.appearance).toBe("自动");
    expect(parseSite(load("名字: A\n")).site.appearance).toBe("亮"); // 默认亮
    const r = parseSite(load("名字: A\n外观: 半明\n"));
    expect(r.site.appearance).toBe("亮");
    expect(r.warnings.some((w) => w.includes("外观"))).toBe(true);
  });
  it("开源项目：数字/true 开启、缺省关、非法告警", () => {
    expect(parseSite(load("名字: A\n开源项目: 10\n")).site.opensource).toBe(10);
    expect(parseSite(load("名字: A\nopensource: true\n")).site.opensource).toBe(10);
    expect(parseSite(load("名字: A\n")).site.opensource).toBeUndefined();
    const r = parseSite(load("名字: A\n开源项目: 很多\n"));
    expect(r.site.opensource).toBeUndefined();
    expect(r.warnings.some((w) => w.includes("开源项目"))).toBe(true);
  });
  it("开源项目起始：原样字符串，缺省 undefined", () => {
    expect(parseSite(load("名字: A\n开源项目起始: 2026-03\n")).site.opensourceSince).toBe("2026-03");
    expect(parseSite(load("名字: A\nopensource_since: 2025-06\n")).site.opensourceSince).toBe("2025-06");
    expect(parseSite(load("名字: A\n")).site.opensourceSince).toBeUndefined();
  });
  it("星标线：数字，缺省 undefined", () => {
    expect(parseSite(load("名字: A\n星标线: 20\n")).site.starLine).toBe(20);
    expect(parseSite(load("名字: A\nstar_line: 5\n")).site.starLine).toBe(5);
    expect(parseSite(load("名字: A\n")).site.starLine).toBeUndefined();
  });
  it("开源上限：数字，缺省 undefined", () => {
    expect(parseSite(load("名字: A\n开源上限: 12\n")).site.opensourceMax).toBe(12);
    expect(parseSite(load("名字: A\nopensource_max: 8\n")).site.opensourceMax).toBe(8);
    expect(parseSite(load("名字: A\n")).site.opensourceMax).toBeUndefined();
  });
  it("开源命名：映射收标量值、空/非映射忽略、非映射告警", () => {
    const m = parseSite(load("名字: A\n开源命名:\n  md-translator: MD Translator\n  x: 1\n")).site.opensourceNames;
    expect(m).toEqual({ "md-translator": "MD Translator", x: "1" });
    expect(parseSite(load("名字: A\nopensource_names:\n  a: B\n")).site.opensourceNames).toEqual({ a: "B" });
    expect(parseSite(load("名字: A\n")).site.opensourceNames).toBeUndefined();
    expect(parseSite(load("名字: A\n开源命名: {}\n")).site.opensourceNames).toBeUndefined(); // 空映射不落
    const r = parseSite(load("名字: A\n开源命名: 不是映射\n"));
    expect(r.site.opensourceNames).toBeUndefined();
    expect(r.warnings.some((w) => w.includes("开源命名"))).toBe(true);
  });
  it("开源描述：映射收标量值、缺省 undefined、非映射告警", () => {
    expect(parseSite(load("名字: A\n开源描述:\n  md-translator: 翻译 Markdown\n")).site.opensourceDescriptions).toEqual({ "md-translator": "翻译 Markdown" });
    expect(parseSite(load("名字: A\nopensource_descriptions:\n  a: b\n")).site.opensourceDescriptions).toEqual({ a: "b" });
    expect(parseSite(load("名字: A\n")).site.opensourceDescriptions).toBeUndefined();
    const r = parseSite(load("名字: A\n开源描述: 不是映射\n"));
    expect(r.site.opensourceDescriptions).toBeUndefined();
    expect(r.warnings.some((w) => w.includes("开源描述"))).toBe(true);
  });
  it("开源排除：字符串列表、滤空、缺省 undefined、非列表告警", () => {
    expect(parseSite(load("名字: A\n开源排除:\n  - onepage\n  - foo\n")).site.opensourceExclude).toEqual(["onepage", "foo"]);
    expect(parseSite(load("名字: A\nopensource_exclude:\n  - x\n  - ''\n")).site.opensourceExclude).toEqual(["x"]);
    expect(parseSite(load("名字: A\n")).site.opensourceExclude).toBeUndefined();
    expect(parseSite(load("名字: A\n开源排除: []\n")).site.opensourceExclude).toBeUndefined();
    const r = parseSite(load("名字: A\n开源排除: onepage\n"));
    expect(r.site.opensourceExclude).toBeUndefined();
    expect(r.warnings.some((w) => w.includes("开源排除"))).toBe(true);
  });
  it("标记：原样字符串，缺省 undefined", () => {
    expect(parseSite(load("名字: A\n标记: 365 · Open Source\n")).site.mark).toBe("365 · Open Source");
    expect(parseSite(load("名字: A\nmark: hi\n")).site.mark).toBe("hi");
    expect(parseSite(load("名字: A\n")).site.mark).toBeUndefined();
  });
});

describe("容错（告警不阻断）", () => {
  it("作品缺名字：告警跳过该条，不抛", () => {
    const { site, warnings } = parseSite(load("名字: A\n作品:\n  - 介绍: 无名\n  - 名字: B\n"));
    expect(site.groups[0].items.map((i) => i.name)).toEqual(["B"]);
    expect(warnings.join(" ")).toMatch(/名字/);
  });
  it("链接列表元素形状错：告警跳过", () => {
    const { site, warnings } = parseSite(load("名字: A\n链接:\n  - 不是映射\n  - GitHub: https://github.com/u\n"));
    expect(site.links).toHaveLength(1);
    expect(warnings.length).toBeGreaterThan(0);
  });
  it("重点值类型错：告警并当 false", () => {
    const { site, warnings } = parseSite(load("名字: A\n作品:\n  - 名字: W\n    重点: 是\n"));
    expect(site.featured).toEqual([]);
    expect(warnings.join(" ")).toMatch(/重点/);
  });
  it("砍掉的 v1 顶层键（site/profile/sections）：告警提示这是旧版写法", () => {
    const { warnings } = parseSite(load("名字: A\nsections:\n  - type: list\n"));
    expect(warnings.join(" ")).toMatch(/旧版/);
  });
});

describe("列表字段被写成映射：告警而非静默吞掉", () => {
  it.each([
    ["链接", "链接:\n  标签: url\n", (site: ReturnType<typeof normalizeSite>) => expect(site.links).toEqual([])],
    ["作品", "作品:\n  名字: 漏了减号\n", (site: ReturnType<typeof normalizeSite>) => expect(site.groups).toEqual([])],
    ["数据", "数据:\n  标签: 值\n", (site: ReturnType<typeof normalizeSite>) => expect(site.stats).toEqual([])],
  ])("「%s」写成映射：告警、按空处理", (label, extra, assertEmpty) => {
    const { site, warnings } = parseSite(load(`名字: A\n${extra}`));
    assertEmpty(site);
    expect(warnings.join(" ")).toMatch(new RegExp(label));
  });
});

describe("中英同现告警文案", () => {
  it("英文先出现、中文后出现：文案仍说用了中文的那个，不说先出现", () => {
    const { site, warnings } = parseSite(load("name: EN\n名字: 中\n"));
    expect(site.name).toBe("中");
    expect(warnings.join(" ")).toMatch(/中文/);
    expect(warnings.join(" ")).not.toMatch(/先出现/);
  });
});

describe("顶层名字为空串", () => {
  it("名字: \"\"：与缺失同等对待，致命", () => {
    expect(() => normalizeSite(load('名字: ""\n'))).toThrow(/名字|name/);
  });
});

describe("slugify", () => {
  it("空格标点转连字符、保留中文、小写", () => {
    expect(slugify("My Great Essay!")).toBe("my-great-essay");
    expect(slugify("千世书 Thousand Lives")).toBe("千世书-thousand-lives");
  });
  it("Unicode 感知：假名、谚文、西里尔字母不被剥光", () => {
    expect(slugify("ツール")).toBe("ツール");
    expect(slugify("도구")).toBe("도구");
    expect(slugify("инструмент")).toBe("инструмент");
  });
});

describe("端到端：loadConfig（CORE_SCHEMA）→ parseSite 的日期不被吞成 Date", () => {
  it("无引号「日期: 2024-01-15」原样保留成字符串", () => {
    const { site } = parseSite(
      loadConfig("名字: A\n作品:\n  - 名字: W\n    日期: 2024-01-15\n"),
    );
    expect(site.groups[0].items[0].date).toBe("2024-01-15");
  });
});
