import { describe, it, expect } from "vitest";
import { localeFromFilename, buildLocales } from "../src/lib/locales";

describe("localeFromFilename", () => {
  it("认出合法语言码", () => {
    expect(localeFromFilename("projects.en.yaml")).toBe("en");
    expect(localeFromFilename("projects.zh-TW.yaml")).toBe("zh-TW");
    expect(localeFromFilename("projects.pt-BR.yaml")).toBe("pt-BR");
  });

  it("主文件与误留文件不算语言", () => {
    expect(localeFromFilename("projects.yaml")).toBeNull();
    expect(localeFromFilename("projects.backup.yaml")).toBeNull();
    expect(localeFromFilename("projects.en.example.yaml")).toBeNull();
    expect(localeFromFilename("projects.en.yml")).toBeNull();
    expect(localeFromFilename("assets.json")).toBeNull();
  });
});

describe("buildLocales（文件名即配置：按文件名自动发现）", () => {
  it("单语：只有主语言，href 是根", () => {
    const { locales, warnings } = buildLocales(["projects.yaml", "assets.json"], "zh-CN");
    expect(locales).toEqual([{ code: "zh-CN", isPrimary: true, href: "/" }]);
    expect(warnings).toEqual([]);
  });

  it("多语：主语言在前，其余按码排序", () => {
    const { locales, warnings } = buildLocales(
      ["projects.yaml", "projects.ja.yaml", "projects.en.yaml", "projects.backup.yaml"],
      "zh-CN",
    );
    expect(locales).toEqual([
      { code: "zh-CN", isPrimary: true, href: "/" },
      { code: "en", isPrimary: false, href: "/en/" },
      { code: "ja", isPrimary: false, href: "/ja/" },
    ]);
    expect(warnings).toEqual([]);
  });

  it("与主语言同码的文件被忽略，不会出现两个 zh-CN", () => {
    const { locales } = buildLocales(["projects.yaml", "projects.zh-CN.yaml"], "zh-CN");
    expect(locales).toHaveLength(1);
    expect(locales[0].code).toBe("zh-CN");
  });

  it("与主语言同码但大小写不同的文件也要被忽略，不产出影子语言", () => {
    const { locales } = buildLocales(["projects.yaml", "projects.zh-cn.yaml"], "zh-CN");
    expect(locales).toHaveLength(1);
    expect(locales[0].code).toBe("zh-CN");
  });

  it("多个覆盖文件互相只是次级子标签大小写不同时，也只算一种语言", () => {
    // 主语言主标签必须小写（LANG_RE），大小写碰撞只会发生在次级子标签（地区码）上
    const { locales } = buildLocales(
      ["projects.yaml", "projects.zh-CN.yaml", "projects.zh-cn.yaml"],
      "en",
    );
    expect(locales).toHaveLength(2);
    // 保留文件名里先出现的原始写法，不规整成小写
    expect(locales[1].code).toBe("zh-CN");
    expect(locales[1].href).toBe("/zh-CN/");
  });
});
