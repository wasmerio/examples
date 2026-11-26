// onepage 排版台：工作台顶栏 + 两栏（左「稿」表单 / 右「校样」YAML）。
// 只在 /edit 加载；正式主页零 JS。校验复用构建的 normalizeSite。
// schema v2 形态：表单四组（你 / 链接 / 作品 / 更多设置），拍平镜像 v2 字段。
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import yaml from "js-yaml";
import { normalizeSite } from "../lib/schema";
import type { EditConfig } from "./types";
import { emptyWork } from "./types";
import { configToYaml } from "./serialize";
import { yamlToConfig, emptyConfig } from "./importer";
import { detectResidue, type ResidueKind } from "./residue";
import { hasLinkContent, hasStatContent, hasWorkContent, incompleteEntries } from "./issues";
import { readDraft, writeDraft, clearDraft, hasAnyContent } from "./draft";
import { Group, RowControls, Text, Area, Check, Select } from "./inputs";
import { EDITOR_STRINGS, resolveEditorLang, type EditorLang, type EditorUI } from "./ui";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

// URL.canParse 在旧浏览器不存在，直接调用会白屏崩溃；try/catch 更兼容，
// 与 scripts/validate-config.mjs 同款语义。
function isHttpUrl(u: string): boolean {
  try {
    const p = new URL(u).protocol;
    return p === "http:" || p === "https:";
  } catch {
    return false;
  }
}

const LANG_KEY = "onepage-editor-lang";

// 残留 finding 的文案由 kind 映射到当前语言
const RESIDUE_TEXT: Record<ResidueKind, (t: EditorUI) => string> = {
  github: (t) => t.residueGithub,
  url: (t) => t.residueUrl,
  name: (t) => t.residueName,
  footer: (t) => t.residueFooter,
  enYaml: (t) => t.residueEnYaml,
};

// 列表增删移的纯函数：返回新数组，配 update 用
function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

// 新条目追加在列表末尾；长列表里它可能落在视口外。添加后把它滚进来并聚焦第一格，
// 否则用户只看到计数 +1，却找不到新行。
function focusNewEntry(group: "links" | "works" | "stats") {
  setTimeout(() => {
    const section = document.querySelector(`[data-edit-group="${group}"]`);
    const entries = section?.querySelectorAll<HTMLElement>("[data-entry]");
    const entry = entries?.[entries.length - 1];
    const field = entry?.querySelector<HTMLElement>("input, textarea, select");
    if (!entry || !field) return;
    const rect = entry.getBoundingClientRect();
    // 吸顶栏高度随屏宽换行变化，不能写死；以它的实际底边为安全区上沿。
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    if (rect.top < headerBottom || rect.bottom > window.innerHeight) {
      entry.scrollIntoView({ block: "center" });
    }
    field.focus({ preventScroll: true });
  }, 0);
}

export default function EditApp(props: { initialYaml: string; enHasAuthorResidue?: boolean; siteLang?: string }) {
  const [lang, setLang] = useState<EditorLang>(() => {
    // 有些锁死 storage 的浏览器连 getItem 自身都抛 SecurityError，整段包进 try/catch，
    // 取不到就回退站点语言，别让编辑器首屏白屏。
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "zh-CN" || saved === "en") return saved;
    } catch {
      /* storage 不可用，忽略 */
    }
    return resolveEditorLang(props.siteLang);
  });
  const t = EDITOR_STRINGS[lang];
  // <html lang> 构建时是静态的，改不了；由岛在客户端同步，保证读屏语言正确
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* 隐私模式等禁写 localStorage，忽略 */
    }
  }, [lang]);

  // 默认起点：上次编辑的草稿（本机 localStorage）优先，其次空白最小模板。
  // 刷新/关页会丢表单，草稿是唯一的补救；与界面语言解耦，切中英不影响恢复。
  const [bootDraft] = useState<EditConfig | null>(() => readDraft());
  const [config, setConfig] = useState<EditConfig>(() => bootDraft ?? emptyConfig());
  const [draft, setDraft] = useState<string | null>(null);
  const [discardedDraft, setDiscardedDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // 上一次复制的 1.5s 回执不能盖住下一次结果：编辑后、语言切换、被校验拦下、
  // 或再次复制时都要先清掉旧计时器，否则按钮可能在「这次没复制」时仍显示「已复制」。
  const resetCopied = () => {
    if (copyTimer.current !== undefined) clearTimeout(copyTimer.current);
    copyTimer.current = undefined;
    setCopied(false);
  };
  // 是否点过「载入当前站配置」——只有这时才把 enYaml 残留 finding 纳入（#1a）；
  // 粘贴/上传是用户自己的内容，不代表载入了当前站配置，不触发这条门。
  const [loadedCurrent, setLoadedCurrent] = useState(false);
  // 移动端「校样」默认收起（展开时 flex，配 gap 生效）；md+ 始终并排显示（md:flex 覆盖）
  const [showYaml, setShowYaml] = useState(false);
  // 用户动过手没有（表单改过 或 导入过）。空模板的唯一错误必然是「名字必填」，
  // 而那一栏标题已经写着「名字（必填）」——一进页面就飘红条等于先训人一顿，
  // 说的还是他还没造成的错。touched 之前不报错；导入也置位，
  // 这样「粘进来的 YAML 少了名字」这种真问题照样立刻报出来。
  const [touched, setTouched] = useState(!!bootDraft);
  const [restored, setRestored] = useState(!!bootDraft);

  // 导出键跟界面语言走：中文界面出中文键、英文界面出英文键（parseSite 都认）
  const yamlOut = useMemo(() => configToYaml(config, lang), [config, lang]);
  const yamlLines = useMemo(() => (yamlOut ? yamlOut.split("\n").length : 0), [yamlOut]);
  // 校样被手改但还没导入时，顶部复制 / 下载不能拿表单里的旧 YAML 冒充可见内容。
  const yamlDirty = draft !== null && draft !== yamlOut;

  const update = (fn: (c: EditConfig) => void) => {
    const next = clone(config);
    fn(next);
    // 校样未导入时改表单会换掉校样；把它收进恢复条，不无声丢掉。
    if (yamlDirty && draft !== null) setDiscardedDraft(draft);
    setConfig(next);
    setDraft(null);
    setTouched(true);
    resetCopied();
    writeDraft(next);
  };

  const residue = useMemo(
    () => detectResidue(config, props.enHasAuthorResidue, loadedCurrent),
    [config, props.enHasAuthorResidue, loadedCurrent],
  );
  const validationError = useMemo(() => {
    try {
      const doc = yaml.load(yamlOut);
      normalizeSite(doc);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = (doc as any)?.网址 ?? (doc as any)?.url;
      if (url !== undefined && !(typeof url === "string" && isHttpUrl(url))) return t.urlInvalid;
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }, [yamlOut, t]);

  // 列表条目半填：序列化会把它们静默剪掉（或把空标签写成空键），所以在导出前拦下。
  // 空条目本身不拦：用户加了一行还没填，不算错，导出时自然消失。
  const entryIssues = useMemo(
    () =>
      incompleteEntries(config).map((issue) => {
        const n = String(issue.index + 1);
        if (issue.kind === "link") {
          return issue.missing.includes("label")
            ? t.linkMissingLabel.replace("{n}", n)
            : t.linkMissingUrl.replace("{n}", n);
        }
        if (issue.kind === "work") return t.workMissingName.replace("{n}", n);
        return issue.missing.includes("label")
          ? t.statMissingLabel.replace("{n}", n)
          : t.statMissingValue.replace("{n}", n);
      }),
    [config, t],
  );
  const exportError = [validationError, ...entryIssues].filter(Boolean).join(lang === "en" ? "; " : "；");

  const revealExportError = () => {
    setTouched(true);
    resetCopied();
    // 手机上校样默认收起，错误在折叠面板里；点导出时把它打开并滚过去，
    // 否则按钮没变成「已复制」，用户却看不到任何原因。
    setShowYaml(true);
    setTimeout(() => {
      document.querySelector(".callout-error")?.scrollIntoView({ block: "center" });
    }, 0);
  };

  const revealUnimported = () => {
    setShowYaml(true);
    setTimeout(() => {
      document.querySelector("[data-yaml-actions]")?.scrollIntoView({ block: "center" });
    }, 0);
  };

  const restoreDiscarded = () => {
    if (discardedDraft === null) return;
    setDraft(discardedDraft);
    setDiscardedDraft(null);
    setShowYaml(true);
    setTimeout(() => {
      document.querySelector("[data-yaml-actions]")?.scrollIntoView({ block: "center" });
    }, 0);
  };

  const load = (text: string) => {
    const { config: c, error } = yamlToConfig(text);
    if (error) {
      alert(t.importFailed + error);
      return;
    }
    setConfig(c);
    setDraft(null);
    setDiscardedDraft(null);
    setTouched(true);
    setRestored(false);
    resetCopied();
    writeDraft(c);
  };
  const importDraft = () => {
    if (draft !== null) load(draft);
  };
  // 「载入当前站配置」专用：与粘贴/上传共用 load()，但额外标记 loadedCurrent——
  // 只有走这条路径才代表用户在看/改自己仓库里已有的配置，enYaml 残留提醒才该出现。
  const loadCurrentSite = () => {
    if ((hasAnyContent(config) || yamlDirty) && !window.confirm(t.replaceConfirm)) return;
    load(props.initialYaml);
    setLoadedCurrent(true);
  };
  const clearSavedDraft = () => {
    clearDraft();
    setConfig(emptyConfig());
    setDraft(null);
    setDiscardedDraft(null);
    setTouched(false);
    setRestored(false);
    setLoadedCurrent(false);
    resetCopied();
    setShowYaml(false);
  };

  const copy = async () => {
    if (yamlDirty) {
      resetCopied();
      revealUnimported();
      return;
    }
    if (exportError) {
      revealExportError();
      return;
    }
    try {
      await navigator.clipboard.writeText(yamlOut);
      resetCopied();
      setCopied(true);
      // 纯文案回执，非动画；global.css 的 reduced-motion 不受影响
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      resetCopied();
      alert(t.copyFailed);
    }
  };
  const download = () => {
    if (yamlDirty) {
      resetCopied();
      revealUnimported();
      return;
    }
    if (exportError) {
      revealExportError();
      return;
    }
    const blob = new Blob([yamlOut], { type: "text/yaml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "projects.yaml";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      {/* 工作台顶栏：sticky，左印章字标，右「中/EN」+ 复制/下载主操作 */}
      <header class="sticky top-0 z-20 border-b border-(--color-line) bg-(--color-paper)/85 backdrop-blur">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3">
          <div class="flex items-center gap-2.5">
            {/* 印章：呼应主站朱砂章 */}
            <span class="inline-block size-4 rotate-3 rounded-sm bg-(--color-accent)" aria-hidden="true" />
            <span class="eyebrow text-(--color-ink)">{t.wordmark}</span>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="eyebrow flex items-center gap-2">
              <button
                class={lang === "zh-CN" ? "py-1 font-semibold text-(--color-ink)" : "py-1 hover:text-(--color-ink)"}
                aria-current={lang === "zh-CN" ? "true" : undefined}
                onClick={() => {
                  setLang("zh-CN");
                  resetCopied();
                }}
              >
                {t.langZh}
              </button>
              <span class="opacity-40">/</span>
              <button
                class={lang === "en" ? "py-1 font-semibold text-(--color-ink)" : "py-1 hover:text-(--color-ink)"}
                aria-current={lang === "en" ? "true" : undefined}
                onClick={() => {
                  setLang("en");
                  resetCopied();
                }}
              >
                {t.langEn}
              </button>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-primary text-sm" aria-live="polite" onClick={copy}>{copied ? t.copied : t.copyYaml}</button>
              <button class="btn text-sm" onClick={download}>{t.download}</button>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-5 py-8">
        <div class="grid gap-8 md:grid-cols-2">
          {/* 稿：表单 */}
          <div class="flex flex-col gap-9">
            {discardedDraft !== null && (
              <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-(--color-line) bg-(--color-card) py-3 pr-4 pl-4 text-sm text-(--color-ink-2)">
                <span>{t.draftDiscarded}</span>
                <button class="link-quiet py-1 text-sm" onClick={restoreDiscarded}>{t.draftRestore}</button>
              </div>
            )}
            {restored && (
              <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-(--color-line) bg-(--color-card) py-3 pr-4 pl-4 text-sm text-(--color-ink-2)">
                <span>{t.draftRestored}</span>
                <button class="link-quiet py-1 text-sm" onClick={clearSavedDraft}>{t.draftClear}</button>
              </div>
            )}
            {residue.length > 0 && (
              // 残留＝校样上的红笔改动：朱砂左细线 + 朱砂 eyebrow 标题
              <div class="border-l-2 border-(--color-accent) bg-(--color-card) py-3 pr-4 pl-4 text-sm">
                <p class="eyebrow mb-2 text-(--color-accent)">{t.residueTitle}</p>
                <ul class="list-disc space-y-1 pl-5 text-(--color-ink-2)">
                  {residue.map((r) => (
                    <li>{RESIDUE_TEXT[r.kind](t)}</li>
                  ))}
                </ul>
              </div>
            )}

            <div class="flex flex-wrap gap-2">
              <button class="btn text-xs" onClick={loadCurrentSite}>{t.loadCurrent}</button>
              <label class="btn cursor-pointer text-xs focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--color-accent)">
                {t.uploadFile}
                <input
                  type="file"
                  accept=".yaml,.yml"
                  class="sr-only"
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    const f = input.files?.[0];
                    if (!f) return;
                    if ((hasAnyContent(config) || yamlDirty) && !window.confirm(t.replaceConfirm)) {
                      input.value = ""; // 允许再次选择同一个文件
                      return;
                    }
                    f.text().then(load);
                  }}
                />
              </label>
            </div>

            <YouFields config={config} update={update} t={t} />
            <LinksFields config={config} update={update} t={t} />
            <WorksFields config={config} update={update} t={t} />
            <MoreFields config={config} update={update} t={t} />
          </div>

          {/* 校样：实时 YAML，纸白细线 + 等宽 */}
          <div class="flex flex-col gap-3">
            {/* 移动端开关：md:hidden 放在 wrapper 上，避免与 .btn 的 display:inline-block 相互抵消 */}
            <div class="md:hidden">
              <button class="btn text-xs" onClick={() => setShowYaml((v) => !v)}>
                {showYaml ? t.hideYaml : t.viewYaml}
              </button>
            </div>
            <div class={`${showYaml ? "flex" : "hidden"} flex-col gap-3 md:sticky md:top-24 md:flex`}>
              <div class="flex items-baseline justify-between border-b border-(--color-line) pb-2">
                <span class="eyebrow">YAML</span>
                <span class="mono text-xs text-(--color-accent)">{yamlLines}</span>
              </div>
              {touched && exportError && (
                <p class="callout-error text-sm" role="alert">
                  {t.validationPrefix}
                  {exportError}
                </p>
              )}
              <textarea
                aria-label={t.yamlAria}
                class="yaml-pane w-full rounded-md border border-(--color-line) bg-(--color-card) p-4 font-mono text-xs leading-relaxed text-(--color-ink)"
                value={draft ?? yamlOut}
                onInput={(e) => setDraft((e.target as HTMLTextAreaElement).value)}
              />
              {yamlDirty && (
                <div class="flex flex-col gap-2" data-yaml-actions>
                  <p class="text-xs text-(--color-ink-2)">{t.draftUnimported}</p>
                  <div class="flex gap-2">
                    <button class="btn btn-primary text-xs" onClick={importDraft}>{t.importThis}</button>
                    <button class="btn text-xs" onClick={() => setDraft(null)}>{t.discardDraft}</button>
                  </div>
                </div>
              )}
              <p class="text-xs text-(--color-ink-2)">
                {t.pasteHint}
                <br />
                {t.exportHint}
              </p>
              {config.url && (
                <a class="link-quiet self-start text-xs" href={config.url} target="_blank" rel="noopener noreferrer">
                  {t.openSite}
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// —— 分组子组件 ——

interface FieldProps {
  config: EditConfig;
  update: (fn: (c: EditConfig) => void) => void;
  t: EditorUI;
}

function YouFields({ config, update, t }: FieldProps) {
  return (
    <Group title={t.groupYou}>
      <div class="flex flex-col gap-4">
        <Text label={t.fName} value={config.name} placeholder={t.pName} onInput={(v) => update((c) => (c.name = v))} />
        <Text label={t.fTitle} value={config.title} onInput={(v) => update((c) => (c.title = v))} />
        <Area label={t.fIntro} value={config.intro} placeholder={t.pIntro} onInput={(v) => update((c) => (c.intro = v))} />
        <Text label={t.fAvatar} value={config.avatar} onInput={(v) => update((c) => (c.avatar = v))} />
      </div>
    </Group>
  );
}

function LinksFields({ config, update, t }: FieldProps) {
  const removeLink = (i: number) => {
    const link = config.links[i];
    if (hasLinkContent(link)) {
      const name = link.label.trim() || link.url.trim();
      if (!window.confirm(t.removeLinkConfirm.replace("{name}", name))) return;
    }
    update((c) => c.links.splice(i, 1));
  };
  return (
    <Group
      name="links"
      title={t.groupLinks}
      count={config.links.length}
      action={
        <button
          class="btn text-xs"
          onClick={() => {
            update((c) => c.links.push({ label: "", url: "" }));
            focusNewEntry("links");
          }}
        >
          {t.addLink}
        </button>
      }
    >
      {config.links.length === 0 ? (
        <p class="text-sm text-(--color-ink-2)">{t.emptyLinks}</p>
      ) : (
        <div class="flex flex-col gap-3">
          {config.links.map((link, i) => (
            <div class="flex items-end gap-2" data-entry>
              <div class="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr]">
                <Text label={t.fLinkLabel} value={link.label} onInput={(v) => update((c) => (c.links[i].label = v))} />
                <Text label={t.fLinkUrl} value={link.url} onInput={(v) => update((c) => (c.links[i].url = v))} />
              </div>
              <RowControls
                upLabel={t.moveUp}
                downLabel={t.moveDown}
                removeLabel={t.remove}
                onUp={() => update((c) => (c.links = move(c.links, i, -1)))}
                onDown={() => update((c) => (c.links = move(c.links, i, 1)))}
                onRemove={() => removeLink(i)}
              />
            </div>
          ))}
        </div>
      )}
    </Group>
  );
}

function WorksFields({ config, update, t }: FieldProps) {
  const addWork = () => {
    update((c) => c.works.push(emptyWork()));
    focusNewEntry("works");
  };
  const removeWork = (i: number) => {
    const work = config.works[i];
    if (hasWorkContent(work)) {
      const name = work.name.trim() || `#${i + 1}`;
      if (!window.confirm(t.removeWorkConfirm.replace("{name}", name))) return;
    }
    update((c) => c.works.splice(i, 1));
  };
  const addBtn = (
    <button class="btn btn-primary text-xs" onClick={addWork}>
      {t.addWork}
    </button>
  );
  // #2：作品为空时，空状态引导里已经有一个「+ 加一条作品」，Group 头部的 action 不再重复渲染，
  // 避免同屏出现两个一样的按钮；非空时头部这个是唯一的加条目入口。
  return (
    <Group name="works" title={t.groupWorks} count={config.works.length} action={config.works.length === 0 ? undefined : addBtn}>
      {config.works.length === 0 ? (
        <div class="flex flex-col items-start gap-3">
          <p class="text-sm text-(--color-ink-2)">{t.emptyWorks}</p>
          <button class="btn btn-primary text-sm" onClick={addWork}>
            {t.addWork}
          </button>
        </div>
      ) : (
        <div class="flex flex-col gap-6">
          {config.works.map((work, i) => (
            <div class="border-l border-(--color-line) pl-4" data-entry>
              <div class="mb-3 flex items-start justify-between gap-2">
                <span class="mono text-xs text-(--color-ink-2)">#{i + 1}</span>
                <RowControls
                  upLabel={t.moveUp}
                  downLabel={t.moveDown}
                  removeLabel={t.remove}
                  onUp={() => update((c) => (c.works = move(c.works, i, -1)))}
                  onDown={() => update((c) => (c.works = move(c.works, i, 1)))}
                  onRemove={() => removeWork(i)}
                />
              </div>
              <div class="flex flex-col gap-4">
                <Text label={t.fWorkName} value={work.name} placeholder={t.pWorkName} onInput={(v) => update((c) => (c.works[i].name = v))} />
                <Area label={t.fWorkDesc} value={work.desc} onInput={(v) => update((c) => (c.works[i].desc = v))} />
                <Text label={t.fWorkLink} value={work.link} onInput={(v) => update((c) => (c.works[i].link = v))} />
                <Check label={t.fWorkStar} checked={work.star} onToggle={(v) => update((c) => (c.works[i].star = v))} />
                <details class="rounded-md border border-(--color-line) bg-(--color-card) px-3 py-2">
                  <summary class="cursor-pointer text-xs font-medium text-(--color-ink-2)">{t.workMore}</summary>
                  <div class="mt-3 flex flex-col gap-4">
                    <Text label={t.fWorkSource} value={work.source} onInput={(v) => update((c) => (c.works[i].source = v))} />
                    <Text label={t.fWorkImage} value={work.image} onInput={(v) => update((c) => (c.works[i].image = v))} />
                    <Text label={t.fWorkDate} value={work.date} onInput={(v) => update((c) => (c.works[i].date = v))} />
                    <Text label={t.fWorkVia} value={work.via} onInput={(v) => update((c) => (c.works[i].via = v))} />
                    <Text label={t.fWorkGroup} value={work.group} onInput={(v) => update((c) => (c.works[i].group = v))} />
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
    </Group>
  );
}

function MoreFields({ config, update, t }: FieldProps) {
  const addStat = () => {
    update((c) => c.stats.push({ label: "", value: "" }));
    focusNewEntry("stats");
  };
  const removeStat = (i: number) => {
    const stat = config.stats[i];
    if (hasStatContent(stat)) {
      const name = stat.label.trim() || String(stat.value);
      if (!window.confirm(t.removeStatConfirm.replace("{name}", name))) return;
    }
    update((c) => c.stats.splice(i, 1));
  };
  return (
    <details class="border-t border-(--color-line) pt-4">
      <summary class="eyebrow cursor-pointer text-(--color-ink)">{t.groupMore}</summary>
      <p class="mt-2 text-xs text-(--color-ink-2)">{t.moreHint}</p>
      <div class="mt-5 flex flex-col gap-6">
        {/* 数据 */}
        <div data-edit-group="stats">
          <div class="mb-3 flex items-baseline justify-between gap-3 border-b border-(--color-line) pb-2">
            <span class="eyebrow flex items-baseline gap-2">
              <span>{t.fStatLabel}</span>
              <span class="mono text-(--color-accent) tracking-normal normal-case">{config.stats.length}</span>
            </span>
            <button class="btn text-xs" onClick={addStat}>
              {t.addStat}
            </button>
          </div>
          <div class="flex flex-col gap-3">
            {config.stats.map((stat, i) => (
              <div class="flex items-end gap-2" data-entry>
                <div class="grid flex-1 gap-2 sm:grid-cols-2">
                  <Text label={t.fStatLabel} value={stat.label} onInput={(v) => update((c) => (c.stats[i].label = v))} />
                  <Text label={t.fStatValue} value={stat.value} onInput={(v) => update((c) => (c.stats[i].value = v))} />
                </div>
                <RowControls
                  upLabel={t.moveUp}
                  downLabel={t.moveDown}
                  removeLabel={t.remove}
                  onUp={() => update((c) => (c.stats = move(c.stats, i, -1)))}
                  onDown={() => update((c) => (c.stats = move(c.stats, i, 1)))}
                  onRemove={() => removeStat(i)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 其余顶层设置 */}
        <div class="flex flex-col gap-4">
          <Text label={t.fUrl} value={config.url} placeholder={t.fUrlPlaceholder} onInput={(v) => update((c) => (c.url = v))} />
          <Text label={t.fColor} value={config.color} onInput={(v) => update((c) => (c.color = v))} />
          <Select
            label={t.fTheme}
            value={config.theme}
            options={[
              { value: "", label: t.optThemeDefault },
              { value: "靛蓝", label: "靛蓝 / Indigo" },
              { value: "森绿", label: "森绿 / Pine" },
              { value: "暖褐", label: "暖褐 / Sepia" },
              { value: "墨黑", label: "墨黑 / Mono" },
            ]}
            onInput={(v) => update((c) => (c.theme = v))}
          />
          <Select
            label={t.fAppearance}
            value={config.appearance}
            options={[
              { value: "", label: t.optApDefault },
              { value: "自动", label: t.optApAuto },
              { value: "亮", label: t.optApLight },
              { value: "暗", label: t.optApDark },
            ]}
            onInput={(v) => update((c) => (c.appearance = v))}
          />
          <Text label={t.fOpensource} value={config.opensource} placeholder="10" onInput={(v) => update((c) => (c.opensource = v))} />
          <Text label={t.fOpensourceSince} value={config.opensourceSince} placeholder="2026-03" onInput={(v) => update((c) => (c.opensourceSince = v))} />
          <Text label={t.fStarLine} value={config.starLine} placeholder="30" onInput={(v) => update((c) => (c.starLine = v))} />
          <Text label={t.fOpensourceMax} value={config.opensourceMax} placeholder="15" onInput={(v) => update((c) => (c.opensourceMax = v))} />
          <Area label={t.fFooter} value={config.footer} onInput={(v) => update((c) => (c.footer = v))} />
          <Text label={t.fMark} value={config.mark} placeholder="365 · Open Source" onInput={(v) => update((c) => (c.mark = v))} />
          <Text label={t.fLang} value={config.lang} placeholder={t.fLangPlaceholder} onInput={(v) => update((c) => (c.lang = v))} />
        </div>
      </div>
    </details>
  );
}
