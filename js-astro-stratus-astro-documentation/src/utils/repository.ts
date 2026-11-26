import pageTools from "@data/pageTools.json";

// `repositoryUrl` is whatever an editor pasted, usually `…/tree/main`: that suffix
// names the branch, the rest is the repository root.
const configured = String(pageTools.repositoryUrl ?? "").replace(/\/+$/, "");
const repositoryRoot = configured.replace(/\/tree\/[^/]+$/, "");
const branch = /\/tree\/([^/]+)$/.exec(configured)?.[1] ?? "main";

export function editPageUrl(filePath?: string): string {
  return repositoryRoot && filePath ? `${repositoryRoot}/edit/${branch}/${filePath}` : "";
}
