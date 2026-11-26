// 编辑器界面文案：只做 zh-CN + en 两种（主站固定文案的 10 语言机制是另一套，不在这里）。
// 编辑器是工具，界面语言与站点发布语言解耦：顶部切换 + localStorage 记住。
// schema v2 表单形态：你 / 链接 / 作品 / 更多设置，键数较 v1 大约砍半。
export type EditorLang = "zh-CN" | "en";

export interface EditorUI {
  // —— 顶栏 / 操作 ——
  wordmark: string;
  langZh: string;
  langEn: string;
  copyYaml: string;
  copied: string;
  copyFailed: string;
  download: string;
  openSite: string;
  viewYaml: string;
  hideYaml: string;
  draftRestored: string;
  draftClear: string;
  draftDiscarded: string;
  draftRestore: string;
  replaceConfirm: string;
  // —— 导入 ——
  loadCurrent: string;
  uploadFile: string;
  pasteHint: string;
  exportHint: string;
  yamlAria: string;
  importThis: string;
  discardDraft: string;
  draftUnimported: string;
  importFailed: string;
  // —— 校验 ——
  validationPrefix: string;
  urlInvalid: string;
  linkMissingLabel: string;
  linkMissingUrl: string;
  workMissingName: string;
  statMissingLabel: string;
  statMissingValue: string;
  // —— 残留横幅 ——
  residueTitle: string;
  residueGithub: string;
  residueUrl: string;
  residueName: string;
  residueFooter: string;
  residueEnYaml: string;
  // —— 分组标题 ——
  groupYou: string;
  groupLinks: string;
  groupWorks: string;
  groupMore: string;
  moreHint: string;
  // —— 你 ——
  fName: string;
  pName: string;
  fTitle: string;
  fIntro: string;
  pIntro: string;
  fAvatar: string;
  // —— 链接 ——
  fLinkLabel: string;
  fLinkUrl: string;
  addLink: string;
  emptyLinks: string;
  // —— 作品 ——
  fWorkName: string;
  pWorkName: string;
  fWorkDesc: string;
  fWorkLink: string;
  fWorkStar: string;
  workMore: string;
  fWorkSource: string;
  fWorkImage: string;
  fWorkDate: string;
  fWorkVia: string;
  fWorkGroup: string;
  addWork: string;
  emptyWorks: string;
  // —— 数据（更多设置内）——
  fStatLabel: string;
  fStatValue: string;
  addStat: string;
  // —— 更多设置的其余字段 ——
  fUrl: string;
  fUrlPlaceholder: string;
  fColor: string;
  fTheme: string;
  fAppearance: string;
  fOpensource: string;
  fOpensourceSince: string;
  fStarLine: string;
  fOpensourceMax: string;
  optThemeDefault: string;
  optApDefault: string;
  optApAuto: string;
  optApLight: string;
  optApDark: string;
  fFooter: string;
  fMark: string;
  fLang: string;
  fLangPlaceholder: string;
  // —— 通用增删移 ——
  remove: string;
  removeLinkConfirm: string;
  removeWorkConfirm: string;
  removeStatConfirm: string;
  moveUp: string;
  moveDown: string;
}

const zh: EditorUI = {
  wordmark: "可视化编辑",
  langZh: "中",
  langEn: "EN",
  copyYaml: "复制 YAML",
  copied: "已复制",
  copyFailed: "复制失败，请改用「下载 projects.yaml」。",
  download: "下载 projects.yaml",
  openSite: "打开你的站看看",
  viewYaml: "查看 YAML",
  hideYaml: "收起 YAML",
  draftRestored: "已恢复上次编辑的内容。",
  draftClear: "清空草稿",
  draftDiscarded: "校样里有未导入的改动，已在改表单时收起。",
  draftRestore: "恢复校样改动",
  replaceConfirm: "载入会替换你正在填写的内容，继续？",
  loadCurrent: "载入当前站配置",
  uploadFile: "上传文件",
  pasteHint: "已有 projects.yaml？把它粘贴到 YAML 面板，再点「导入这段 YAML」，表单就会读进你的内容。",
  exportHint: "填好后点顶部「复制 YAML」或「下载 projects.yaml」，用导出的内容替换仓库里的 src/data/projects.yaml。",
  yamlAria: "YAML 校样，可直接改文字再点「导入这段 YAML」",
  importThis: "导入这段 YAML",
  discardDraft: "放弃，回到表单结果",
  draftUnimported: "校样里还有未导入的改动，先导入或放弃，再复制 / 下载。",
  importFailed: "这个 YAML 读不进来：",
  validationPrefix: "还差一点就能导出：",
  urlInvalid: "网址要写完整地址，以 https:// 开头，例如 https://你的用户名.github.io",
  linkMissingLabel: "第 {n} 条链接缺少标签",
  linkMissingUrl: "第 {n} 条链接缺少网址",
  workMissingName: "第 {n} 条作品缺少名字",
  statMissingLabel: "第 {n} 条数据缺少标签",
  statMissingValue: "第 {n} 条数据缺少值",
  residueTitle: "这些还是模板作者的，记得换成你的：",
  residueGithub: "链接里的 GitHub 还是模板作者的（rockbenben），记得换成你自己的。",
  residueUrl: "网址还是模板作者的（me.newzone.top），记得换成你自己的。",
  residueName: "名字还是模板作者的（Benson），记得改成你的。",
  residueFooter: "页脚还带着模板作者的落款（rockbenben），记得改成你自己的或删掉。",
  residueEnYaml: "你的英文页还是模板作者的内容。这条要到仓库里改（src/data/projects.en.yaml，改成你的翻译或删掉），不影响你现在填表。",
  groupYou: "你",
  groupLinks: "链接",
  groupWorks: "作品",
  groupMore: "更多设置",
  moreHint: "数据、网址、颜色、页脚、语言——大部分人用不到，可留空。",
  fName: "名字（必填）",
  pName: "你的名字，例如 张三",
  fTitle: "头衔",
  fIntro: "一句话介绍",
  pIntro: "一句话说清你是谁、在做什么。",
  fAvatar: "头像（/avatar.jpg 或图片网址；留空时若链接里有 GitHub 会自动抓）",
  fLinkLabel: "标签（必填）",
  fLinkUrl: "网址",
  addLink: "+ 加一个链接",
  emptyLinks: "还没有链接。GitHub、邮箱、博客都可以加。",
  fWorkName: "名字（必填）",
  pWorkName: "作品名字",
  fWorkDesc: "一句话介绍",
  fWorkLink: "链接（任意网址：网站 / 文章 / 视频 / App…）",
  fWorkStar: "设为重点（带图大卡展示）",
  workMore: "更多字段（源码 / 图 / 日期 / 出处 / 分类）",
  fWorkSource: "源码（第二个链接，如仓库地址）",
  fWorkImage: "图（缩略图；留空自动抓链接页的封面）",
  fWorkDate: "日期（原样显示，如 2026-05）",
  fWorkVia: "出处（发表在哪，如《少数派》/ B站）",
  fWorkGroup: "分类（同分类自动归组；留空=单一列表）",
  addWork: "+ 加一条作品",
  emptyWorks: "还没有作品。点下面加上你的第一个作品吧。",
  fStatLabel: "标签",
  fStatValue: "值（数字或文字；写「自动」抓 GitHub 总星数）",
  addStat: "+ 加一条数据",
  fUrl: "网址（你的站点地址）",
  fUrlPlaceholder: "https://你的用户名.github.io",
  fColor: "强调色（如 #c8402e）",
  fTheme: "主题（整套配色）",
  fAppearance: "外观（明暗）",
  fOpensource: "开源项目（自动列出 star ≥ 此数的 GitHub 仓库；留空=不显示）",
  fOpensourceSince: "开源项目起始（此日期后建的仓库全列，如 2026-03）",
  fStarLine: "星标线（star 超过此数的置顶按 star 排、其余按最近更新排；最近更新＝最后一条人工提交，机器人自动提交不算；也是「开源上限」的分界，线上全显；默认 30）",
  fOpensourceMax: "开源上限（星标线以下的尾巴最多再列几个，总数会向上补到 3 的倍数凑满网格末行；线上的高星项目永远全显；如 15，写 0＝只列高星组；留空=不限）",
  optThemeDefault: "朱砂（默认）",
  optApDefault: "默认",
  optApAuto: "自动（跟随系统）",
  optApLight: "亮",
  optApDark: "暗",
  fFooter: "页脚（支持 <a> 链接）",
  fMark: "顶栏标记（顶栏左上的小标，如 365 · Open Source；留空=不显示）",
  fLang: "语言（模板固定文案的语言）",
  fLangPlaceholder: "中文 / English / 日本語 …",
  remove: "删除",
  removeLinkConfirm: "删除链接「{name}」？",
  removeWorkConfirm: "删除作品「{name}」？",
  removeStatConfirm: "删除数据「{name}」？",
  moveUp: "上移",
  moveDown: "下移",
};

const en: EditorUI = {
  wordmark: "Visual editor",
  langZh: "中",
  langEn: "EN",
  copyYaml: "Copy YAML",
  copied: "Copied",
  copyFailed: "Copy failed. Use “Download projects.yaml” instead.",
  download: "Download projects.yaml",
  openSite: "Open your site",
  viewYaml: "Show YAML",
  hideYaml: "Hide YAML",
  draftRestored: "Restored your last edit.",
  draftClear: "Clear draft",
  draftDiscarded: "Unimported YAML changes were set aside when you edited the form.",
  draftRestore: "Restore YAML changes",
  replaceConfirm: "Loading this will replace what you've filled in. Continue?",
  loadCurrent: "Load current config",
  uploadFile: "Upload file",
  pasteHint: 'Already have a projects.yaml? Paste it into the YAML panel, then click "Import this YAML" and the form reads it in.',
  exportHint: 'When you are done, use Copy YAML or Download projects.yaml at the top, then replace src/data/projects.yaml in your repo with the result.',
  yamlAria: 'YAML proof. Edit the text here, then click "Import this YAML".',
  importThis: "Import this YAML",
  discardDraft: "Discard, back to form",
  draftUnimported: "The YAML panel has unimported changes. Import or discard them before copying or downloading.",
  importFailed: "Couldn't read this YAML: ",
  validationPrefix: "Almost ready to export: ",
  urlInvalid: "The URL must be a full address starting with https://, e.g. https://your-username.github.io",
  linkMissingLabel: "Link {n} is missing a label",
  linkMissingUrl: "Link {n} is missing a URL",
  workMissingName: "Work {n} is missing a name",
  statMissingLabel: "Stat {n} is missing a label",
  statMissingValue: "Stat {n} is missing a value",
  residueTitle: "These are still the template author's — change them to yours:",
  residueGithub: "The GitHub link is still the template author's (rockbenben) — use your own.",
  residueUrl: "The site URL is still the template author's (me.newzone.top) — use your own.",
  residueName: "The name is still the template author's (Benson) — change it to yours.",
  residueFooter: "The footer still carries the template author's sign-off (rockbenben) — change or remove it.",
  residueEnYaml: "Your English page still shows the template author's content. Fix it in the repo (src/data/projects.en.yaml — replace it with your translation, or delete the file); it won't stop you from filling out this form now.",
  groupYou: "You",
  groupLinks: "Links",
  groupWorks: "Works",
  groupMore: "More settings",
  moreHint: "Stats, URL, color, footer, language — most people don't need these; leave them blank.",
  fName: "Name (required)",
  pName: "Your name, e.g. Jane Doe",
  fTitle: "Title",
  fIntro: "One-line intro",
  pIntro: "One line: who you are and what you do.",
  fAvatar: "Avatar (/avatar.jpg or an image URL; auto-fetched from GitHub if blank)",
  fLinkLabel: "Label (required)",
  fLinkUrl: "URL",
  addLink: "+ Add link",
  emptyLinks: "No links yet. GitHub, email, blog — add any of them.",
  fWorkName: "Name (required)",
  pWorkName: "Work name",
  fWorkDesc: "One-line intro",
  fWorkLink: "Link (any URL: site / article / video / app…)",
  fWorkStar: "Feature it (large card with image)",
  workMore: "More fields (source / image / date / via / category)",
  fWorkSource: "Source (a second link, e.g. the repo)",
  fWorkImage: "Image (thumbnail; auto-fetched from the link if blank)",
  fWorkDate: "Date (shown as-is, e.g. 2026-05)",
  fWorkVia: "Via (where it was published)",
  fWorkGroup: "Category (same category groups together; blank = single list)",
  addWork: "+ Add a work",
  emptyWorks: "No works yet. Add your first one below.",
  fStatLabel: "Label",
  fStatValue: 'Value (number or text; "auto" pulls total GitHub stars)',
  addStat: "+ Add a stat",
  fUrl: "URL (your site's address)",
  fUrlPlaceholder: "https://your-username.github.io",
  fColor: "Accent color (e.g. #c8402e)",
  fTheme: "Theme (full palette)",
  fAppearance: "Appearance (light/dark)",
  fOpensource: "Open source (auto-list GitHub repos with stars ≥ this; blank = off)",
  fOpensourceSince: "Since (repos created after this date are all listed, e.g. 2026-03)",
  fStarLine: "Star line (repos above this pin to the top by stars; the rest sort by most-recent update, where an update means the newest non-bot commit; also the cut-off for \"Open source max\" — those above it always show; default 30)",
  fOpensourceMax: "Open source max (how many repos below the star line to append; the total rounds up to a multiple of 3 to fill the last grid row; the high-star ones above it always show; e.g. 15, 0 = high-star only; blank = no limit)",
  optThemeDefault: "Cinnabar (default)",
  optApDefault: "Default",
  optApAuto: "Auto (follow system)",
  optApLight: "Light",
  optApDark: "Dark",
  fFooter: "Footer (supports <a> links)",
  fMark: "Top-bar mark (small label at top-left, e.g. 365 · Open Source; blank = hidden)",
  fLang: "Language (template's fixed copy)",
  fLangPlaceholder: "中文 / English / 日本語 …",
  remove: "Remove",
  removeLinkConfirm: "Delete link “{name}”?",
  removeWorkConfirm: "Delete work “{name}”?",
  removeStatConfirm: "Delete stat “{name}”?",
  moveUp: "Move up",
  moveDown: "Move down",
};

export const EDITOR_STRINGS: Record<EditorLang, EditorUI> = { "zh-CN": zh, en };

/** 由主文件语言定编辑器默认界面语言：zh 开头 → zh-CN，其余/缺失 → en */
export function resolveEditorLang(siteLang?: string): EditorLang {
  return siteLang && /^zh/i.test(siteLang) ? "zh-CN" : "en";
}
