import { describe, it, expect } from "vitest";
import { emptyConfig, emptyWork, type EditConfig } from "../src/edit/types";
import {
  DRAFT_KEY,
  clearDraft,
  hasAnyContent,
  parseDraft,
  readDraft,
  serializeDraft,
  writeDraft,
} from "../src/edit/draft";

const memoryStore = () => {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
    size: () => map.size,
  };
};

const sample = (): EditConfig => {
  const c = emptyConfig();
  c.name = "A";
  c.title = "T";
  c.links = [{ label: "", url: "https://x.com" }]; // 半填也要能恢复，供回来继续补
  c.works = [{ ...emptyWork(), desc: "还没写名字" }];
  c.stats = [{ label: "S", value: 0 }];
  c.opensourceNames = { repo: "显示名" };
  c.opensourceExclude = ["other/repo"];
  return c;
};

describe("编辑器草稿：序列化 / 解析", () => {
  it("往返保留未完成条目与进阶字段", () => {
    const c = sample();
    expect(parseDraft(serializeDraft(c))).toEqual(c);
  });

  it("坏 JSON、版本不符、非对象、缺 config → null", () => {
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft("{oops")).toBeNull();
    expect(parseDraft(JSON.stringify({ v: 2, config: { name: "A" } }))).toBeNull();
    expect(parseDraft(JSON.stringify({ v: 1, config: [] }))).toBeNull();
    expect(parseDraft(JSON.stringify({ v: 1 }))).toBeNull();
  });

  it("数组缺失或坏形状 → 空数组，不让 UI map 崩", () => {
    const c = parseDraft(JSON.stringify({ v: 1, config: { name: "A", links: "bad", works: [null, 3], stats: [{}] } }));
    expect(c).not.toBeNull();
    expect(c!.name).toBe("A");
    expect(c!.links).toEqual([]);
    expect(c!.works).toEqual([]);
    expect(c!.stats).toEqual([{ label: "", value: "" }]);
  });
});

describe("编辑器草稿：本机存取", () => {
  it("空配置不算草稿；write 会移除旧键", () => {
    const store = memoryStore();
    store.setItem(DRAFT_KEY, "old");
    writeDraft(emptyConfig(), store);
    expect(store.size()).toBe(0);
    expect(readDraft(store)).toBeNull();
  });

  it("write → read 同一份配置；clear 后为空", () => {
    const store = memoryStore();
    const c = sample();
    writeDraft(c, store);
    expect(readDraft(store)).toEqual(c);
    clearDraft(store);
    expect(readDraft(store)).toBeNull();
  });

  it("读到坏数据时清理键并返回 null", () => {
    const store = memoryStore();
    store.setItem(DRAFT_KEY, "not-json");
    expect(readDraft(store)).toBeNull();
    expect(store.size()).toBe(0);
  });

  it("hasAnyContent：空表单 false，任何一项非空 true", () => {
    expect(hasAnyContent(emptyConfig())).toBe(false);
    const c = emptyConfig();
    c.title = "T";
    expect(hasAnyContent(c)).toBe(true);
    const d = emptyConfig();
    d.stats = [{ label: "", value: "" }];
    expect(hasAnyContent(d)).toBe(true); // 空行也是用户显式加过的，恢复它比悄悄丢好
  });
});
