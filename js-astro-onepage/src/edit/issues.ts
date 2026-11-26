import type { EditConfig, EditLink, EditStat, EditWork } from "./types";

// 列表条目的「半填」状态：序列化会把空条目剪掉，但半填条目会静默消失或生成空键
// （如只有网址的链接 → `- '': https://…`）。导出前必须先让用户把这些补齐。
export type EntryIssueField = "label" | "url" | "name" | "value";

export interface EntryIssue {
  kind: "link" | "work" | "stat";
  index: number;
  missing: EntryIssueField[];
}

const filled = (v: string | number | undefined): boolean => String(v ?? "").trim() !== "";

export const hasLinkContent = (link: EditLink): boolean => filled(link.label) || filled(link.url);

export const hasWorkContent = (work: EditWork): boolean =>
  filled(work.name) ||
  filled(work.desc) ||
  filled(work.link) ||
  filled(work.source) ||
  filled(work.image) ||
  filled(work.date) ||
  filled(work.via) ||
  filled(work.group) ||
  work.star;

export const hasStatContent = (stat: EditStat): boolean => filled(stat.label) || filled(stat.value);

export function incompleteEntries(config: EditConfig): EntryIssue[] {
  const issues: EntryIssue[] = [];

  config.links.forEach((link, index) => {
    if (!hasLinkContent(link)) return; // 整条空行：剪掉即可
    const missing: EntryIssueField[] = [];
    if (!filled(link.label)) missing.push("label");
    if (!filled(link.url)) missing.push("url");
    if (missing.length) issues.push({ kind: "link", index, missing });
  });

  config.works.forEach((work, index) => {
    if (hasWorkContent(work) && !filled(work.name)) {
      issues.push({ kind: "work", index, missing: ["name"] });
    }
  });

  config.stats.forEach((stat, index) => {
    const hasLabel = filled(stat.label);
    const hasValue = filled(stat.value);
    if (!hasStatContent(stat)) return; // 整条空行：剪掉即可
    const missing: EntryIssueField[] = [];
    if (!hasLabel) missing.push("label");
    if (!hasValue) missing.push("value");
    if (missing.length) issues.push({ kind: "stat", index, missing });
  });

  return issues;
}
