import { describe, it, expect } from "vitest";
import { parseOgImage, extFromContentType, ghUserFrom, slugify } from "../scripts/helpers.mjs";
import { repoFromUrl, fixUrl, loadConfig, TOP_ALIAS, WORK_ALIAS, LANG_NAME_ALIAS } from "../scripts/helpers.mjs";
import { repoNamesFrom } from "../scripts/helpers.mjs";
import { selectOpensourceRepos } from "../scripts/helpers.mjs";
import { fetchShotsWithRetry, SHOT_COOLDOWN_MS } from "../scripts/helpers.mjs";
import { slugify as schemaSlugify } from "../src/lib/schema";

describe("repoFromUrl", () => {
  it("仓库形状解析、纯主页/非 github 为 null", () => {
    expect(repoFromUrl("https://github.com/a/b")).toEqual({ owner: "a", repo: "b" });
    expect(repoFromUrl("https://github.com/a/b/tree/main/x")).toEqual({ owner: "a", repo: "b" });
    expect(repoFromUrl("https://github.com/a")).toBeNull();
    expect(repoFromUrl("https://example.com/a/b")).toBeNull();
    expect(repoFromUrl(undefined)).toBeNull();
  });
});

describe("fixUrl 零配置纠错", () => {
  it("裸邮箱补 mailto:、裸域名补 https://、其余原样", () => {
    expect(fixUrl("hi@example.com")).toBe("mailto:hi@example.com");
    expect(fixUrl("example.com")).toBe("https://example.com");
    expect(fixUrl("example.com/page")).toBe("https://example.com/page");
    expect(fixUrl("https://a.com")).toBe("https://a.com");
    expect(fixUrl("mailto:a@b.c")).toBe("mailto:a@b.c");
    expect(fixUrl("/resume.pdf")).toBe("/resume.pdf"); // 站内路径不动
  });
});

describe("repoNamesFrom：排除名单既收裸仓库名也收完整 GitHub 网址", () => {
  it("网址剥出仓库名；裸名原样；混着写也行", () => {
    expect(repoNamesFrom(["js-opencc", "https://github.com/rockbenben/docs-tools-by-ai"])).toEqual([
      "js-opencc",
      "docs-tools-by-ai",
    ]);
    expect(repoNamesFrom(["https://github.com/u/r/tree/main/x"])).toEqual(["r"]); // 深链按仓库取
    expect(repoNamesFrom([" https://github.com/u/r.git "])).toEqual(["r"]); // 空格/ .git 都吃掉
  });
  it("空串/空白/非字符串丢掉，非数组当空", () => {
    expect(repoNamesFrom(["", "   ", 42, null, "ok"])).toEqual(["ok"]);
    expect(repoNamesFrom(undefined)).toEqual([]);
    expect(repoNamesFrom("js-opencc")).toEqual([]); // 写错形状 → 空，告警交给调用方
  });
  it("回归：不归一时 URL 会静默匹配不上（这正是要归一的原因）", () => {
    // 直接当字面仓库名去比对 selectOpensourceRepos 的 key → 永远排除不掉
    const repos = { "js-opencc": { stars: 5, updated: "", created: "2020-01-01", url: "", description: null, fork: false, archived: false } };
    const opts = { usedRepos: new Set(), threshold: 1, align: 1 };
    expect(selectOpensourceRepos(repos, opts).map(([n]) => n)).toEqual(["js-opencc"]);
    expect(selectOpensourceRepos(repos, { ...opts, exclude: new Set(repoNamesFrom(["https://github.com/u/js-opencc"])) })).toEqual([]);
  });
});

describe("别名表", () => {
  it("中英双认指向同一内部键", () => {
    expect(TOP_ALIAS["名字"]).toBe("name");
    expect(TOP_ALIAS.name).toBe("name");
    expect(WORK_ALIAS["重点"]).toBe("star");
    expect(WORK_ALIAS.star).toBe("star");
    expect(LANG_NAME_ALIAS["中文"]).toBe("zh-CN");
  });
});

describe("parseOgImage", () => {
  it("解析 property 在前", () => {
    expect(parseOgImage(`<meta property="og:image" content="https://a.com/x.png">`))
      .toBe("https://a.com/x.png");
  });
  it("解析 content 在前 / name= / 单引号", () => {
    expect(parseOgImage(`<meta content='/y.jpg' name='og:image'/>`)).toBe("/y.jpg");
  });
  it("无标签返回 null", () => {
    expect(parseOgImage("<html><head></head></html>")).toBeNull();
  });
  it("解析无引号的压缩属性（Docusaurus 等构建产物）", () => {
    expect(
      parseOgImage(`<meta data-rh=true property=og:image content=https://a.com/social-card.png />`),
    ).toBe("https://a.com/social-card.png");
    // og:image:width 不能被误当成 og:image
    expect(parseOgImage(`<meta property=og:image:width content=1280 />`)).toBeNull();
  });
  it("反转义 HTML 实体（GitHub 预签名 Social preview 的 &amp; 不还原会 401）", () => {
    expect(
      parseOgImage(
        `<meta property="og:image" content="https://repository-images.githubusercontent.com/1/x?X-Amz-Expires=300&amp;X-Amz-Signature=abc&amp;jwt=ey.z" />`,
      ),
    ).toBe("https://repository-images.githubusercontent.com/1/x?X-Amz-Expires=300&X-Amz-Signature=abc&jwt=ey.z");
  });
});

describe("extFromContentType", () => {
  it("常见类型映射，未知/svg 回退 .png（svg 不在自动下载白名单内）", () => {
    expect(extFromContentType("image/jpeg")).toBe(".jpg");
    expect(extFromContentType("image/webp")).toBe(".webp");
    expect(extFromContentType("image/svg+xml")).toBe(".png");
    expect(extFromContentType("image/whatever")).toBe(".png");
  });
});

describe("ghUserFrom", () => {
  it("从主页 URL 提取用户名", () => {
    expect(ghUserFrom("https://github.com/rockbenben")).toBe("rockbenben");
    expect(ghUserFrom(undefined)).toBeNull();
  });
});

describe("slugify", () => {
  it("空格标点转连字符、保留中文、小写", () => {
    expect(slugify("My Great Essay!")).toBe("my-great-essay");
    expect(slugify("千世书 Thousand Lives")).toBe("千世书-thousand-lives");
  });

  it("与 src/lib/schema.ts 的 slugify 输出一致（防两份实现漂移）", () => {
    const samples = ["My Great Essay!", "千世书 Thousand Lives", "  --Edge--Case!! ", "A_B.C/D", "中文123abc"];
    for (const s of samples) expect(slugify(s)).toBe(schemaSlugify(s));
  });
});

describe("loadConfig：统一走 CORE_SCHEMA", () => {
  it("无引号日期解析成字符串，不吞成 JS Date", () => {
    const doc = loadConfig("日期: 2026-05-01");
    expect(doc.日期).toBe("2026-05-01");
    expect(doc.日期).not.toBeInstanceOf(Date);
  });
});

describe("selectOpensourceRepos：max 只削尾巴，高星组永远全显", () => {
  const repo = (stars, updated) => ({
    stars,
    updated,
    created: "2020-01-01T00:00:00Z",
    language: null,
    url: "https://github.com/u/r",
    description: null,
    fork: false,
    archived: false,
  });
  const repos = {
    "hi-a": repo(100, "2020-01-01T00:00:00Z"),
    "hi-b": repo(30, "2021-01-01T00:00:00Z"),
    // 正好等于星标线 → 属于尾巴（判定是严格大于）
    edge: repo(20, "2026-03-01T00:00:00Z"),
    "tail-a": repo(5, "2026-02-01T00:00:00Z"),
    "tail-b": repo(2, "2026-01-01T00:00:00Z"),
  };
  // align: 1 = 关闭「向上补到 3 的倍数」，让这组用例只测 max 的截断语义（对齐行为另有专组）
  const base = { usedRepos: new Set(), threshold: 1, starLine: 20, align: 1 };
  const names = (opts) => selectOpensourceRepos(repos, { ...base, ...opts }).map(([n]) => n);

  it("不传 max → 全部，且高星组在前、尾巴按最近更新降序", () => {
    expect(names({})).toEqual(["hi-a", "hi-b", "edge", "tail-a", "tail-b"]);
  });

  it("max 只截尾巴：高星组全显 + 尾巴前 max 个", () => {
    expect(names({ max: 2 })).toEqual(["hi-a", "hi-b", "edge", "tail-a"]);
  });

  it("max 小于高星组个数也不会砍到高星（回归：旧的「总共显示几个」语义会砍掉 hi-b）", () => {
    expect(names({ max: 1 })).toEqual(["hi-a", "hi-b", "edge"]);
  });

  it("max: 0 → 只留高星组（尾巴一个不列），不是「不限」", () => {
    expect(names({ max: 0 })).toEqual(["hi-a", "hi-b"]);
  });

  it("max 大于总数 → 等同于全部", () => {
    expect(names({ max: 99 })).toEqual(["hi-a", "hi-b", "edge", "tail-a", "tail-b"]);
  });

  it("高星线之上没有仓库时，max 退化成普通的「取前 max 个」", () => {
    const onlyTail = { "t1": repo(5, "2026-03-01T00:00:00Z"), "t2": repo(4, "2026-02-01T00:00:00Z") };
    expect(selectOpensourceRepos(onlyTail, { ...base, max: 1 }).map(([n]) => n)).toEqual(["t1"]);
  });

  it("不传 starLine → 用默认 30（31★ 算高星、30★ 落尾巴）", () => {
    const r = { a: repo(31, "2020-01-01T00:00:00Z"), b: repo(30, "2021-01-01T00:00:00Z") };
    // max: 0 → 只列高星组。若默认退回 20，b(30★) 也会算高星 → 结果会多出 "b"
    expect(selectOpensourceRepos(r, { usedRepos: new Set(), threshold: 1, max: 0 }).map(([n]) => n)).toEqual(["a"]);
  });
});

describe("selectOpensourceRepos：总数向上对齐到 3 的倍数（凑满网格末行）", () => {
  const repo = (stars, updated) => ({
    stars,
    updated,
    created: "2020-01-01T00:00:00Z",
    language: null,
    url: "https://github.com/u/r",
    description: null,
    fork: false,
    archived: false,
  });
  // 高星组 2（star > 20）+ 尾巴 5，共 7 个候选
  const repos = {
    h1: repo(100, "2020-01-01T00:00:00Z"),
    h2: repo(50, "2020-02-01T00:00:00Z"),
    t1: repo(5, "2026-05-01T00:00:00Z"),
    t2: repo(4, "2026-04-01T00:00:00Z"),
    t3: repo(3, "2026-03-01T00:00:00Z"),
    t4: repo(2, "2026-02-01T00:00:00Z"),
    t5: repo(1, "2026-01-01T00:00:00Z"),
  };
  const opts = { usedRepos: new Set(), threshold: 1, starLine: 20 };
  const names = (o) => selectOpensourceRepos(repos, { ...opts, ...o }).map(([n]) => n);

  it("默认 align=3：2 高星 + 上限 2 = 4，向上补到 6", () => {
    expect(names({ max: 2 })).toEqual(["h1", "h2", "t1", "t2", "t3", "t4"]);
  });

  it("已经整除就不补：2 高星 + 上限 1 = 3 → 3", () => {
    expect(names({ max: 1 })).toEqual(["h1", "h2", "t1"]);
  });

  it("候选不够时按实际数量，不凭空造卡：2 高星 + 上限 5 = 7（补到 9 也只有 7）", () => {
    expect(names({ max: 5 })).toEqual(["h1", "h2", "t1", "t2", "t3", "t4", "t5"]);
  });

  it("align: 1 关闭对齐：2 高星 + 上限 2 = 4，不补", () => {
    expect(names({ max: 2, align: 1 })).toEqual(["h1", "h2", "t1", "t2"]);
  });

  it("max: 0（只要高星组）不补——那是明确的「不要尾巴」", () => {
    expect(names({ max: 0 })).toEqual(["h1", "h2"]);
  });

  it("不传 max（不限）不对齐，原样全列", () => {
    expect(names({})).toEqual(["h1", "h2", "t1", "t2", "t3", "t4", "t5"]);
  });
});

describe("selectOpensourceRepos：「最近更新」用最后人工提交，不被 bot/CI 顶上去", () => {
  // 实测过的形状：pushed_at 被 bot 提交或删分支顶到今天，最后人工提交其实早得多
  const repo = (stars, updated, humanUpdated) => ({
    stars,
    updated,
    ...(humanUpdated !== undefined && { humanUpdated }),
    created: "2020-01-01T00:00:00Z",
    language: null,
    url: "https://github.com/u/r",
    description: null,
    fork: false,
    archived: false,
  });
  const repos = {
    // CI 天天推，最后人工提交停在 9 月
    "bot-fresh": repo(5, "2026-10-19T00:00:00Z", "2026-09-01T00:00:00Z"),
    // 正常维护，最近真的有活
    "human-fresh": repo(4, "2026-10-02T00:00:00Z", "2026-10-18T00:00:00Z"),
    hi: repo(100, "2020-01-01T00:00:00Z", "2020-01-01T00:00:00Z"), // 高星组不受影响
  };
  const opts = { usedRepos: new Set(), threshold: 1, starLine: 20 };
  const names = (o) => selectOpensourceRepos(repos, { ...opts, ...o }).map(([n]) => n);

  it("按 humanUpdated 排：bot 天天推的仓库不再霸占第一位", () => {
    expect(names({})).toEqual(["hi", "human-fresh", "bot-fresh"]);
  });

  it("没有 humanUpdated 时回落 pushed_at，行为与改动前完全一致", () => {
    const plain = { "bot-fresh": repo(5, "2026-10-19T00:00:00Z"), "human-fresh": repo(4, "2026-10-02T00:00:00Z"), hi: repo(100, "2020-01-01T00:00:00Z") };
    expect(selectOpensourceRepos(plain, opts).map(([n]) => n)).toEqual(["hi", "bot-fresh", "human-fresh"]);
  });

  it("部分仓库缺 humanUpdated（个别查询失败）时不崩：缺的按 pushed_at 补位，可能排到人工日期更早的仓库前面", () => {
    // 这是回落口径的已知代价，也是「整片缺失时行为与改动前一致」的另一种写法：
    // 拿不到人工日期的仓库仍可能被 CI 顶上去，只是不会连累其他仓库。
    const partial = { ...repos, "human-fresh": repo(4, "2026-10-02T00:00:00Z") };
    expect(selectOpensourceRepos(partial, opts).map(([n]) => n)).toEqual(["hi", "human-fresh", "bot-fresh"]);
  });
});

describe("fetchShotsWithRetry：挨限流的图攒起来，冷却后整批补抓一次", () => {
  const items = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];
  const noSleep = () => Promise.resolve();
  const ok = async ({ slug }) => `/shots/${slug}.webp`;

  it("全部首轮成功 → 一次都不冷却", async () => {
    let slept = 0;
    const r = await fetchShotsWithRetry(items, { grab: ok, sleep: () => { slept++; return noSleep(); } });
    expect(r).toEqual({
      shots: { a: "/shots/a.webp", b: "/shots/b.webp", c: "/shots/c.webp" },
      lost: [],
    });
    expect(slept).toBe(0);
  });

  it("一项 429 不拖累同批：只补抓失败那张、整批只冷却一次", async () => {
    const tries = {};
    const slept = [];
    const { shots, lost } = await fetchShotsWithRetry(items, {
      grab: async ({ slug }) => {
        tries[slug] = (tries[slug] ?? 0) + 1;
        if (slug === "b" && tries[slug] === 1) throw new Error("HTTP 429");
        return `/shots/${slug}.webp`;
      },
      sleep: (ms) => { slept.push(ms); return noSleep(); },
    });
    expect(lost).toEqual([]);
    expect(shots).toEqual({ a: "/shots/a.webp", b: "/shots/b.webp", c: "/shots/c.webp" });
    expect(slept).toEqual([SHOT_COOLDOWN_MS]);
    expect(tries).toEqual({ a: 1, b: 2, c: 1 });
  });

  it("两轮都失败才记为缺失，带最后一次的错误", async () => {
    let n = 0;
    const { shots, lost } = await fetchShotsWithRetry([{ slug: "b" }], {
      grab: async () => { n++; throw new Error(`HTTP 429 第${n}次`); },
      sleep: noSleep,
    });
    expect(shots).toEqual({});
    expect(lost).toEqual([{ slug: "b", message: "HTTP 429 第2次" }]);
    expect(n).toBe(2);
  });

  it("grab 返回 null 是「这条不需要图」（本地图），既不算缺失也不触发冷却", async () => {
    let slept = 0;
    const { shots, lost } = await fetchShotsWithRetry([{ slug: "local" }], {
      grab: async () => null,
      sleep: () => { slept++; return noSleep(); },
    });
    expect({ shots, lost }).toEqual({ shots: {}, lost: [] });
    expect(slept).toBe(0);
  });

  it("onRetry 拿到失败数与冷却时长，供日志打进度", async () => {
    const seen = [];
    await fetchShotsWithRetry(items, {
      grab: async ({ slug }) => { if (slug === "a") return "/shots/a.webp"; throw new Error("x"); },
      sleep: noSleep,
      onRetry: (n, ms) => seen.push([n, ms]),
    });
    expect(seen).toEqual([[2, SHOT_COOLDOWN_MS]]);
  });
});
