import { describe, it, expect } from "vitest";
import { normalizeSite } from "../src/lib/schema";
import { mergeLocale } from "../src/lib/merge";

const rawBase = {
  名字: "张三",
  头衔: "独立开发者",
  介绍: "简介",
  页脚: "落款",
  链接: [{ GitHub: "https://github.com/u" }, { 邮箱: "hi@example.com" }],
  数据: [{ "GitHub Stars": "自动" }, { 开源项目: "30+" }],
  作品: [
    { 名字: "千世书", 介绍: "描述", 链接: "https://lives.example.com", 源码: "https://github.com/u/thousand-lives", 出处: "原出处", 重点: true },
    { 名字: "文章一", 介绍: "描述A", 链接: "https://a.com", 出处: "少数派", 分类: "文章" },
    { 名字: "文章二", 介绍: "描述B", 分类: "文章" },
    { 名字: "播客一", 介绍: "描述C", 分类: "播客" },
  ],
};
const base = normalizeSite(rawBase);
const articleItems = (s: typeof base) => s.groups.find((g) => g.title === "文章")!.items;

describe("mergeLocale 空覆盖 / 边界", () => {
  it("空覆盖：除 lang 外与主文件全等，无告警", () => {
    const { site, warnings } = mergeLocale(base, {}, "en");
    expect(warnings).toEqual([]);
    expect(site.lang).toBe("en");
    expect({ ...site, lang: base.lang }).toEqual(base);
  });

  it("overlay 为 null（空文件）等价空覆盖，无告警", () => {
    const { site, warnings } = mergeLocale(base, null, "en");
    expect(warnings).toEqual([]);
    expect(site.lang).toBe("en");
  });

  it("overlay 为 undefined 等价空覆盖，无告警", () => {
    const { site, warnings } = mergeLocale(base, undefined, "en");
    expect(warnings).toEqual([]);
    expect(site.lang).toBe("en");
  });

  it("overlay 顶层是数组：告警，不静默吞掉", () => {
    const { site, warnings } = mergeLocale(base, [{ 名字: "oops" }], "en");
    expect(site.featured[0].name).toBe("千世书");
    expect(warnings.join(" ")).toMatch(/映射/);
  });

  it("overlay 顶层是字符串：告警，不静默吞掉", () => {
    const { warnings } = mergeLocale(base, "oops", "en");
    expect(warnings.join(" ")).toMatch(/映射/);
  });

  it("不修改传入的 base（深拷贝隔离）", () => {
    mergeLocale(base, { 作品: { 千世书: { 名字: "X" } }, 头衔: "Y" }, "en");
    expect(base.featured[0].name).toBe("千世书");
    expect(base.title).toBe("独立开发者");
  });

  it("告警文案带上文件名", () => {
    const { warnings } = mergeLocale(base, { 作品: { nope: {} } }, "ja");
    expect(warnings[0]).toMatch(/^projects\.ja\.yaml: /);
  });
});

describe("mergeLocale 顶层字段", () => {
  it("头衔/介绍/页脚按原文翻译，name 不参与", () => {
    const { site, warnings } = mergeLocale(base, { 头衔: "Indie dev", 介绍: "Bio", 页脚: "EN footer" }, "en");
    expect(warnings).toEqual([]);
    expect(site.title).toBe("Indie dev");
    expect(site.intro).toBe("Bio");
    expect(site.footer).toBe("EN footer");
    expect(site.name).toBe("张三");
  });

  it("字段级回退：只给介绍，头衔仍原文", () => {
    const { site } = mergeLocale(base, { 介绍: "Bio only" }, "en");
    expect(site.intro).toBe("Bio only");
    expect(site.title).toBe("独立开发者");
  });

  it("英文别名 title/intro/footer 同样认", () => {
    const { site, warnings } = mergeLocale(base, { title: "T", intro: "I", footer: "F" }, "en");
    expect(warnings).toEqual([]);
    expect(site.title).toBe("T");
    expect(site.intro).toBe("I");
    expect(site.footer).toBe("F");
  });

  it("顶层不可译 / 未知键告警（链接、foo）", () => {
    const { warnings } = mergeLocale(base, { 链接: [], foo: 1 }, "en");
    expect(warnings.join(" ")).toMatch(/链接/);
    expect(warnings.join(" ")).toMatch(/foo/);
  });

  it("顶层可译字段值不是字符串：告警回退原文", () => {
    const { site, warnings } = mergeLocale(base, { 头衔: 123 }, "en");
    expect(site.title).toBe("独立开发者");
    expect(warnings.join(" ")).toMatch(/头衔/);
    expect(warnings.join(" ")).toMatch(/文字/);
  });
});

describe("mergeLocale 作品（按原名翻译）", () => {
  it("重点与分组条目都能按名翻译 名字/介绍/出处", () => {
    const { site, warnings } = mergeLocale(
      base,
      { 作品: { 千世书: { 名字: "Thousand Lives", 介绍: "EN desc" }, 文章一: { 出处: "The Paper" } } },
      "en",
    );
    expect(warnings).toEqual([]);
    expect(site.featured[0].name).toBe("Thousand Lives");
    expect(site.featured[0].desc).toBe("EN desc");
    expect(articleItems(site)[0].via).toBe("The Paper");
  });

  it("身份键在翻译后保持不变（缩略图不丢）", () => {
    const { site } = mergeLocale(base, { 作品: { 文章一: { 名字: "Article One" } } }, "en");
    const item = articleItems(site)[0];
    expect(item.name).toBe("Article One");
    expect(item.key).toBe(articleItems(base)[0].key);
  });

  it("英文别名 works + 字段别名 name/intro/via 都认", () => {
    const { site, warnings } = mergeLocale(base, { works: { 千世书: { name: "TL", intro: "d", via: "v" } } }, "en");
    expect(warnings).toEqual([]);
    expect(site.featured[0].name).toBe("TL");
    expect(site.featured[0].desc).toBe("d");
    expect(site.featured[0].via).toBe("v");
  });

  it("只译一半：未列出的条目整条回退", () => {
    const { site } = mergeLocale(base, { 作品: { 千世书: { 介绍: "EN" } } }, "en");
    expect(articleItems(site)[0].desc).toBe("描述A");
    expect(articleItems(site)[0].name).toBe("文章一");
  });

  it("作品在主文件中找不到：告警但不抛", () => {
    const { warnings } = mergeLocale(base, { 作品: { 不存在: { 介绍: "x" } } }, "en");
    expect(warnings.join(" ")).toMatch(/不存在/);
    expect(warnings.join(" ")).toMatch(/找不到/);
  });

  it("结构性字段（链接/图/重点）写进 overlay 被拒并告警", () => {
    const { site, warnings } = mergeLocale(
      base,
      { 作品: { 千世书: { 链接: "https://evil", 图: "/x.png", 重点: false, 名字: "TL" } } },
      "en",
    );
    expect(site.featured[0].link).toBe("https://lives.example.com");
    expect(site.featured[0].image).toBeUndefined();
    expect(site.featured[0].star).toBe(true);
    expect(site.featured[0].name).toBe("TL");
    expect(warnings.join(" ")).toMatch(/链接/);
    expect(warnings.join(" ")).toMatch(/不可翻译/);
  });

  it("作品字段值不是字符串：告警回退原文", () => {
    const { site, warnings } = mergeLocale(base, { 作品: { 千世书: { 介绍: { a: 1 } } } }, "en");
    expect(site.featured[0].desc).toBe("描述");
    expect(warnings.join(" ")).toMatch(/介绍/);
    expect(warnings.join(" ")).toMatch(/文字/);
  });

  it("单条作品译文不是映射：告警回退", () => {
    const { warnings } = mergeLocale(base, { 作品: { 千世书: "EN desc" } }, "en");
    expect(warnings.join(" ")).toMatch(/千世书/);
    expect(warnings.join(" ")).toMatch(/映射/);
  });

  it("作品整体不是映射（写成列表）：告警", () => {
    const { warnings } = mergeLocale(base, { 作品: [{ 名字: "x" }] }, "en");
    expect(warnings.join(" ")).toMatch(/作品/);
    expect(warnings.join(" ")).toMatch(/映射/);
  });

  it("主文件两条作品同名：告警，翻译只作用于第一条", () => {
    const dup = normalizeSite({
      名字: "张三",
      作品: [
        { 名字: "同名", 介绍: "A", 分类: "组" },
        { 名字: "同名", 介绍: "B", 分类: "组" },
      ],
    });
    const { site, warnings } = mergeLocale(dup, { 作品: { 同名: { 介绍: "译" } } }, "en");
    const items = site.groups.flatMap((g) => g.items);
    expect(items[0].desc).toBe("译");
    expect(items[1].desc).toBe("B");
    expect(warnings.join(" ")).toMatch(/出现多次/);
  });
});

describe("mergeLocale 文字（零散原文 → 译文）", () => {
  it("命中分类名 / 数据标签 / 链接标签", () => {
    const { site, warnings } = mergeLocale(
      base,
      { 文字: { 文章: "Articles", 播客: "Podcast", 开源项目: "OSS projects", GitHub: "GH", 邮箱: "Email" } },
      "en",
    );
    expect(warnings).toEqual([]);
    expect(site.groups.map((g) => g.title)).toEqual(["Articles", "Podcast"]);
    expect(site.stats.find((s) => s.value === "30+")!.label).toBe("OSS projects");
    expect(site.links[0].label).toBe("GH");
    expect(site.links[1].label).toBe("Email");
  });

  it("英文别名 text 同样认", () => {
    const { site, warnings } = mergeLocale(base, { text: { 文章: "Articles" } }, "en");
    expect(warnings).toEqual([]);
    expect(site.groups[0].title).toBe("Articles");
  });

  it("文字里的原文在页面上找不到：告警", () => {
    const { warnings } = mergeLocale(base, { 文字: { 不存在原文: "x" } }, "en");
    expect(warnings.join(" ")).toMatch(/不存在原文/);
    expect(warnings.join(" ")).toMatch(/找不到/);
  });

  it("文字不是映射：告警", () => {
    const { warnings } = mergeLocale(base, { 文字: "x" }, "en");
    expect(warnings.join(" ")).toMatch(/文字/);
    expect(warnings.join(" ")).toMatch(/映射/);
  });
});

describe("mergeLocale 开源描述（按语言覆盖）", () => {
  const b = normalizeSite({ ...rawBase, 开源描述: { "md-translator": "中文描述", "text-diff": "只有中文" } });
  it("overlay 按仓库名覆盖 base 对应项，其余保留 base", () => {
    const { site, warnings } = mergeLocale(b, { 开源描述: { "md-translator": "EN desc" } }, "en");
    expect(site.opensourceDescriptions).toEqual({ "md-translator": "EN desc", "text-diff": "只有中文" });
    expect(warnings).toEqual([]);
  });
  it("base 无开源描述时 overlay 单独建立（英文别名也认）", () => {
    const { site } = mergeLocale(base, { opensource_descriptions: { a: "b" } }, "en");
    expect(site.opensourceDescriptions).toEqual({ a: "b" });
  });
  it("非映射 / 非字符串值：告警", () => {
    expect(mergeLocale(b, { 开源描述: "oops" }, "en").warnings.some((w) => w.includes("开源描述"))).toBe(true);
    expect(mergeLocale(b, { 开源描述: { x: 1 } }, "en").warnings.some((w) => w.includes("x"))).toBe(true);
  });
});
