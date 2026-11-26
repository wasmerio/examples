// scripts/validate-config.mjs 的冒烟测试：用真实子进程跑脚本，
// 校验退出码与人话提示，而不是只测内部函数。
// 脚本硬编码 process.cwd()/src/data，所以每个用例都造一个临时工作目录，
// 里面放好 src/data/projects.yaml，再用 spawnSync(..., { cwd }) 指过去。
import { describe, it, expect, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const SCRIPT = resolve(process.cwd(), "scripts/validate-config.mjs");

const tmpDirs = [];

function makeFixture(yamlText, extraFiles = {}) {
  const dir = mkdtempSync(join(tmpdir(), "onepage-validate-"));
  tmpDirs.push(dir);
  mkdirSync(join(dir, "src/data"), { recursive: true });
  writeFileSync(join(dir, "src/data/projects.yaml"), yamlText, "utf8");
  for (const [name, text] of Object.entries(extraFiles)) {
    writeFileSync(join(dir, "src/data", name), text, "utf8");
  }
  return dir;
}

function runValidate(cwd) {
  return spawnSync(process.execPath, [SCRIPT], { cwd, encoding: "utf8" });
}

afterEach(() => {
  while (tmpDirs.length) {
    const d = tmpDirs.pop();
    rmSync(d, { recursive: true, force: true });
  }
});

describe("scripts/validate-config.mjs 冒烟测试（真跑子进程）", () => {
  it("好 YAML：exit 0", () => {
    const dir = makeFixture("名字: 张三\n");
    const res = runValidate(dir);
    expect(res.status).toBe(0);
  });

  it("坏缩进 YAML：exit 1 且 stderr 含「格式问题」", () => {
    const dir = makeFixture("名字: x\n bad-indent: 1\n");
    const res = runValidate(dir);
    expect(res.status).toBe(1);
    expect(res.stderr).toMatch(/格式问题/);
  });

  it("网址漏协议头（网址: lisa.github.io）：exit 1 且 stderr 含「https://」", () => {
    const dir = makeFixture("网址: lisa.github.io\n名字: 张三\n");
    const res = runValidate(dir);
    expect(res.status).toBe(1);
    expect(res.stderr).toMatch(/https:\/\//);
  });

  it("坏翻译文件：exit 1（v2 没有发布集开关，翻译文件坏了就该拦）", () => {
    const dir = makeFixture(
      "名字: 张三\n",
      { "projects.en.yaml": "名字: x\n bad-indent: 1\n" },
    );
    const res = runValidate(dir);
    expect(res.status).toBe(1);
    expect(res.stderr).toMatch(/格式问题/);
  });

  it("数值字段写错：exit 1 且指名道姓（中英别名都认）", () => {
    const cases = [
      ["名字: 张三\n星标线: abc\n", /星标线/],
      ["名字: 张三\n开源上限: -1\n", /开源上限/],
      ["名字: 张三\n开源项目: abc\n", /开源项目/],
      ["名字: 张三\nstar_line: 三十\n", /星标线/],
      ["名字: 张三\nopensource_max: -1\n", /开源上限/],
    ];
    for (const [yaml, re] of cases) {
      const res = runValidate(makeFixture(yaml));
      expect(res.status, yaml).toBe(1);
      expect(res.stderr, yaml).toMatch(re);
    }
  });

  it("数值字段的合法写法不误报：exit 0", () => {
    // 开源上限 0 是文档化的合法值（只列高星组）；开源项目 接受 true/false
    const dir = makeFixture("名字: 张三\n开源项目: true\n星标线: 30\n开源上限: 0\n");
    const res = runValidate(dir);
    expect(res.status, res.stderr).toBe(0);
  });

  it("空链接 / 空数据条目：exit 1 且指名文件与序号", () => {
    const dir = makeFixture(
      "名字: 张三\n链接:\n  - '': https://x.com\n  - GitHub: ''\n数据:\n  - '': 10\n  - Stars: ''\n",
    );
    const res = runValidate(dir);
    expect(res.status).toBe(1);
    expect(res.stderr).toMatch(/链接第 1 条/);
    expect(res.stderr).toMatch(/数据第 1 条/);
  });

  it("合法链接 / 数据不误报：exit 0", () => {
    const dir = makeFixture("名字: 张三\n链接:\n  - GitHub: https://github.com/u\n数据:\n  - Stars: 10\n");
    const res = runValidate(dir);
    expect(res.status, res.stderr).toBe(0);
  });

  it("翻译文件里的链接 / 数据是被忽略的结构字段：不硬拦（exit 0）", () => {
    const dir = makeFixture("名字: 张三\n", {
      "projects.en.yaml": "文字:\n  张三: Zhang\n链接:\n  - '': https://x.com\n数据:\n  - '': 1\n",
    });
    const res = runValidate(dir);
    expect(res.status, res.stderr).toBe(0);
    expect(res.stderr).toMatch(/结构字段|文字/);
  });

  it("作品有内容但缺名字：exit 1 且指名序号", () => {
    const dir = makeFixture("名字: 张三\n作品:\n  - 介绍: 忘了名字\n");
    const res = runValidate(dir);
    expect(res.status).toBe(1);
    expect(res.stderr).toMatch(/作品第 1 条/);
  });

  it("空白作品行不硬拦：exit 0", () => {
    const dir = makeFixture("名字: 张三\n作品:\n  - {}\n");
    const res = runValidate(dir);
    expect(res.status, res.stderr).toBe(0);
  });
});
