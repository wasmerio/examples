import { describe, it, expect } from "vitest";
import { emptyConfig, emptyWork } from "../src/edit/types";
import {
  hasLinkContent,
  hasStatContent,
  hasWorkContent,
  incompleteEntries,
} from "../src/edit/issues";

const base = () => {
  const c = emptyConfig();
  c.name = "A";
  return c;
};

describe("incompleteEntries：只拦半填条目", () => {
  it("空配置没有任何条目问题（顶层名字由 schema 管）", () => {
    expect(incompleteEntries(emptyConfig())).toEqual([]);
  });

  it("链接只填网址 → 缺标签；只填标签 → 缺网址；空行不报", () => {
    const c = base();
    c.links = [
      { label: "", url: "https://example.com" },
      { label: "GitHub", url: "" },
      { label: "", url: "" },
      { label: "GitHub", url: "https://github.com/u" },
    ];
    expect(incompleteEntries(c)).toEqual([
      { kind: "link", index: 0, missing: ["label"] },
      { kind: "link", index: 1, missing: ["url"] },
    ]);
  });

  it("作品有内容但缺名字 → 报；全空行不报；只有重点也报", () => {
    const c = base();
    c.works = [
      { ...emptyWork(), desc: "忘了名字" },
      emptyWork(),
      { ...emptyWork(), star: true },
      { ...emptyWork(), name: "完整" },
    ];
    expect(incompleteEntries(c)).toEqual([
      { kind: "work", index: 0, missing: ["name"] },
      { kind: "work", index: 2, missing: ["name"] },
    ]);
  });

  it("数据只填一边 → 报；空行不报；数字 0 算有值", () => {
    const c = base();
    c.stats = [
      { label: "只有标签", value: "" },
      { label: "", value: "只有值" },
      { label: "", value: "" },
      { label: "零", value: 0 },
    ];
    expect(incompleteEntries(c)).toEqual([
      { kind: "stat", index: 0, missing: ["value"] },
      { kind: "stat", index: 1, missing: ["label"] },
    ]);
  });

  it("三类条目同时半填时按 links → works → stats 顺序列出", () => {
    const c = base();
    c.links = [{ label: "", url: "https://x.com" }];
    c.works = [{ ...emptyWork(), desc: "d" }];
    c.stats = [{ label: "S", value: "" }];
    expect(incompleteEntries(c).map((i) => `${i.kind}:${i.index}`)).toEqual([
      "link:0",
      "work:0",
      "stat:0",
    ]);
  });
});

describe("hasXContent：空行与有内容的分界", () => {
  it("链接/作品/数据", () => {
    expect(hasLinkContent({ label: "", url: "" })).toBe(false);
    expect(hasLinkContent({ label: " ", url: "" })).toBe(false);
    expect(hasLinkContent({ label: "", url: "https://x.com" })).toBe(true);
    expect(hasWorkContent(emptyWork())).toBe(false);
    expect(hasWorkContent({ ...emptyWork(), desc: "d" })).toBe(true);
    expect(hasWorkContent({ ...emptyWork(), star: true })).toBe(true);
    expect(hasStatContent({ label: "", value: "" })).toBe(false);
    expect(hasStatContent({ label: "", value: 0 })).toBe(true);
    expect(hasStatContent({ label: "S", value: "" })).toBe(true);
  });
});
