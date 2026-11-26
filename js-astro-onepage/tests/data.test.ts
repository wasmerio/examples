import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { locales, baseSite, siteFor, thumbOf, assets, gh, repoOf, buildOpensourceItems, opensourceItems, opensourceAll, opensourceTotal } from "../src/lib/data";
import type { WorkItem } from "../src/lib/schema";

// 注意：src/lib/data.ts 在 import 时就会用 process.cwd() 读取 src/data/ 下的真实文件
// （vitest 的工作目录是仓库根），所以这里能直接拿到 baseSite / locales / assets 等真实构建产物。
// 但断言故意不依赖 demo YAML 里的具体名字/条目内容，避免 src/data/projects.yaml 一改测试就红。

// 站主的 GitHub 用户名从 baseSite.links 动态推出（不硬编码 demo 里的用户名）
const ghUser = (() => {
  for (const l of baseSite.links) {
    const m = /github\.com\/([^/?#]+)/.exec(l.url);
    if (m) return m[1];
  }
  return undefined;
})();

describe("locales", () => {
  it("locales[0] 是住在 / 的语言（主语言）", () => {
    expect(locales[0].isPrimary).toBe(true);
    expect(locales[0].href).toBe("/");
  });

  it("只有 locales[0] 住在根，其余各有自己的路径", () => {
    for (const l of locales.slice(1)) {
      expect(l.isPrimary).toBe(false);
      expect(l.href).toBe(`/${l.code}/`);
    }
  });
});

describe("siteFor", () => {
  it("siteFor(baseSite.lang) 返回 baseSite 本身（同一引用，不重新构造）", () => {
    expect(siteFor(baseSite.lang)).toBe(baseSite);
  });
});

describe("repoOf", () => {
  const mkItem = (overrides: Partial<WorkItem>): WorkItem => ({ key: "k", name: "n", ...overrides });

  it("没有 source / link → undefined", () => {
    expect(repoOf(mkItem({}))).toBeUndefined();
  });

  it("非 github 链接 → undefined", () => {
    expect(repoOf(mkItem({ link: "https://example.com/a/b" }))).toBeUndefined();
  });

  it("github 纯用户主页（无仓库段）→ undefined", () => {
    expect(repoOf(mkItem({ link: "https://github.com/someone" }))).toBeUndefined();
  });

  it("github 仓库但用户名不是站主 → undefined（不把别人的 star 挂自己名下）", () => {
    expect(repoOf(mkItem({ source: "https://github.com/some-other-user/repo" }))).toBeUndefined();
  });

  describe("站主本人的仓库命中 gh.repos", () => {
    const injectedRepo = "__test_repoof_injected_repo__";
    const injected = { stars: 42, language: null, updated: "", url: "https://x", description: null };

    beforeEach(() => {
      gh.repos[injectedRepo] = injected;
    });
    afterEach(() => {
      delete gh.repos[injectedRepo];
    });

    it("source 优先于 link，用户名匹配站主时返回注入的数据", () => {
      if (!ghUser) return; // demo 没配 github 就无从验证，跳过
      const w = mkItem({
        source: `https://github.com/${ghUser}/${injectedRepo}`,
        link: "https://demo.example.com",
      });
      expect(repoOf(w)).toBe(injected);
    });

    it("用户名大小写不敏感匹配", () => {
      if (!ghUser) return;
      const w = mkItem({ source: `https://github.com/${ghUser.toUpperCase()}/${injectedRepo}` });
      expect(repoOf(w)).toBe(injected);
    });
  });
});

describe("thumbOf", () => {
  // 最小构造的 WorkItem，不借用 demo 数据里的任何具体条目
  const mkItem = (overrides: Partial<WorkItem>): WorkItem => ({
    key: "test-item-key",
    name: "n",
    ...overrides,
  });

  it("本地 image（非 http/https 开头）直接返回，不查 assets.shots", () => {
    const item = mkItem({ image: "/img/local-thumb.png" });
    expect(thumbOf(item)).toBe("/img/local-thumb.png");
  });

  // 往 assets.shots 注入一个只在测试里存在的键值对，并给条目设置 key 和一个明显不同的 name，
  // 证明查的是 item.key 而不是按 name 算出的 slug。用完在 afterEach 清理。
  describe("按 item.key（而非 name）去 assets.shots 查", () => {
    const injectedKey = "__test_thumbof_injected_key__";
    const injectedPath = "/img/__test_thumbof_injected__.png";

    beforeEach(() => {
      assets.shots[injectedKey] = injectedPath;
    });
    afterEach(() => {
      delete assets.shots[injectedKey];
    });

    it("没有 image 时，命中的是 item.key 对应的路径，而不是按 name 算出的路径", () => {
      const item = mkItem({ key: injectedKey, name: "Totally Different Name" });
      expect(thumbOf(item)).toBe(injectedPath);
    });

    it("image 是远程 http(s) 链接时忽略它，仍按 item.key 命中注入的路径", () => {
      const item = mkItem({
        key: injectedKey,
        name: "Totally Different Name",
        image: "https://example.com/remote.png",
      });
      expect(thumbOf(item)).toBe(injectedPath);
      expect(thumbOf(item)).not.toBe(item.image);
    });
  });

  it("assets.shots 里查不到 item.key 时返回 undefined", () => {
    const item = mkItem({ key: "made-up-key-that-should-not-exist-in-assets", name: "无缩略图" });
    expect(thumbOf(item)).toBeUndefined();
  });

});

describe("buildOpensourceItems：过滤/去重/排序/映射", () => {
  const repos = {
    "high-old": { stars: 500, language: "ts", updated: "2024-06-01T00:00:00Z", url: "https://github.com/u/high-old", description: "d1", homepage: "https://demo1.com", fork: false, archived: false, created: "2024-01-01T00:00:00Z" },
    "low-old": { stars: 2, language: "ts", updated: "", url: "https://github.com/u/low-old", description: "d2", homepage: null, fork: false, archived: false, created: "2024-01-01T00:00:00Z" },
    "low-new": { stars: 1, language: "ts", updated: "2026-07-01T00:00:00Z", url: "https://github.com/u/low-new", description: "d3", homepage: "https://demo3.com", fork: false, archived: false, created: "2026-05-01T00:00:00Z" },
    "high-mid": { stars: 100, language: "ts", updated: "2026-08-01T00:00:00Z", url: "https://github.com/u/high-mid", description: "d7", homepage: null, fork: false, archived: false, created: "2024-01-01T00:00:00Z" },
    "low-mid": { stars: 5, language: "ts", updated: "2026-04-01T00:00:00Z", url: "https://github.com/u/low-mid", description: "d8", homepage: null, fork: false, archived: false, created: "2026-04-01T00:00:00Z" },
    "a-fork": { stars: 999, language: "ts", updated: "", url: "https://github.com/u/a-fork", description: "d4", homepage: null, fork: true, archived: false, created: "2026-05-01T00:00:00Z" },
    "archived-x": { stars: 999, language: "ts", updated: "", url: "https://github.com/u/archived-x", description: "d5", homepage: null, fork: false, archived: true, created: "2026-05-01T00:00:00Z" },
    "featured-repo": { stars: 800, language: "ts", updated: "", url: "https://github.com/u/featured-repo", description: "d6", homepage: null, fork: false, archived: false, created: "2024-01-01T00:00:00Z" },
  };
  const site = {
    featured: [{ key: "f", name: "F", source: "https://github.com/u/featured-repo" }],
    groups: [],
    opensource: 10,
    opensourceSince: "2026-03",
  } as any;

  it("阈值+日期+fork/归档+去重 综合", () => {
    const items = buildOpensourceItems(repos as any, site, "u");
    const names = items.map((i) => i.name);
    expect(names).toContain("high-old"); // ≥10
    expect(names).toContain("low-new"); // <10 但 created≥since
    expect(names).not.toContain("low-old"); // <10 且早于 since
    expect(names).not.toContain("a-fork"); // fork
    expect(names).not.toContain("archived-x"); // 归档
    expect(names).not.toContain("featured-repo"); // 已在 featured，去重
    // 混合排序：高星组（>50）整体在低星组前
    expect(names.indexOf("high-old")).toBeLessThan(names.indexOf("low-new"));
    expect(names.indexOf("high-mid")).toBeLessThan(names.indexOf("low-new"));
    // 高星组内按 star 降序：high-old(500) 在 high-mid(100) 前（尽管 high-mid 更近修改）
    expect(names.indexOf("high-old")).toBeLessThan(names.indexOf("high-mid"));
    // 低星组内按最近修改降序：low-new(2026-07) 在 low-mid(2026-04) 前
    expect(names.indexOf("low-new")).toBeLessThan(names.indexOf("low-mid"));
    // 映射：homepage→link、url→source、description→desc
    const hi = items.find((i) => i.name === "high-old")!;
    expect(hi.link).toBe("https://demo1.com");
    expect(hi.source).toBe("https://github.com/u/high-old");
    expect(hi.desc).toBe("d1");
  });
  it("opensource 未设 → 空数组", () => {
    expect(buildOpensourceItems(repos as any, { ...site, opensource: undefined } as any, "u")).toEqual([]);
  });
  it("无 since → 纯按 star 阈值（low-new 被排除）", () => {
    const items = buildOpensourceItems(repos as any, { ...site, opensourceSince: undefined } as any, "u");
    expect(items.map((i) => i.name)).not.toContain("low-new");
  });
  it("星标线可配：调高到 200，high-mid(100) 落入低星组按更新排", () => {
    const names = buildOpensourceItems(repos as any, { ...site, starLine: 200 } as any, "u").map((i) => i.name);
    expect(names.indexOf("high-old")).toBeLessThan(names.indexOf("high-mid")); // high-old(500)>200 仍置顶
    expect(names.indexOf("high-mid")).toBeLessThan(names.indexOf("low-new")); // high-mid(100)≤200 进低星组，更新最新排前
  });
  it("开源命名映射：改 name 不改 key（缩略图键仍原 repo 名），大小写不敏感", () => {
    const items = buildOpensourceItems(repos as any, { ...site, opensourceNames: { "HIGH-OLD": "高星老项目" } } as any, "u");
    const hi = items.find((i) => i.key === "high-old")!;
    expect(hi.name).toBe("高星老项目"); // 映射生效（键大小写不敏感）
    expect(hi.key).toBe("high-old"); // key 不变，缩略图/身份仍按原 repo
    expect(items.find((i) => i.key === "low-new")!.name).toBe("low-new"); // 未映射的用原名
  });
  it("开源排除：列表里的仓库不进开源节，大小写不敏感", () => {
    const names = buildOpensourceItems(repos as any, { ...site, opensourceExclude: ["HIGH-OLD"] } as any, "u").map((i) => i.key);
    expect(names).not.toContain("high-old"); // 被排除（大小写不敏感）
    expect(names).toContain("high-mid"); // 其余照常
  });
  it("开源上限只削尾巴：max=1 时高星组仍全显，只砍低星尾巴的末位", () => {
    const names = buildOpensourceItems(repos as any, site, "u", 1).map((i) => i.name);
    expect(names).toContain("high-old"); // 高星组不受 max 影响
    expect(names).toContain("high-mid");
    expect(names).toContain("low-new"); // 尾巴按最近更新取前 1（low-new 2026-07 排在 low-mid 前）
    expect(names).not.toContain("low-mid");
  });
  it("开源上限向上对齐到网格列数（3 列网格，末行不留残缺）", () => {
    // 高星组 2（star>30）+ 尾巴 4 = 6 个候选；site 没写 starLine，走默认 30
    const r = {
      h1: { stars: 500, updated: "", url: "https://github.com/u/h1", fork: false, archived: false, created: "2024-01-01T00:00:00Z" },
      h2: { stars: 100, updated: "", url: "https://github.com/u/h2", fork: false, archived: false, created: "2024-01-01T00:00:00Z" },
      t1: { stars: 1, updated: "2026-06-01T00:00:00Z", url: "https://github.com/u/t1", fork: false, archived: false, created: "2026-05-01T00:00:00Z" },
      t2: { stars: 1, updated: "2026-05-01T00:00:00Z", url: "https://github.com/u/t2", fork: false, archived: false, created: "2026-05-01T00:00:00Z" },
      t3: { stars: 1, updated: "2026-04-01T00:00:00Z", url: "https://github.com/u/t3", fork: false, archived: false, created: "2026-05-01T00:00:00Z" },
      t4: { stars: 1, updated: "2026-03-01T00:00:00Z", url: "https://github.com/u/t4", fork: false, archived: false, created: "2026-05-01T00:00:00Z" },
    };
    expect(buildOpensourceItems(r as any, site, "u", 2).length).toBe(6); // 2+2=4 → 向上补到 6
    expect(buildOpensourceItems(r as any, site, "u", 1).length).toBe(3); // 2+1=3 已整除，不补
    expect(buildOpensourceItems(r as any, site, "u", 0).length).toBe(2); // 只要高星组，不补
  });
  it("不传 max → 全部列出（与加 max 之前的行为一致）", () => {
    const names = buildOpensourceItems(repos as any, site, "u").map((i) => i.name);
    expect(names).toContain("low-mid");
  });
});

describe("opensourceItems / opensourceTotal（真实 demo 配置）", () => {
  it("展示列表是完整候选列表的前缀（截断只从尾巴切，不会重排）", () => {
    const shown = opensourceItems.map((i) => i.key);
    expect(opensourceAll.slice(0, shown.length).map((i) => i.key)).toEqual(shown);
  });

  it("候选里所有高星项（star > 星标线）都进了展示列表", () => {
    const starLine = baseSite.starLine ?? 30;
    const highKeys = opensourceAll
      .filter((i) => (repoOf(i)?.stars ?? 0) > starLine)
      .map((i) => i.key);
    const shown = new Set(opensourceItems.map((i) => i.key));
    for (const k of highKeys) expect(shown.has(k)).toBe(true);
  });

  it("opensourceTotal 等于完整候选数", () => {
    expect(opensourceTotal).toBe(opensourceAll.length);
  });
});
