import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import yaml from "js-yaml";
import { parseSite, normalizeSite } from "../src/lib/schema";
import { yamlToConfig, emptyConfig } from "../src/edit/importer";
import { configToYaml } from "../src/edit/serialize";
import { emptyWork, type EditConfig } from "../src/edit/types";
import { detectResidue, enYamlHasAuthorResidue } from "../src/edit/residue";

const load = (t: string) => yaml.load(t);

describe("headline：真实 v2 配置往返不失真", () => {
  const realYaml = readFileSync("src/data/projects.yaml", "utf8");

  it.each(["zh-CN", "en"] as const)(
    "%s：yamlToConfig → configToYaml → parseSite 与直接 parseSite 深度相等且零告警",
    (lang) => {
      const { config, error } = yamlToConfig(realYaml);
      expect(error).toBeUndefined();
      const roundTripYaml = configToYaml(config, lang);

      const direct = parseSite(load(realYaml));
      const round = parseSite(load(roundTripYaml));

      expect(direct.warnings).toEqual([]);
      expect(round.warnings).toEqual([]);
      expect(round.site).toEqual(direct.site);
    },
  );

  it("默认（中文界面）输出中文键、固定顺序", () => {
    const { config } = yamlToConfig(realYaml);
    const out = configToYaml(config); // 不传 lang，默认 zh-CN
    const topKeys = Object.keys(load(out) as Record<string, unknown>);
    const order = ["名字", "头衔", "介绍", "头像", "链接", "数据", "作品", "网址", "颜色", "主题", "外观", "开源项目", "开源项目起始", "星标线", "开源上限", "开源排除", "开源命名", "开源描述", "页脚", "标记", "语言"];
    const filtered = order.filter((k) => topKeys.includes(k));
    expect(topKeys).toEqual(filtered);
    expect(topKeys).toContain("名字");
    expect(topKeys).not.toContain("name");
  });

  it("英文界面输出英文键、同样的固定顺序，作品字段也英文", () => {
    const { config } = yamlToConfig(realYaml);
    const out = configToYaml(config, "en");
    const doc = load(out) as Record<string, unknown>;
    const topKeys = Object.keys(doc);
    const order = ["name", "title", "intro", "avatar", "links", "stats", "works", "url", "color", "theme", "appearance", "opensource", "opensource_since", "star_line", "opensource_max", "opensource_exclude", "opensource_names", "opensource_descriptions", "footer", "mark", "lang"];
    expect(topKeys).toEqual(order.filter((k) => topKeys.includes(k)));
    expect(topKeys).toContain("name");
    expect(topKeys).not.toContain("名字"); // 英文键，不是中文
    // 作品条目也用英文键（介绍→intro、重点→star）
    const firstWork = (doc.works as Record<string, unknown>[])[0];
    expect(Object.keys(firstWork).some((k) => /[一-龥]/.test(k))).toBe(false);
    expect(firstWork).toHaveProperty("name");
  });
});

describe("中英输入互认、导出键跟界面语言", () => {
  const enSrc = "name: A\ntitle: dev\nworks:\n  - name: W\n    intro: hi\n    link: https://w.com\n    star: true\n";
  const zhSrc = "名字: A\n头衔: dev\n作品:\n  - 名字: W\n    介绍: hi\n    链接: https://w.com\n    重点: true\n";

  it("英文写法与中文写法导入后 config 一致（默认中文键导出也一致）", () => {
    const enOut = configToYaml(yamlToConfig(enSrc).config);
    const zhOut = configToYaml(yamlToConfig(zhSrc).config);
    expect(enOut).toBe(zhOut);
    expect(enOut).toContain("名字: A");
    expect(enOut).toContain("重点: true");
  });

  it("英文界面导出英文键，且能被 parseSite 无告警读回", () => {
    const out = configToYaml(yamlToConfig(zhSrc).config, "en");
    expect(out).toContain("name: A");
    expect(out).toContain("star: true");
    expect(out).not.toContain("名字");
    const { warnings } = parseSite(load(out));
    expect(warnings).toEqual([]);
  });
});

describe("剪枝：保留 false/0、剪掉 NaN、重点只在 true 输出", () => {
  it("数据值 0 保留、NaN 剪掉", () => {
    const c = emptyConfig();
    c.name = "A";
    c.stats = [
      { label: "零", value: 0 },
      { label: "坏", value: Number.NaN },
      { label: "有", value: "5" },
    ];
    const doc = load(configToYaml(c)) as { 数据: Record<string, unknown>[] };
    const merged = Object.assign({}, ...doc.数据);
    expect(merged["零"]).toBe(0);
    expect(merged).not.toHaveProperty("坏");
    expect(merged["有"]).toBe("5");
  });

  it("重点 false 不落 YAML，true 才输出；作品其余字段仍在", () => {
    const c = emptyConfig();
    c.name = "A";
    c.works = [
      { ...emptyWork(), name: "普通", desc: "d" },
      { ...emptyWork(), name: "重点", star: true },
    ];
    const out = configToYaml(c);
    const doc = load(out) as { 作品: Record<string, unknown>[] };
    expect(doc.作品[0]).toEqual({ 名字: "普通", 介绍: "d" });
    expect(doc.作品[0]).not.toHaveProperty("重点");
    expect(doc.作品[1]).toEqual({ 名字: "重点", 重点: true });
  });
});

describe("坏 YAML 返 error 不抛", () => {
  it("语法错：返回 error 与空配置", () => {
    const r = yamlToConfig("名字: [未闭合\n");
    expect(r.error).toBeTruthy();
    expect(r.config).toEqual(emptyConfig());
  });
  it("顶层是数组：返回 error", () => {
    const r = yamlToConfig("- 名字: A\n");
    expect(r.error).toBeTruthy();
  });
  it("空文本：无 error、空配置", () => {
    expect(yamlToConfig("").error).toBeUndefined();
    expect(yamlToConfig("").config).toEqual(emptyConfig());
  });
});

describe("导出永远能过 normalizeSite", () => {
  const cases: [string, (c: EditConfig) => void][] = [
    ["最小", (c) => (c.name = "A")],
    ["含全部字段", (c) => {
      c.name = "A";
      c.title = "T";
      c.intro = "I";
      c.avatar = "/a.jpg";
      c.links = [{ label: "GitHub", url: "https://github.com/u" }];
      c.stats = [{ label: "S", value: "自动" }];
      c.works = [{ ...emptyWork(), name: "W", star: true }];
      c.url = "https://x.com";
      c.color = "#123456";
      c.footer = "f";
      c.lang = "中文";
    }],
    ["含空链接/空作品（应被剪掉）", (c) => {
      c.name = "A";
      c.links = [{ label: "", url: "" }];
      c.works = [emptyWork()];
      c.stats = [{ label: "", value: "" }];
    }],
  ];
  it.each(cases)("%s：yaml.load(export) 过 normalizeSite 不抛", (_label, build) => {
    const c = emptyConfig();
    build(c);
    const out = configToYaml(c);
    expect(() => normalizeSite(load(out))).not.toThrow();
  });
});

describe("空白 config 导出仅含用户填过的字段", () => {
  it("只填名字/介绍/一条作品 → 只出这三项相关键", () => {
    const c = emptyConfig();
    c.name = "张三";
    c.intro = "你好";
    c.works = [{ ...emptyWork(), name: "作品一", link: "https://a.com" }];
    const doc = load(configToYaml(c)) as Record<string, unknown>;
    expect(Object.keys(doc).sort()).toEqual(["介绍", "作品", "名字"].sort());
    expect(doc.头衔).toBeUndefined();
    expect(doc.链接).toBeUndefined();
    expect(doc.数据).toBeUndefined();
    // 该配置能直接构建
    const { site, warnings } = parseSite(doc);
    expect(warnings).toEqual([]);
    expect(site.name).toBe("张三");
    expect(site.groups[0].items[0].link).toBe("https://a.com");
  });

  it("完全空白（无名字）：导出为空文档，不含任何用户字段", () => {
    const doc = load(configToYaml(emptyConfig()));
    expect(doc == null || Object.keys(doc as object).length === 0).toBe(true);
  });
});

describe("残留检测真值表", () => {
  const base = (): EditConfig => ({ ...emptyConfig(), name: "我" });
  it("干净配置：无 finding", () => {
    expect(detectResidue(base())).toEqual([]);
  });
  it("github 链接含 rockbenben", () => {
    const c = base();
    c.links = [{ label: "GitHub", url: "https://github.com/rockbenben" }];
    expect(detectResidue(c).map((r) => r.kind)).toContain("github");
  });
  it("非 github 站含 rockbenben 不误报 github", () => {
    const c = base();
    c.links = [{ label: "站", url: "https://rockbenben.dev" }];
    expect(detectResidue(c).map((r) => r.kind)).not.toContain("github");
  });
  it("网址含 me.newzone.top", () => {
    const c = base();
    c.url = "https://me.newzone.top";
    expect(detectResidue(c).map((r) => r.kind)).toContain("url");
  });
  it("名字 === Benson", () => {
    const c = base();
    c.name = "Benson";
    expect(detectResidue(c).map((r) => r.kind)).toContain("name");
  });
  it("页脚含 rockbenben", () => {
    const c = base();
    c.footer = '<a href="https://github.com/rockbenben">x</a>';
    expect(detectResidue(c).map((r) => r.kind)).toContain("footer");
  });
  it("en 文件布尔为真 → enYaml finding", () => {
    expect(detectResidue(base(), true).map((r) => r.kind)).toContain("enYaml");
    expect(detectResidue(base(), false).map((r) => r.kind)).not.toContain("enYaml");
  });
  // #1a：enYaml 这条 finding 只在用户点过「载入当前站配置」之后才纳入——
  // 空白起步（未载入）即使构建期 enResidue=true，也不该被别人的英文翻译残留糊脸。
  // 不传第三参时保持旧语义（视为已载入），兼容既有调用方与上面两条断言。
  it("enYaml 门控：未载入（loadedCurrent=false）不计入，载入后（true）才计入", () => {
    const c = base();
    expect(detectResidue(c, true, false).map((r) => r.kind)).not.toContain("enYaml");
    expect(detectResidue(c, true, true).map((r) => r.kind)).toContain("enYaml");
    expect(detectResidue(c, true).map((r) => r.kind)).toContain("enYaml"); // 默认值 = 已载入
  });
  it("enYamlHasAuthorResidue：作者特征串或 rockbenben 命中", () => {
    expect(enYamlHasAuthorResidue('头衔: Founder of "365 Open Source"')).toBe(true);
    expect(enYamlHasAuthorResidue("链接: https://github.com/rockbenben")).toBe(true);
    expect(enYamlHasAuthorResidue("头衔: Independent developer\n介绍: hi")).toBe(false);
  });
  it("真实 projects.en.yaml 命中作者残留", () => {
    expect(enYamlHasAuthorResidue(readFileSync("src/data/projects.en.yaml", "utf8"))).toBe(true);
  });
});

describe("#4 英文别名往返：覆盖 via/group/source/image/date + 英文键 stats + 顶层 url/color/footer/lang", () => {
  it("完整英文键 YAML 与等价中文键 YAML：config 深度相等，configToYaml 产物一致", () => {
    const enSrc = `
name: A
title: T
intro: I
avatar: /a.jpg
links:
  - GitHub: https://github.com/u
stats:
  - Stars: "100"
works:
  - name: W
    intro: hi
    link: https://w.com
    source: https://github.com/u/w
    image: https://img.com/w.png
    date: 2026-05
    via: Some Site
    group: Cat
    star: true
url: https://x.com
color: '#123456'
footer: f
lang: en
`;
    const zhSrc = `
名字: A
头衔: T
介绍: I
头像: /a.jpg
链接:
  - GitHub: https://github.com/u
数据:
  - Stars: "100"
作品:
  - 名字: W
    介绍: hi
    链接: https://w.com
    源码: https://github.com/u/w
    图: https://img.com/w.png
    日期: 2026-05
    出处: Some Site
    分类: Cat
    重点: true
网址: https://x.com
颜色: '#123456'
页脚: f
语言: en
`;
    const enResult = yamlToConfig(enSrc);
    const zhResult = yamlToConfig(zhSrc);
    expect(enResult.error).toBeUndefined();
    expect(zhResult.error).toBeUndefined();
    expect(enResult.config).toEqual(zhResult.config);
    expect(configToYaml(enResult.config)).toBe(configToYaml(zhResult.config));
  });
});

describe("主题/外观：往返、值随语言、默认不落键", () => {
  it("中文界面：主题/外观出中文键与中文值", () => {
    const c = emptyConfig();
    c.name = "A";
    c.theme = "靛蓝";
    c.appearance = "暗";
    const doc = load(configToYaml(c)) as Record<string, unknown>;
    expect(doc["主题"]).toBe("靛蓝");
    expect(doc["外观"]).toBe("暗");
  });
  it("英文界面：主题/外观出英文键与英文值，且能被 parseSite 无告警读回", () => {
    const c = emptyConfig();
    c.name = "A";
    c.theme = "靛蓝";
    c.appearance = "暗";
    const out = configToYaml(c, "en");
    expect(out).toContain("theme: indigo");
    expect(out).toContain("appearance: dark");
    const { site, warnings } = parseSite(load(out));
    expect(warnings).toEqual([]);
    expect(site.themeName).toBe("靛蓝");
    expect(site.appearance).toBe("暗");
  });
  it("默认（空）不落主题/外观键", () => {
    const c = emptyConfig();
    c.name = "A";
    const doc = load(configToYaml(c)) as Record<string, unknown>;
    expect(doc).not.toHaveProperty("主题");
    expect(doc).not.toHaveProperty("外观");
  });
  it("导入英文值归一到规范中文（回表单）", () => {
    const { config } = yamlToConfig("name: A\ntheme: pine\nappearance: light\n");
    expect(config.theme).toBe("森绿");
    expect(config.appearance).toBe("亮");
  });
});

describe("开源项目/起始：数字与字符串、随语言、往返", () => {
  it("中文界面：开源项目出数字、起始出字符串", () => {
    const c = emptyConfig(); c.name = "A"; c.opensource = "10"; c.opensourceSince = "2026-03";
    const doc = load(configToYaml(c)) as Record<string, unknown>;
    expect(doc["开源项目"]).toBe(10);
    expect(doc["开源项目起始"]).toBe("2026-03");
  });
  it("英文界面：出英文键，parseSite 无告警读回", () => {
    const c = emptyConfig(); c.name = "A"; c.opensource = "10"; c.opensourceSince = "2026-03";
    const out = configToYaml(c, "en");
    expect(out).toContain("opensource: 10");
    expect(out).toContain("opensource_since:");
    const { site, warnings } = parseSite(load(out));
    expect(warnings).toEqual([]);
    expect(site.opensource).toBe(10);
    expect(site.opensourceSince).toBe("2026-03");
  });
  it("空/非数字阈值不落键", () => {
    const c = emptyConfig(); c.name = "A"; c.opensource = ""; c.opensourceSince = "";
    const doc = load(configToYaml(c)) as Record<string, unknown>;
    expect(doc).not.toHaveProperty("开源项目");
    expect(doc).not.toHaveProperty("开源项目起始");
  });
  it("导入数字/日期回表单", () => {
    const { config } = yamlToConfig("name: A\nopensource: 10\nopensource_since: 2026-03\n");
    expect(config.opensource).toBe("10");
    expect(config.opensourceSince).toBe("2026-03");
  });
  it("星标线 / 开源上限：数字往返、空不落键", () => {
    const c = emptyConfig(); c.name = "A"; c.starLine = "20"; c.opensourceMax = "12";
    const doc = load(configToYaml(c)) as Record<string, unknown>;
    expect(doc["星标线"]).toBe(20);
    expect(doc["开源上限"]).toBe(12);
    const out = configToYaml(c, "en");
    expect(out).toContain("star_line: 20");
    expect(out).toContain("opensource_max: 12");
    const { site } = parseSite(load(out));
    expect(site.starLine).toBe(20);
    expect(site.opensourceMax).toBe(12);
    const empty = emptyConfig(); empty.name = "A";
    expect(load(configToYaml(empty))).not.toHaveProperty("星标线");
    expect(load(configToYaml(empty))).not.toHaveProperty("开源上限");
  });
  it("开源命名：映射往返保留（编辑器无 UI 也不丢），空映射不落键", () => {
    const { config } = yamlToConfig("name: A\nopensource_names:\n  md-translator: MD Translator\n");
    expect(config.opensourceNames).toEqual({ "md-translator": "MD Translator" });
    const doc = load(configToYaml(config)) as Record<string, unknown>;
    expect(doc["开源命名"]).toEqual({ "md-translator": "MD Translator" });
    const { site } = parseSite(load(configToYaml(config, "en")));
    expect(site.opensourceNames).toEqual({ "md-translator": "MD Translator" });
    const empty = emptyConfig(); empty.name = "A";
    expect(load(configToYaml(empty))).not.toHaveProperty("开源命名"); // 空映射被剪掉
  });
});

describe("标记：字符串往返、随语言、空不落键", () => {
  it("中/英界面出对应键与值，parseSite 无告警读回", () => {
    const c = emptyConfig(); c.name = "A"; c.mark = "365 · OS";
    expect((load(configToYaml(c)) as Record<string, unknown>)["标记"]).toBe("365 · OS");
    const out = configToYaml(c, "en");
    expect(out).toContain("mark: 365 · OS");
    const { site, warnings } = parseSite(load(out));
    expect(warnings).toEqual([]);
    expect(site.mark).toBe("365 · OS");
  });
  it("空不落键", () => {
    const c = emptyConfig(); c.name = "A";
    expect(load(configToYaml(c))).not.toHaveProperty("标记");
  });
});
