import katex from "katex";
import type { RichText, TextAnnotation } from "../lib/blocks";
import { BLOCK_COLOR_PALETTE, type BlockColorOption } from "../lib/color-palette";
import {
  applyInlineHref,
  applyInlineTextColor,
  blockPlainText,
  createEditorBlock,
  createRichText,
  escapeHtml,
  getRichTextPlainText,
  isRichTextBlock,
  mergeRichText,
  normalizeRichText,
  normalizeTableRows,
  rangeHasMark,
  rangeTextColor,
  richTextToHtml,
  sliceRichText,
  toggleInlineMark,
  type EditorBlock,
  type EditorBlockType,
  type EditorDocument,
  type EditorMeta,
  type EditorPageAppearance,
  type InlineMark,
} from "../lib/editor-document";

const STORAGE_KEY = "astro-bento-blog.post-editor.v2";
const IMAGE_MIN_DISPLAY_WIDTH = 120;
const IMAGE_MAX_DISPLAY_WIDTH = 760;

type Command = {
  target: string;
  title: string;
  hint: string;
  aliases: string[];
};

type SelectionSnapshot = {
  blockId: string;
  field: "richText" | "table-cell";
  row?: number;
  col?: number;
  start: number;
  end: number;
};

type BlockLocation = {
  block: EditorBlock;
  siblings: EditorBlock[];
  index: number;
  parent?: EditorBlock;
};

type BlockDragState = {
  sourceId: string;
  blockIds: string[];
  mode: "move" | "select";
  targetId: string;
  placement: "before" | "after" | "inside";
  moved: boolean;
};

type SlashState = {
  blockId: string;
  index: number;
  items: Command[];
  start: number;
  end: number;
};

type EmojiTarget = {
  mode: "page" | "block" | "inline" | "";
  blockId: string;
  insertionOffset?: number;
};

type EmojiRecord = {
  annotation: string;
  emoji: string;
  tags?: string[];
  group: number;
};

const EMOJI_GROUPS = [
  { id: 0, label: "표정", icon: "😀" },
  { id: 1, label: "사람", icon: "👋" },
  { id: 2, label: "동물", icon: "🐾" },
  { id: 3, label: "음식", icon: "🍜" },
  { id: 4, label: "여행", icon: "✈️" },
  { id: 5, label: "활동", icon: "⚽" },
  { id: 6, label: "사물", icon: "💡" },
  { id: 7, label: "기호", icon: "💬" },
  { id: 8, label: "깃발", icon: "🏳️" },
] as const;

const EMOJI_RECENT_KEY = "astro-bento-blog.post-editor.emoji-recents";
const COMMANDS: Command[] = [
  { target: "paragraph", title: "텍스트", hint: "기본 문단", aliases: ["text", "p", "텍스트", "문단"] },
  { target: "heading:1", title: "제목 1", hint: "큰 대목차", aliases: ["h1", "제목1"] },
  { target: "heading:2", title: "제목 2", hint: "중간 제목", aliases: ["h2", "제목2"] },
  { target: "heading:3", title: "제목 3", hint: "작은 제목", aliases: ["h3", "제목3"] },
  { target: "todo", title: "할 일", hint: "체크박스", aliases: ["todo", "check", "할일", "체크"] },
  { target: "toggle", title: "토글", hint: "접고 펼치는 목록", aliases: ["toggle", "토글", "접기"] },
  { target: "quote", title: "인용", hint: "인용문", aliases: ["quote", "인용"] },
  { target: "callout", title: "콜아웃", hint: "강조 메모", aliases: ["callout", "note", "콜아웃", "메모"] },
  { target: "code", title: "코드", hint: "코드 블록", aliases: ["code", "코드"] },
  { target: "divider", title: "구분선", hint: "수평선", aliases: ["divider", "hr", "구분선"] },
  { target: "table_of_contents", title: "목차", hint: "이 위치에 제목 목차 표시", aliases: ["toc", "contents", "목차"] },
  { target: "image", title: "이미지", hint: "이미지 URL", aliases: ["image", "img", "이미지"] },
  { target: "bookmark", title: "북마크", hint: "링크 미리보기", aliases: ["bookmark", "link", "북마크", "링크"] },
  { target: "equation", title: "수식", hint: "LaTeX 수식 블록", aliases: ["math", "equation", "latex", "수식"] },
  { target: "table", title: "표", hint: "3 x 3 편집 표", aliases: ["table", "표", "테이블"] },
  { target: "context", title: "맥락", hint: "배경과 전제 정리", aliases: ["context", "맥락", "컨텍스트"] },
  { target: "emoji-menu", title: "이모지", hint: "이모지 검색 및 삽입", aliases: ["emoji", "icon", "이모지", "아이콘"] },
];

const COLOR_OPTIONS: readonly BlockColorOption[] = BLOCK_COLOR_PALETTE;

const COVER_PRESETS = BLOCK_COLOR_PALETTE
  .filter(({ value }) => value !== "default")
  .map(({ value, background }) => ({ value: background, label: value }));

const RICH_TYPES: EditorBlockType[] = [
  "paragraph",
  "heading",
  "bulleted_list",
  "numbered_list",
  "todo",
  "toggle",
  "quote",
  "callout",
  "context",
];

function asElement(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : node.parentElement;
}

function clampHeadingLevel(value: unknown): 1 | 2 | 3 {
  const level = Number(value);
  return level === 2 || level === 3 ? level : 1;
}

function normalizeImageDisplayWidth(value: unknown): number | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  const width = Number(value);
  if (!Number.isFinite(width) || width <= 0) return undefined;
  return Math.round(Math.max(IMAGE_MIN_DISPLAY_WIDTH, Math.min(IMAGE_MAX_DISPLAY_WIDTH, width)));
}

function normalizeText(value = ""): string {
  return value.replace(/\u00a0/g, " ").replace(/\n{3,}/g, "\n\n");
}

function canonicalCssColor(value: string): string {
  if (!value) return "";
  const probe = document.createElement("span");
  probe.style.color = value;
  return probe.style.color.replace(/\s/g, "").toLowerCase();
}

function paletteColorName(value: string, mode: "text" | "background"): string {
  const canonical = canonicalCssColor(value);
  const option = COLOR_OPTIONS.find((item) =>
    canonicalCssColor(mode === "text" ? item.text : item.background) === canonical
  );
  return option?.value ?? value;
}

export function initPostEditor(): void {
  const root = document.querySelector<HTMLElement>("[data-editor]");
  if (!root) return;

  const blocksRoot = root.querySelector<HTMLElement>("[data-blocks]");
  const slashMenu = root.querySelector<HTMLElement>("[data-slash-menu]");
  const inlineToolbar = root.querySelector<HTMLElement>("[data-inline-toolbar]");
  const colorMenu = root.querySelector<HTMLElement>("[data-color-menu]");
  const emojiMenu = root.querySelector<HTMLElement>("[data-emoji-menu]");
  const coverMenu = root.querySelector<HTMLElement>("[data-cover-menu]");
  const editorPage = root.querySelector<HTMLElement>("[data-editor-page]");
  const pageCover = root.querySelector<HTMLElement>("[data-page-cover]");
  const coverMedia = root.querySelector<HTMLElement>("[data-cover-media]");
  const pageIconWrap = root.querySelector<HTMLElement>("[data-page-icon-wrap]");
  const pageIcon = root.querySelector<HTMLButtonElement>("[data-page-icon]");
  if (!blocksRoot || !slashMenu || !inlineToolbar || !colorMenu || !emojiMenu || !coverMenu || !editorPage || !pageCover || !coverMedia || !pageIconWrap || !pageIcon) return;

  const metaInputs = Array.from(root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-meta]"));
  const saveState = root.querySelector<HTMLElement>("[data-save-state]");
  const blockCount = root.querySelector<HTMLElement>("[data-block-count]");
  const slugPreview = root.querySelector<HTMLElement>("[data-derived-slug]");
  const datePreview = root.querySelector<HTMLElement>("[data-derived-date]");
  const jsonEditor = root.querySelector<HTMLTextAreaElement>("[data-json-editor]");
  const blockContextMenu = root.querySelector<HTMLElement>("[data-block-context-menu]");
  const jsonSize = root.querySelector<HTMLElement>("[data-json-size]");
  const toast = root.querySelector<HTMLElement>("[data-toast]");
  const jsonImport = root.querySelector<HTMLInputElement>("[data-json-import]");
  const statusPicker = root.querySelector<HTMLElement>("[data-status-picker]");
  const statusTrigger = root.querySelector<HTMLButtonElement>("[data-status-trigger]");
  const statusChips = root.querySelector<HTMLElement>("[data-status-chips]");
  const statusInput = root.querySelector<HTMLInputElement>("[data-status-input]");
  const statusMenu = root.querySelector<HTMLElement>("[data-status-menu]");

  const today = new Date().toISOString().slice(0, 10);
  let blocks: EditorBlock[] = [];
  let pageAppearance: EditorPageAppearance = {};
  let emojiData: EmojiRecord[] | null = null;
  let statuses: string[] = [];
  let emojiGroup = 0;
  let emojiTarget: EmojiTarget = { mode: "", blockId: "" };
  let selectedId = "";
  const selectedBlockIds = new Set<string>();
  let blockDragState: BlockDragState | null = null;
  let suppressNextHandleMenu = false;
  let saveTimer = 0;
  let jsonInputTimer = 0;
  let slashState: SlashState = {
    blockId: "",
    index: 0,
    items: [],
    start: 0,
    end: 0,
  };
  let savedSelection: SelectionSnapshot | null = null;
  let colorTarget: { mode: "block" | "text" | ""; blockIds: string[] } = {
    mode: "",
    blockIds: [],
  };

  function sampleDocument(): EditorDocument {
    return {
      version: 2,
      meta: {
        title: "제목 없는 engineering note",
        slug: "untitled-engineering-note",
        description: "로컬 블록 에디터에서 작성한 기술 노트입니다.",
        pubDate: today,
        category: "engineering",
        tags: "astro, notion, editor",
        status: ["draft"],
      },
      page: {
        icon: "🧠",
        cover: { type: "color", value: "#eaf4ff", position: 50 },
      },
      blocks: [
        createEditorBlock("heading", "문제 정의", { level: 1 }),
        createEditorBlock("paragraph", "먼저 맥락을 적고, 한 블록에는 한 가지 생각만 넣습니다."),
        createEditorBlock("callout", "이 에디터는 리치 텍스트와 블록 속성을 JSON v2로 저장합니다.", {
          backgroundColor: "teal",
        }),
        createEditorBlock("heading", "구현 메모", { level: 2 }),
        createEditorBlock("bulleted_list", "/를 입력하면 블록 명령 메뉴를 검색할 수 있습니다."),
        createEditorBlock("todo", "JSON으로 저장해 게시 파이프라인에 전달하기"),
        createEditorBlock("equation", "E = mc^2"),
        createEditorBlock("table", "", {
          rows: normalizeTableRows([
            ["항목", "상태", "메모"],
            ["수식", "완료", "LaTeX"],
            ["표", "완료", "리치 텍스트 셀"],
          ]),
        }),
        createEditorBlock("code", "npm run build", { language: "bash" }),
      ],
    };
  }

  function normalizeStatuses(value: unknown): string[] {
    const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
    return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))];
  }

  function setStatusMenu(open: boolean): void {
    if (!statusMenu || !statusTrigger) return;
    statusMenu.hidden = !open;
    statusTrigger.setAttribute("aria-expanded", String(open));
  }

  function renderStatusPicker(): void {
    if (!statusChips || !statusTrigger) return;
    statusTrigger.textContent = statuses.length ? `\uC0C1\uD0DC ${statuses.length}\uAC1C \uC120\uD0DD\uB428` : "\uC0C1\uD0DC \uC120\uD0DD";
    statusChips.replaceChildren(...statuses.map((status) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "status-picker__chip";
      chip.dataset.statusRemove = status;
      chip.setAttribute("aria-label", `${status} \uC81C\uAC70`);
      chip.textContent = `${status} x`;
      return chip;
    }));
    root.querySelectorAll<HTMLButtonElement>("[data-status-option]").forEach((option) => {
      const selected = statuses.includes(option.dataset.statusOption ?? "");
      option.setAttribute("aria-pressed", String(selected));
      option.classList.toggle("is-selected", selected);
    });
  }

  function getMeta(): EditorMeta {
    return {
      ...Object.fromEntries(metaInputs.map((input) => [input.dataset.meta ?? "", input.value.trim()])),
      status: [...statuses],
    } as EditorMeta;
  }

  function setMeta(meta: Partial<EditorMeta>): void {
    metaInputs.forEach((input) => {
      const value = meta[input.dataset.meta as keyof EditorMeta];
      input.value = typeof value === "string" ? value : "";
    });
    if (meta.status !== undefined) statuses = normalizeStatuses(meta.status);
    renderStatusPicker();
  }

  function slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .replace(/^-+|-+$/g, "") || "untitled";
  }

  function renderPageAppearance(): void {
    const cover = pageAppearance.cover;
    const hasCover = Boolean(cover?.value);
    pageCover.hidden = !hasCover;
    editorPage.classList.toggle("editor-page--has-cover", hasCover);
    coverMedia.style.background = "";
    coverMedia.style.backgroundImage = "";
    coverMedia.style.backgroundPosition = "";
    if (cover?.type === "color") coverMedia.style.background = cover.value;
    if (cover?.type === "image") {
      coverMedia.style.backgroundImage = `url(${JSON.stringify(cover.value)})`;
      coverMedia.style.backgroundPosition = `center ${cover.position ?? 50}%`;
    }

    const hasIcon = Boolean(pageAppearance.icon);
    pageIconWrap.hidden = !hasIcon;
    pageIcon.textContent = pageAppearance.icon ?? "";
    root.querySelectorAll<HTMLElement>("[data-page-action='add-icon']").forEach((button) => {
      button.hidden = hasIcon;
    });
    root.querySelectorAll<HTMLElement>("[data-page-action='add-cover']").forEach((button) => {
      button.hidden = hasCover;
    });
  }

  function blockBackgroundClass(block: EditorBlock): string {
    return block.backgroundColor ? ` editor-block--background-${block.backgroundColor}` : "";
  }

  function selectedClass(block: EditorBlock): string {
    return selectedBlockIds.has(block.id) || selectedId === block.id ? " editor-block--selected" : "";
  }

  function syncBlockSelectionUI(): void {
    blocksRoot.querySelectorAll<HTMLElement>("[data-id]").forEach((element) => {
      const blockId = element.dataset.id ?? "";
      element.classList.toggle("editor-block--selected", selectedBlockIds.has(blockId) || selectedId === blockId);
    });
  }

  function setSelectedBlockIds(blockIds: string[]): void {
    selectedBlockIds.clear();
    blockIds.forEach((blockId) => selectedBlockIds.add(blockId));
    syncBlockSelectionUI();
  }

  function richRootMarkup(block: EditorBlock, placeholder: string, tag: "div" | "span" = "div"): string {
    return `<${tag} class="editor-text" contenteditable="true" spellcheck="true" data-rich-root data-owner-id="${block.id}" data-field="richText" data-placeholder="${escapeHtml(placeholder)}">${richTextToHtml(block.richText)}</${tag}>`;
  }

  function renderControls(): string {
    return `<div class="editor-block__controls" aria-label="Block controls">
      <button type="button" data-block-action="add-after" title="Add block below" aria-label="Add block below">+</button>
      <button type="button" class="editor-block__drag-handle" data-block-action="drag" title="Drag to move. Shift-drag to select multiple blocks." aria-label="Drag to move. Shift-drag to select multiple blocks.">
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      </button>
    </div>`;
  }
  function renderTable(block: EditorBlock): string {
    const rows = normalizeTableRows(block.rows);
    return `<div class="editor-table-wrap">
      <table class="editor-table">
        <tbody>
          ${rows.map((row, rowIndex) => `<tr>${row.map((cell, colIndex) => `
            <td>
              <div
                contenteditable="true"
                spellcheck="true"
                data-rich-root
                data-field="table-cell"
                data-row="${rowIndex}"
                data-col="${colIndex}"
              >${richTextToHtml(cell.richText)}</div>
            </td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
      <div class="editor-table-actions">
        <button type="button" data-table-action="add-row">행 추가</button>
        <button type="button" data-table-action="add-col">열 추가</button>
        <button type="button" data-table-action="remove-row">행 삭제</button>
        <button type="button" data-table-action="remove-col">열 삭제</button>
      </div>
    </div>`;
  }

  function renderEquationHtml(expression: string): string {
    return katex.renderToString(expression || "\\square", {
      displayMode: true,
      throwOnError: false,
      errorColor: "#a4473f",
      output: "htmlAndMathml",
      strict: "warn",
    });
  }

  function renderBlock(block: EditorBlock, depth: number, childrenMarkup = ""): string {
    const shellClass = `${blockBackgroundClass(block)}${selectedClass(block)}`;
    if (block.type === "divider") {
      return `<section class="editor-block editor-block--divider${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}<hr />
      </section>`;
    }

    if (block.type === "image") {
      const imageSrc = block.src?.trim() ?? "";
      const displayWidth = normalizeImageDisplayWidth(block.displayWidth);
      const widthStyle = displayWidth ? ` style="--editor-image-width: ${displayWidth}px"` : "";
      return `<section class="editor-block editor-block--image${imageSrc ? "" : " editor-block--image-empty"}${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}
        <div class="editor-image-surface">
          <div class="editor-image-stage" data-image-stage>
            <div class="editor-image-preview${imageSrc ? "" : " is-empty"}" data-image-preview${widthStyle}>
              <img data-image-preview-image src="${escapeHtml(imageSrc)}" alt="${escapeHtml(block.alt ?? "")}"${imageSrc ? "" : " hidden"} />
              <output class="editor-image-size-label" data-image-size-label>${displayWidth ? `${displayWidth}px` : "\uBCF8\uBB38 \uB108\uBE44"}</output>
              <button type="button" class="editor-image-resize-handle editor-image-resize-handle--left" data-image-resize="left" aria-label="\uC774\uBBF8\uC9C0 \uD06C\uAE30 \uC870\uC808"></button>
              <button type="button" class="editor-image-resize-handle editor-image-resize-handle--right" data-image-resize="right" aria-label="\uC774\uBBF8\uC9C0 \uD06C\uAE30 \uC870\uC808"></button>
            </div>
          </div>
          <div class="editor-image-fields">
            <label><span>이미지 URL</span><input data-field="src" value="${escapeHtml(block.src ?? "")}" placeholder="/image.webp" /></label>
            <label><span>대체 텍스트</span><textarea data-field="alt" rows="2" placeholder="이미지 설명">${escapeHtml(block.alt ?? "")}</textarea></label>
            <label><span>캡션</span><textarea data-field="caption" rows="2" placeholder="선택 사항">${escapeHtml(getRichTextPlainText(block.caption))}</textarea></label>
            <div class="drive-image-upload" data-drive-image-actions>
              <label class="hero-image-toggle">
                <input type="checkbox" data-field="isHeroImage" ${block.isHeroImage ? "checked" : ""} />
                <span>\uB300\uD45C \uC774\uBBF8\uC9C0 \uC124\uC815</span>
              </label>
              <div class="editor-image-size-control">
                <label><span>\uD45C\uC2DC \uD3ED</span><input type="number" inputmode="numeric" data-image-width min="${IMAGE_MIN_DISPLAY_WIDTH}" max="${IMAGE_MAX_DISPLAY_WIDTH}" step="10" value="${displayWidth ?? ""}" placeholder="\uBCF8\uBB38 \uB108\uBE44" /></label>
                <button type="button" data-image-width-reset>\uBCF8\uBB38 \uB108\uBE44\uB85C \uB418\uB3CC\uB9AC\uAE30</button>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    }

    if (block.type === "bookmark") {
      return `<section class="editor-block editor-block--bookmark${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}
        <label><span>URL</span><input data-field="url" value="${escapeHtml(block.url ?? "")}" /></label>
        <label><span>제목</span><input data-field="title" value="${escapeHtml(block.title ?? "Bookmark")}" /></label>
        <label><span>설명</span><input data-field="description" value="${escapeHtml(block.description ?? "")}" /></label>
      </section>`;
    }

    if (block.type === "equation") {
      const equation = block.equation ?? "";
      return `<section class="editor-block editor-block--equation${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}
        <textarea class="editor-equation-input" data-field="equation" rows="3" spellcheck="false" placeholder="E = mc^2">${escapeHtml(equation)}</textarea>
        <div class="editor-equation-preview" data-equation-preview aria-label="수식 미리보기">${renderEquationHtml(equation)}</div>
      </section>`;
    }

    if (block.type === "table") {
      return `<section class="editor-block editor-block--table${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}${renderTable(block)}
      </section>`;
    }

    if (block.type === "toggle") {
      const isOpen = block.isOpen === true;
      return `<section class="editor-block editor-block--toggle${shellClass}" data-id="${block.id}" data-depth="${depth}">${renderControls()}<section class="editor-toggle"><div class="editor-toggle__header"><button type="button" class="editor-toggle__disclosure" data-toggle-action="toggle" aria-label="토글 내용 ${isOpen ? "접기" : "펼치기"}" aria-expanded="${isOpen}"></button>${richRootMarkup(block, "토글 제목", "span")}</div><div class="editor-block-children editor-toggle__children"${isOpen ? "" : " hidden"}>${childrenMarkup || `<button type="button" class="editor-toggle__empty" data-toggle-empty>내용을 입력하세요</button>`}</div></section></section>`;
    }

    if (block.type === "table_of_contents") {
      return `<section class="editor-block editor-block--table-of-contents${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}
        <div class="editor-toc-preview">
          <strong>목차</strong>
          <span>게시 시 이 위치에서 문서의 제목을 Bento 카드로 표시합니다.</span>
        </div>
      </section>`;
    }

    if (block.type === "context") {
      return `<section class="editor-block editor-block--context${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}
        <input class="editor-context-title" data-field="title" value="${escapeHtml(block.title ?? "맥락")}" aria-label="맥락 제목" />
        ${richRootMarkup(block, "배경, 전제, 참고 맥락을 적습니다.")}
      </section>`;
    }

    if (block.type === "code") {
      return `<section class="editor-block editor-block--code${shellClass}" data-id="${block.id}" data-depth="${depth}">
        ${renderControls()}
        <input class="editor-code-lang" data-field="language" value="${escapeHtml(block.language ?? "text")}" aria-label="코드 언어" />
        <textarea data-field="code" rows="5" spellcheck="false">${escapeHtml(block.code ?? "")}</textarea>
      </section>`;
    }

    const tag = block.type === "heading" ? `h${block.level ?? 1}` : "div";
    const checkbox = block.type === "todo"
      ? `<input type="checkbox" data-field="checked" ${block.checked ? "checked" : ""} aria-label="완료" />`
      : "";
    return `<section class="editor-block editor-block--${block.type}${shellClass}" data-id="${block.id}" data-depth="${depth}">
      ${renderControls()}
      <div class="editor-line">
        ${checkbox}
        <${tag}
          class="editor-text"
          contenteditable="true"
          spellcheck="true"
          data-rich-root
          data-owner-id="${block.id}"
          data-field="richText"
          data-placeholder="/ 입력으로 블록 추가"
        >${richTextToHtml(block.richText)}</${tag}>
      </div>
    </section>`;
  }

  function renderBlockTree(block: EditorBlock, depth = 0): string {
    const children = block.children?.length
      ? `<div class="editor-block-children">${block.children.map((child) => renderBlockTree(child, depth + 1)).join("")}</div>`
      : "";
    return block.type === "toggle"
      ? renderBlock(block, depth, children)
      : `${renderBlock(block, depth)}${children}`;
  }

  function render(): void {
    renderPageAppearance();
    blocksRoot.innerHTML = blocks.map((block) => renderBlockTree(block)).join("");
    bindBlocks();
    syncOutput();
  }

  function parseEditable(editable: HTMLElement): RichText[] {
    const parts: RichText[] = [];

    function append(text: string, template: Omit<RichText, "text">): void {
      if (!text) return;
      parts.push({ text: normalizeText(text), ...template });
    }

    function walk(node: Node, inherited: Omit<RichText, "text"> = {}): void {
      if (node.nodeType === Node.TEXT_NODE) {
        append(node.nodeValue ?? "", inherited);
        return;
      }
      if (!(node instanceof HTMLElement)) return;
      if (node.tagName === "BR") {
        append("\n", inherited);
        return;
      }

      const annotations: TextAnnotation = { ...(inherited.annotations ?? {}) };
      const tag = node.tagName;
      if (tag === "B" || tag === "STRONG" || node.classList.contains("is-bold")) annotations.bold = true;
      if (tag === "I" || tag === "EM" || node.classList.contains("is-italic")) annotations.italic = true;
      if (tag === "U" || node.classList.contains("is-underline")) annotations.underline = true;
      if (tag === "S" || tag === "STRIKE" || node.classList.contains("is-strike")) annotations.strike = true;
      if (tag === "CODE" || node.classList.contains("is-code")) annotations.code = true;
      const next: Omit<RichText, "text"> = {
        ...inherited,
        annotations: Object.keys(annotations).length ? annotations : undefined,
      };
      const sourceTextColor = node.dataset.textColor || node.style.color || node.getAttribute("color") || "";
      const sourceBackground = node.dataset.backgroundColor || node.style.backgroundColor || "";
      const sourceHref = node.dataset.href || (node instanceof HTMLAnchorElement ? node.href : "");
      if (sourceTextColor) next.textColor = paletteColorName(sourceTextColor, "text");
      if (sourceBackground) next.backgroundColor = paletteColorName(sourceBackground, "background");
      if (sourceHref) next.href = sourceHref;

      const before = parts.length;
      Array.from(node.childNodes).forEach((child) => walk(child, next));
      if (
        (tag === "DIV" || tag === "P") &&
        node.nextSibling &&
        parts.length > before &&
        !parts.at(-1)?.text.endsWith("\n")
      ) {
        append("\n", next);
      }
    }

    Array.from(editable.childNodes).forEach((child) => walk(child));
    return mergeRichText(parts);
  }


  function normalizeStoredBlock(rawValue: unknown): EditorBlock | null {
    if (!rawValue || typeof rawValue !== "object") return null;
    const raw = rawValue as Record<string, unknown>;
    const rawType = String(raw.type ?? "paragraph") as EditorBlockType;
    const type = RICH_TYPES.includes(rawType) || [
      "code",
      "divider",
      "image",
      "bookmark",
      "equation",
      "table",
      "table_of_contents",
    ].includes(rawType)
      ? rawType
      : "paragraph";
    const richText = Array.isArray(raw.richText)
      ? normalizeRichText(raw.richText)
      : [];
    const backgroundColor = typeof raw.backgroundColor === "string"
      ? raw.backgroundColor
      : undefined;
    const options: Partial<EditorBlock> = {
      backgroundColor,
      textColor: typeof raw.textColor === "string" ? raw.textColor : undefined,
    };

    if (isRichTextBlock(type)) options.richText = richText;
    if (type === "heading") options.level = clampHeadingLevel(raw.level);
    if (type === "todo") options.checked = Boolean(raw.checked);
    if (type === "callout") options.icon = String(raw.icon ?? "i");
    if (type === "code") {
      options.code = String(raw.code ?? "");
      options.language = String(raw.language ?? "text");
    }
    if (type === "equation") options.equation = String(raw.equation ?? "E = mc^2");
    if (type === "image") {
      options.src = String(raw.src ?? "");
      options.alt = String(raw.alt ?? "");
      options.caption = normalizeRichText(raw.caption, typeof raw.caption === "string" ? raw.caption : "");
      options.isHeroImage = raw.isHeroImage === true;
      options.displayWidth = normalizeImageDisplayWidth(raw.displayWidth);
    }
    if (type === "bookmark") {
      options.url = String(raw.url ?? "https://example.com");
      options.title = String(raw.title ?? "Bookmark");
      options.description = String(raw.description ?? "");
    }
    if (type === "table") {
      options.rows = normalizeTableRows(raw.rows);
      options.hasHeaderRow = raw.hasHeaderRow !== false;
    }
    if (type === "context") options.title = String(raw.title ?? "맥락");

    const block = createEditorBlock(type, "", options);
    block.id = typeof raw.id === "string" && raw.id ? raw.id : block.id;
    if (isRichTextBlock(type)) block.richText = richText;
    if (backgroundColor) block.backgroundColor = backgroundColor;
    const children = Array.isArray(raw.children)
      ? raw.children.map(normalizeStoredBlock).filter((child): child is EditorBlock => Boolean(child))
      : [];
    if (children.length) block.children = children;
    return block;
  }

  function normalizePageAppearance(value: unknown): EditorPageAppearance {
    if (!value || typeof value !== "object") return {};
    const raw = value as Record<string, unknown>;
    const appearance: EditorPageAppearance = {};
    if (typeof raw.icon === "string" && raw.icon) appearance.icon = raw.icon;
    if (raw.cover && typeof raw.cover === "object") {
      const cover = raw.cover as Record<string, unknown>;
      const type = cover.type === "image" ? "image" : "color";
      const coverValue = typeof cover.value === "string" ? cover.value : "";
      if (coverValue) {
        appearance.cover = {
          type,
          value: coverValue,
          position: Math.max(0, Math.min(100, Number(cover.position ?? 50))),
        };
      }
    }
    return appearance;
  }

  function normalizeStoredDocument(rawValue: unknown): EditorDocument {
    const fallback = sampleDocument();
    if (!rawValue || typeof rawValue !== "object") return fallback;
    const raw = rawValue as Record<string, unknown>;
    const rawMeta = raw.meta && typeof raw.meta === "object"
      ? raw.meta as Record<string, unknown>
      : {};
    const storedBlocks = Array.isArray(raw.blocks)
      ? raw.blocks.map(normalizeStoredBlock).filter((block): block is EditorBlock => Boolean(block))
      : [];
    const heroImages: EditorBlock[] = [];
    const collectHeroImages = (items: EditorBlock[]): void => {
      items.forEach((block) => {
        if (block.type === "image" && block.isHeroImage) heroImages.push(block);
        if (block.children?.length) collectHeroImages(block.children);
      });
    };
    collectHeroImages(storedBlocks);
    if (heroImages.length > 1) heroImages.forEach((block) => { delete block.isHeroImage; });
    return {
      version: 2,
      meta: {
        title: String(rawMeta.title ?? fallback.meta.title),
        slug: String(rawMeta.slug ?? ""),
        description: String(rawMeta.description ?? ""),
        pubDate: String(rawMeta.pubDate ?? today),
        category: String(rawMeta.category ?? ""),
        tags: String(rawMeta.tags ?? ""),
        status: normalizeStatuses(rawMeta.status ?? rawMeta.badge),
      },
      page: normalizePageAppearance(raw.page),
      blocks: storedBlocks.length ? storedBlocks : fallback.blocks,
    };
  }

  function loadDocument(): EditorDocument {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return sampleDocument();
    try {
      return normalizeStoredDocument(JSON.parse(stored));
    } catch {
      return sampleDocument();
    }
  }

  function findBlockLocation(
    id: string,
    siblings: EditorBlock[] = blocks,
    parent?: EditorBlock,
  ): BlockLocation | undefined {
    for (let index = 0; index < siblings.length; index += 1) {
      const block = siblings[index];
      if (block.id === id) return { block, siblings, index, parent };
      const child = findBlockLocation(id, block.children ?? [], block);
      if (child) return child;
    }
    return undefined;
  }

  function getBlock(id: string): EditorBlock | undefined {
    return findBlockLocation(id)?.block;
  }

  function getSnapshotRichText(snapshot: SelectionSnapshot): RichText[] {
    const block = getBlock(snapshot.blockId);
    if (!block) return [];
    if (snapshot.field === "table-cell") {
      const rows = normalizeTableRows(block.rows);
      return rows[snapshot.row ?? -1]?.[snapshot.col ?? -1]?.richText ?? [];
    }
    return block.richText ?? [];
  }

  function setSnapshotRichText(snapshot: SelectionSnapshot, value: RichText[]): void {
    const block = getBlock(snapshot.blockId);
    if (!block) return;
    if (snapshot.field === "table-cell") {
      const rows = normalizeTableRows(block.rows);
      const cell = rows[snapshot.row ?? -1]?.[snapshot.col ?? -1];
      if (cell) cell.richText = mergeRichText(value);
      block.rows = rows;
      return;
    }
    block.richText = mergeRichText(value);
  }

  function rootSelector(snapshot: SelectionSnapshot): string {
    if (snapshot.field === "table-cell") {
      return `[data-id="${snapshot.blockId}"] [data-rich-root][data-row="${snapshot.row}"][data-col="${snapshot.col}"]`;
    }
    return `[data-id="${snapshot.blockId}"] [data-rich-root][data-field="richText"]`;
  }

  function findSnapshotRoot(snapshot: SelectionSnapshot): HTMLElement | null {
    return blocksRoot.querySelector<HTMLElement>(rootSelector(snapshot));
  }

  function pointOffset(container: HTMLElement, node: Node, offset: number): number {
    const range = document.createRange();
    range.setStart(container, 0);
    try {
      range.setEnd(node, offset);
      return range.toString().length;
    } catch {
      return 0;
    }
  }

  function captureSelection(allowCollapsed = false): SelectionSnapshot | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || (!allowCollapsed && selection.isCollapsed)) return null;
    const anchorRoot = asElement(selection.anchorNode)?.closest<HTMLElement>("[data-rich-root]");
    const focusRoot = asElement(selection.focusNode)?.closest<HTMLElement>("[data-rich-root]");
    if (!anchorRoot || anchorRoot !== focusRoot || !root.contains(anchorRoot)) return null;
    const blockElement = anchorRoot.closest<HTMLElement>("[data-id]");
    if (!blockElement?.dataset.id || !selection.anchorNode || !selection.focusNode) return null;
    const anchorOffset = pointOffset(anchorRoot, selection.anchorNode, selection.anchorOffset);
    const focusOffset = pointOffset(anchorRoot, selection.focusNode, selection.focusOffset);
    const field = anchorRoot.dataset.field === "table-cell" ? "table-cell" : "richText";
    return {
      blockId: blockElement.dataset.id,
      field,
      row: field === "table-cell" ? Number(anchorRoot.dataset.row) : undefined,
      col: field === "table-cell" ? Number(anchorRoot.dataset.col) : undefined,
      start: Math.min(anchorOffset, focusOffset),
      end: Math.max(anchorOffset, focusOffset),
    };
  }

  function textPoint(container: HTMLElement, offset: number): { node: Node; offset: number } {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let remaining = Math.max(0, offset);
    let current = walker.nextNode();
    let last: Node | null = null;
    while (current) {
      last = current;
      const length = current.nodeValue?.length ?? 0;
      if (remaining <= length) return { node: current, offset: remaining };
      remaining -= length;
      current = walker.nextNode();
    }
    if (last) return { node: last, offset: last.nodeValue?.length ?? 0 };
    return { node: container, offset: 0 };
  }

  function restoreSelection(snapshot: SelectionSnapshot): boolean {
    const editable = findSnapshotRoot(snapshot);
    if (!editable) return false;
    const start = textPoint(editable, snapshot.start);
    const end = textPoint(editable, snapshot.end);
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    editable.focus();
    return true;
  }

  function updateToolbarState(snapshot: SelectionSnapshot): void {
    const value = getSnapshotRichText(snapshot);
    inlineToolbar.querySelectorAll<HTMLButtonElement>("[data-inline-mark]").forEach((button) => {
      const mark = button.dataset.inlineMark as InlineMark;
      const active = rangeHasMark(value, snapshot.start, snapshot.end, mark);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const color = rangeTextColor(value, snapshot.start, snapshot.end);
    inlineToolbar.style.setProperty("--active-text-color", colorOption(color).text);
  }

  function positionFloating(element: HTMLElement, rect: DOMRect, placement: "above" | "below"): void {
    element.hidden = false;
    const gap = 8;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const preferredTop = placement === "above" ? rect.top - height - gap : rect.bottom + gap;
    const alternateTop = placement === "above" ? rect.bottom + gap : rect.top - height - gap;
    const top = preferredTop >= 10 && preferredTop + height <= window.innerHeight - 10
      ? preferredTop
      : alternateTop;
    const centeredLeft = rect.left + rect.width / 2 - width / 2;
    element.style.left = `${Math.max(10, Math.min(centeredLeft, window.innerWidth - width - 10))}px`;
    element.style.top = `${Math.max(10, Math.min(top, window.innerHeight - height - 10))}px`;
  }

  function showInlineToolbar(rectOverride?: DOMRect): boolean {
    const snapshot = captureSelection();
    const selection = window.getSelection();
    if (!snapshot || !selection || selection.rangeCount === 0) {
      hideInlineToolbar();
      return false;
    }
    savedSelection = snapshot;
    updateToolbarState(snapshot);
    positionFloating(inlineToolbar, rectOverride ?? selection.getRangeAt(0).getBoundingClientRect(), "above");
    return true;
  }

  function hideInlineToolbar(): void {
    inlineToolbar.hidden = true;
  }

  function hideColorMenu(): void {
    colorMenu.hidden = true;
    colorTarget = { mode: "", blockIds: [] };
  }

  function hideEmojiMenu(): void {
    emojiMenu.hidden = true;
    emojiTarget = { mode: "", blockId: "" };
  }

  function hideCoverMenu(): void {
    coverMenu.hidden = true;
  }

  function getRecentEmojis(): string[] {
    try {
      const stored = JSON.parse(localStorage.getItem(EMOJI_RECENT_KEY) ?? "[]");
      return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string").slice(0, 24) : [];
    } catch {
      return [];
    }
  }

  function rememberEmoji(unicode: string): void {
    const next = [unicode, ...getRecentEmojis().filter((item) => item !== unicode)].slice(0, 24);
    localStorage.setItem(EMOJI_RECENT_KEY, JSON.stringify(next));
  }

  function emojiMatches(record: EmojiRecord, query: string): boolean {
    if (!query) return true;
    const haystack = [record.annotation, ...(record.tags ?? [])].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  function visibleEmojis(query: string): EmojiRecord[] {
    if (!emojiData) return [];
    if (query) return emojiData.filter((record) => emojiMatches(record, query)).slice(0, 240);
    if (emojiGroup === -1) {
      const recent = getRecentEmojis();
      return recent.map((emoji) => emojiData.find((record) => record.emoji === emoji)).filter((record): record is EmojiRecord => Boolean(record));
    }
    return emojiData.filter((record) => record.group === emojiGroup).slice(0, 240);
  }

  function renderEmojiPicker(query = ""): void {
    const records = visibleEmojis(query);
    const emptyLabel = query ? "검색 결과가 없습니다." : "최근 사용한 이모지가 없습니다.";
    emojiMenu.innerHTML = `<section class="emoji-picker" aria-label="이모지 선택기">
      <div class="emoji-picker__search-row">
        <input type="search" data-emoji-search value="${escapeHtml(query)}" placeholder="이모지 검색" aria-label="이모지 검색" autocomplete="off" />
      </div>
      <div class="emoji-picker__tabs" role="tablist" aria-label="이모지 분류">
        <button type="button" class="emoji-picker__tab${emojiGroup === -1 && !query ? " is-active" : ""}" data-emoji-group="-1" title="최근 사용">◷</button>
        ${EMOJI_GROUPS.map((group) => `<button type="button" class="emoji-picker__tab${emojiGroup === group.id && !query ? " is-active" : ""}" data-emoji-group="${group.id}" title="${group.label}">${group.icon}</button>`).join("")}
      </div>
      <div class="emoji-picker__grid" role="grid">
        ${records.length ? records.map((record) => `<button type="button" class="emoji-picker__emoji" data-emoji-value="${encodeURIComponent(record.emoji)}" title="${escapeHtml(record.annotation)}" aria-label="${escapeHtml(record.annotation)}">${record.emoji}</button>`).join("") : `<p class="emoji-picker__empty">${emptyLabel}</p>`}
      </div>
    </section>`;

    emojiMenu.querySelector<HTMLInputElement>("[data-emoji-search]")?.addEventListener("input", (event) => {
      const input = event.currentTarget;
      renderEmojiPicker(input.value);
      window.requestAnimationFrame(() => {
        const nextInput = emojiMenu.querySelector<HTMLInputElement>("[data-emoji-search]");
        nextInput?.focus();
        nextInput?.setSelectionRange(input.value.length, input.value.length);
      });
    });
    emojiMenu.querySelectorAll<HTMLButtonElement>("[data-emoji-group]").forEach((button) => {
      button.addEventListener("click", () => {
        emojiGroup = Number(button.dataset.emojiGroup);
        renderEmojiPicker();
      });
    });
    emojiMenu.querySelectorAll<HTMLButtonElement>("[data-emoji-value]").forEach((button) => {
      button.addEventListener("click", () => applyEmoji(decodeURIComponent(button.dataset.emojiValue ?? "")));
    });
  }

  async function ensureEmojiPicker(): Promise<void> {
    if (!emojiData) {
      emojiMenu.innerHTML = `<div class="emoji-popover__loading">이모지 데이터를 불러오는 중입니다.</div>`;
      const response = await fetch(`${import.meta.env.BASE_URL}data/emoji-ko.json`);
      if (!response.ok) throw new Error(`Emoji data request failed: ${response.status}`);
      const source: unknown = await response.json();
      if (!Array.isArray(source)) throw new Error("Emoji data is not an array");
      emojiData = source.filter((item): item is EmojiRecord =>
        Boolean(item) && typeof item === "object" && typeof (item as EmojiRecord).emoji === "string" && typeof (item as EmojiRecord).annotation === "string"
      );
      if (!emojiData.length) throw new Error("Emoji data is empty");
    }
    renderEmojiPicker();
  }

  async function openEmojiMenu(mode: "page" | "block" | "inline", blockId: string, anchor: HTMLElement, insertionOffset?: number): Promise<void> {
    hideColorMenu();
    hideCoverMenu();
    hideBlockContextMenu();
    emojiTarget = { mode, blockId, insertionOffset };
    emojiMenu.hidden = false;
    positionFloating(emojiMenu, anchor.getBoundingClientRect(), "below");
    try {
      await ensureEmojiPicker();
      positionFloating(emojiMenu, anchor.getBoundingClientRect(), "below");
      emojiMenu.querySelector<HTMLInputElement>("[data-emoji-search]")?.focus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "알 수 없는 오류";
      emojiMenu.innerHTML = `<div class="emoji-popover__error">이모지 데이터를 불러오지 못했습니다.<br />${escapeHtml(message)}</div>`;
      positionFloating(emojiMenu, anchor.getBoundingClientRect(), "below");
    }
  }

  function applyEmoji(unicode: string): void {
    if (!unicode) return;
    rememberEmoji(unicode);
    if (emojiTarget.mode === "page") {
      pageAppearance.icon = unicode;
      renderPageAppearance();
      syncOutput();
      scheduleSave();
    }
    if (emojiTarget.mode === "block") {
      const block = getBlock(emojiTarget.blockId);
      if (block && isRichTextBlock(block.type)) {
        block.richText = createRichText(unicode);
        selectedId = block.id;
        render();
        window.requestAnimationFrame(() => focusBlock(block.id, true));
        scheduleSave();
      }
    }
    if (emojiTarget.mode === "inline") {
      const block = getBlock(emojiTarget.blockId);
      if (block && isRichTextBlock(block.type)) {
        const offset = emojiTarget.insertionOffset ?? getRichTextPlainText(block.richText).length;
        block.richText = mergeRichText([
          ...sliceRichText(block.richText, 0, offset),
          ...createRichText(unicode),
          ...sliceRichText(block.richText, offset),
        ]);
        selectedId = block.id;
        render();
        window.requestAnimationFrame(() => {
          restoreSelection({ blockId: block.id, field: "richText", start: offset + unicode.length, end: offset + unicode.length });
        });
        scheduleSave();
      }
    }
    hideEmojiMenu();
  }

  function coverMenuMarkup(): string {
    const cover = pageAppearance.cover;
    const position = cover?.position ?? 50;
    return `<div class="cover-menu__title">커버</div>
      <div class="cover-menu__section">
        <span class="cover-menu__label">색상</span>
        <div class="cover-menu__swatches">
          ${COVER_PRESETS.map((preset) => `<button class="cover-menu__swatch${cover?.type === "color" && cover.value === preset.value ? " is-active" : ""}" type="button" data-cover-color="${preset.value}" title="${preset.label}" style="background:${preset.value}"></button>`).join("")}
        </div>
      </div>
      <form class="cover-menu__section" data-cover-url-form>
        <label class="cover-menu__label" for="cover-url">이미지 링크</label>
        <div class="cover-menu__url-row">
          <input id="cover-url" name="coverUrl" type="url" placeholder="https://..." value="${cover?.type === "image" && !cover.value.startsWith("data:") ? escapeHtml(cover.value) : ""}" />
          <button type="submit">적용</button>
        </div>
      </form>
      <label class="cover-menu__upload">
        <span>파일 업로드</span>
        <input type="file" accept="image/*" data-cover-file hidden />
      </label>
      ${cover?.type === "image" ? `<label class="cover-menu__position">
        <span>세로 위치</span>
        <input type="range" min="0" max="100" value="${position}" data-cover-position />
      </label>` : ""}
      ${cover ? `<button type="button" class="cover-menu__remove" data-cover-remove>커버 제거</button>` : ""}`;
  }

  function openCoverMenu(anchor: HTMLElement): void {
    hideColorMenu();
    hideEmojiMenu();
    coverMenu.innerHTML = coverMenuMarkup();
    bindCoverMenu();
    positionFloating(coverMenu, anchor.getBoundingClientRect(), "below");
  }

  function bindCoverMenu(): void {
    coverMenu.querySelectorAll<HTMLButtonElement>("[data-cover-color]").forEach((button) => {
      button.addEventListener("click", () => {
        pageAppearance.cover = { type: "color", value: button.dataset.coverColor ?? "#eaf4ff", position: 50 };
        renderPageAppearance();
        syncOutput();
        scheduleSave();
        hideCoverMenu();
      });
    });
    coverMenu.querySelector<HTMLFormElement>("[data-cover-url-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const value = String(data.get("coverUrl") ?? "").trim();
      if (!value) return;
      pageAppearance.cover = { type: "image", value, position: 50 };
      renderPageAppearance();
      syncOutput();
      scheduleSave();
      hideCoverMenu();
    });
    coverMenu.querySelector<HTMLInputElement>("[data-cover-file]")?.addEventListener("change", async (event) => {
      const input = event.currentTarget;
      const file = input.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("이미지 파일만 사용할 수 있습니다.");
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        showToast("12MB 이하 이미지를 선택해 주세요.");
        return;
      }
      try {
        const value = await coverFileToDataUrl(file);
        pageAppearance.cover = { type: "image", value, position: 50 };
        renderPageAppearance();
        syncOutput();
        scheduleSave();
        hideCoverMenu();
      } catch {
        showToast("커버 이미지를 처리하지 못했습니다.");
      }
    });
    coverMenu.querySelector<HTMLInputElement>("[data-cover-position]")?.addEventListener("input", (event) => {
      if (!pageAppearance.cover) return;
      pageAppearance.cover.position = Number(event.currentTarget.value);
      renderPageAppearance();
      syncOutput();
      scheduleSave();
    });
    coverMenu.querySelector<HTMLButtonElement>("[data-cover-remove]")?.addEventListener("click", () => {
      delete pageAppearance.cover;
      renderPageAppearance();
      syncOutput();
      scheduleSave();
      hideCoverMenu();
    });
  }

  async function coverFileToDataUrl(file: File): Promise<string> {
    const bitmap = await createImageBitmap(file);
    const width = 1400;
    const height = 350;
    const scale = Math.max(width / bitmap.width, height / bitmap.height);
    const drawWidth = bitmap.width * scale;
    const drawHeight = bitmap.height * scale;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");
    context.drawImage(bitmap, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  function colorOption(value = "default"): ColorOption {
    return COLOR_OPTIONS.find((option) => option.value === value) ?? COLOR_OPTIONS[0];
  }

  function renderColorMenu(mode: "block" | "text", activeValue = "default"): string {
    const title = mode === "text" ? "텍스트 색" : "블록 배경색";
    return `<div class="color-menu__title">${title}</div>
      <div class="color-menu__options">
        ${COLOR_OPTIONS.map((option) => {
          const active = option.value === activeValue ? " color-menu__item--active" : "";
          const background = mode === "text" ? "#ffffff" : option.background;
          const glyph = mode === "text" ? "A" : "";
          return `<button type="button" class="color-menu__item${active}" data-color-value="${option.value}">
            <span class="color-menu__swatch" style="color:${option.text};background:${background}">${glyph}</span>
            <span>${option.label}</span>
            <span class="color-menu__check" aria-hidden="true">${active ? "✓" : ""}</span>
          </button>`;
        }).join("")}
      </div>`;
  }

  function bindColorMenu(): void {
    colorMenu.querySelectorAll<HTMLButtonElement>("[data-color-value]").forEach((button) => {
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        applyColor(button.dataset.colorValue ?? "default");
      });
    });
  }

  function openBlockColorMenu(blockId: string): void {
    const block = getBlock(blockId);
    const element = blocksRoot.querySelector<HTMLElement>(`[data-id="${blockId}"]`);
    if (!block || !element) return;
    colorTarget = {
      mode: "block",
      blockIds: selectedBlockIds.has(blockId) ? [...selectedBlockIds] : [blockId],
    };
    colorMenu.innerHTML = renderColorMenu("block", block.backgroundColor ?? "default");
    bindColorMenu();
    positionFloating(colorMenu, element.getBoundingClientRect(), "below");
  }

  function openInlineColorMenu(): void {
    if (!savedSelection) return;
    const activeColor = rangeTextColor(
      getSnapshotRichText(savedSelection),
      savedSelection.start,
      savedSelection.end,
    );
    colorTarget = { mode: "text", blockIds: [savedSelection.blockId] };
    colorMenu.innerHTML = renderColorMenu("text", activeColor || "default");
    bindColorMenu();
    positionFloating(colorMenu, inlineToolbar.getBoundingClientRect(), "below");
  }

  function renderSnapshotRoot(snapshot: SelectionSnapshot): void {
    const editable = findSnapshotRoot(snapshot);
    if (editable) editable.innerHTML = richTextToHtml(getSnapshotRichText(snapshot));
  }

  function applyColor(value: string): void {
    if (colorTarget.mode === "block") {
      colorTarget.blockIds.forEach((blockId) => {
        const block = getBlock(blockId);
        if (!block) return;
        if (value === "default") delete block.backgroundColor;
        else block.backgroundColor = value;
      });
      hideColorMenu();
      render();
      scheduleSave();
      return;
    }
    if (colorTarget.mode === "text" && savedSelection) {
      const snapshot = { ...savedSelection };
      const next = applyInlineTextColor(
        getSnapshotRichText(snapshot),
        snapshot.start,
        snapshot.end,
        value,
      );
      setSnapshotRichText(snapshot, next);
      renderSnapshotRoot(snapshot);
      restoreSelection(snapshot);
      syncOutput();
      scheduleSave();
      hideColorMenu();
      window.setTimeout(() => showInlineToolbar(), 0);
    }
  }

  function runInlineMark(mark: InlineMark): void {
    if (!savedSelection) return;
    const snapshot = { ...savedSelection };
    const next = toggleInlineMark(
      getSnapshotRichText(snapshot),
      snapshot.start,
      snapshot.end,
      mark,
    );
    setSnapshotRichText(snapshot, next);
    renderSnapshotRoot(snapshot);
    restoreSelection(snapshot);
    syncOutput();
    scheduleSave();
    hideColorMenu();
    window.setTimeout(() => showInlineToolbar(), 0);
  }
  function normalizeLinkUrl(value: string): string | null {
    const url = value.trim();
    if (!url) return "";
    if (url.startsWith("/") || url.startsWith("#") || url.startsWith("./") || url.startsWith("../")) return url;
    try {
      const parsed = new URL(/^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`);
      return ["http:", "https:", "mailto:"].includes(parsed.protocol) ? parsed.href : null;
    } catch {
      return null;
    }
  }

  function editInlineLink(): void {
    if (!savedSelection || savedSelection.start === savedSelection.end) return;
    const entered = window.prompt("Enter a link URL. Leave it blank to remove the link.", "");
    if (entered === null) return;
    const href = normalizeLinkUrl(entered);
    if (href === null) {
      showToast("Use an http, https, mailto, or relative link.");
      return;
    }
    const snapshot = { ...savedSelection };
    setSnapshotRichText(
      snapshot,
      applyInlineHref(getSnapshotRichText(snapshot), snapshot.start, snapshot.end, href || undefined),
    );
    renderSnapshotRoot(snapshot);
    restoreSelection(snapshot);
    syncOutput();

    scheduleSave();
    window.setTimeout(() => showInlineToolbar(), 0);
  }
  function updateRichTextFromEditable(blockId: string, editable: HTMLElement): void {
    const block = getBlock(blockId);
    if (!block) return;
    const value = parseEditable(editable);
    if (editable.dataset.field === "table-cell") {
      const rows = normalizeTableRows(block.rows);
      const cell = rows[Number(editable.dataset.row)]?.[Number(editable.dataset.col)];
      if (cell) cell.richText = value;
      block.rows = rows;
    } else {
      block.richText = value;
    }
    syncOutput();
    scheduleSave();
  }

  function updatePlainField(blockId: string, field: HTMLInputElement | HTMLTextAreaElement): void {
    const block = getBlock(blockId);
    const key = field.dataset.field;
    if (!block || !key) return;
    if (key === "checked" && field instanceof HTMLInputElement) {
      block.checked = field.checked;
    } else if (key === "isHeroImage" && field instanceof HTMLInputElement) {
      if (field.checked && !block.src?.trim()) {
        field.checked = false;
        showToast("\uC774\uBBF8\uC9C0 URL\uC744 \uBA3C\uC800 \uC785\uB825\uD558\uAC70\uB098 \uC5C5\uB85C\uB4DC\uD574 \uC8FC\uC138\uC694.");
        return;
      }
      const clearHeroImage = (items: EditorBlock[]): void => {
        items.forEach((item) => {
          if (item.type === "image") delete item.isHeroImage;
          if (item.children?.length) clearHeroImage(item.children);
        });
      };
      clearHeroImage(blocks);
      if (field.checked) block.isHeroImage = true;
      render();
      scheduleSave();
      return;
    } else if (key === "caption") {
      block.caption = createRichText(field.value);
    } else {
      (block as Record<string, unknown>)[key] = field.value;
    }
    if (block.type === "image" && (key === "src" || key === "alt")) {
      const blockElement = field.closest<HTMLElement>("[data-id]");
      const preview = blockElement?.querySelector<HTMLElement>("[data-image-preview]");
      const image = preview?.querySelector<HTMLImageElement>("[data-image-preview-image]");
      if (image) {
        if (key === "src") {
          const src = block.src?.trim() ?? "";
          image.src = src;
          image.hidden = !src;
          preview?.classList.toggle("is-empty", !src);
          blockElement?.classList.toggle("editor-block--image-empty", !src);
        } else {
          image.alt = block.alt ?? "";
        }
      }
    }
    if (key === "src" && block.type === "image" && !block.src?.trim()) {
      delete block.isHeroImage;
      const toggle = field.closest<HTMLElement>("[data-id]")?.querySelector<HTMLInputElement>('[data-field="isHeroImage"]');
      if (toggle) toggle.checked = false;
    }
    if (key === "equation") {
      const preview = field.closest<HTMLElement>("[data-id]")?.querySelector<HTMLElement>("[data-equation-preview]");
      if (preview) preview.innerHTML = renderEquationHtml(field.value);
    }
    syncOutput();
    scheduleSave();
  }

  function replaceBlockType(block: EditorBlock, target: string, text = blockPlainText(block)): EditorBlock {
    const [rawType, rawLevel] = target.split(":");
    const type = rawType as EditorBlockType;
    const options: Partial<EditorBlock> = {
      backgroundColor: block.backgroundColor,
      textColor: block.textColor,
    };
    if (type === "heading") options.level = clampHeadingLevel(rawLevel);
    if (isRichTextBlock(type)) options.richText = createRichText(text);
    const replacement = createEditorBlock(type, text, options);
    replacement.id = block.id;
    if (block.children?.length) replacement.children = block.children;
    return replacement;
  }

  function applyCommandTarget(blockId: string, target: string): "block" | "color-menu" | "emoji-menu" {
    const location = findBlockLocation(blockId);
    if (!location) return "block";
    const { block, siblings, index } = location;
    if (target === "emoji-menu") {
      return "emoji-menu";
    }
    siblings[index] = replaceBlockType(block, target, "");
    return "block";
  }

  function getSlashItems(query: string): Command[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return COMMANDS;
    return COMMANDS.filter((command) =>
      command.title.toLowerCase().includes(normalized) ||
      command.hint.toLowerCase().includes(normalized) ||
      command.aliases.some((alias) => alias.toLowerCase().includes(normalized))
    );
  }

  function hideSlashMenu(): void {
    slashMenu.hidden = true;
  }

  function renderSlashMenu(anchor?: HTMLElement): void {
    slashMenu.innerHTML = slashState.items.length
      ? slashState.items.map((command, index) => `
          <button type="button" class="slash-menu__item${index === slashState.index ? " slash-menu__item--active" : ""}" data-command-index="${index}">
            <strong>${command.title}</strong>
            <span>${command.hint}</span>
          </button>
        `).join("")
      : `<div class="slash-menu__empty">일치하는 명령이 없습니다.</div>`;
    const activeAnchor = anchor ?? blocksRoot.querySelector<HTMLElement>(`[data-id="${slashState.blockId}"] [data-rich-root]`);
    if (activeAnchor) positionFloating(slashMenu, activeAnchor.getBoundingClientRect(), "below");
    slashMenu.querySelectorAll<HTMLButtonElement>("[data-command-index]").forEach((button) => {
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        chooseSlashCommand(slashState.items[Number(button.dataset.commandIndex)]);
      });
    });
  }

  function activeSlashContext(blockId: string): { start: number; end: number; query: string } | null {
    const block = getBlock(blockId);
    if (!block) return null;
    const snapshot = captureSelection(true);
    const cursor = snapshot?.blockId === blockId && snapshot.field === "richText"
      ? snapshot.end
      : blockPlainText(block).length;
    const beforeCursor = blockPlainText(block).slice(0, cursor);
    const start = beforeCursor.lastIndexOf("/");
    if (start < 0) return null;
    const query = beforeCursor.slice(start + 1);
    if (/\s/.test(query)) return null;
    return { start, end: cursor, query };
  }

  function removeSlashToken(block: EditorBlock, start: number, end: number): void {
    block.richText = mergeRichText([
      ...sliceRichText(block.richText, 0, start),
      ...sliceRichText(block.richText, end),
    ]);
  }

  function createCommandBlock(target: string): EditorBlock {
    const [rawType, rawLevel] = target.split(":");
    return createEditorBlock(rawType as EditorBlockType, "", {
      level: rawType === "heading" ? clampHeadingLevel(rawLevel) : undefined,
    });
  }

  function updateSlashMenu(blockId: string, editable: HTMLElement): void {
    if (editable.dataset.field !== "richText") {
      hideSlashMenu();
      return;
    }
    const context = activeSlashContext(blockId);
    if (!context) {
      hideSlashMenu();
      return;
    }
    slashState = {
      blockId,
      index: 0,
      items: getSlashItems(context.query),
      start: context.start,
      end: context.end,
    };
    renderSlashMenu(editable);
  }

  function chooseSlashCommand(command: Command | undefined): void {
    if (!command) return;
    const { blockId, start, end } = slashState;
    const location = findBlockLocation(blockId);
    if (!location) return;
    const { block, siblings, index } = location;
    const wholeBlockCommand = start === 0 && end === blockPlainText(block).length;
    hideSlashMenu();

    if (command.target === "emoji-menu") {
      removeSlashToken(block, start, end);
      selectedId = blockId;
      render();
      window.requestAnimationFrame(() => {
        const anchor = blocksRoot.querySelector<HTMLElement>(`[data-id="${blockId}"] [data-rich-root]`);
        if (anchor) void openEmojiMenu("inline", blockId, anchor, start);
      });
      scheduleSave();
      return;
    }

    if (!wholeBlockCommand) {
      removeSlashToken(block, start, end);
      const next = createCommandBlock(command.target);
      siblings.splice(index + 1, 0, next);
      selectedId = next.id;
      render();
      window.requestAnimationFrame(() => focusBlock(next.id));
      scheduleSave();
      return;
    }

    applyCommandTarget(blockId, command.target);
    selectedId = blockId;
    render();
    window.requestAnimationFrame(() => focusBlock(blockId));
    scheduleSave();
  }

  function exactSlashCommand(text: string): Command | undefined {
    const query = text.replace(/^\//, "").trim().toLowerCase();
    return COMMANDS.find((command) =>
      command.aliases.some((alias) => alias.toLowerCase() === query) ||
      command.title.toLowerCase() === query
    );
  }

  function indentBlock(blockId: string): boolean {
    const location = findBlockLocation(blockId);
    if (!location || location.index === 0) return false;
    const parent = location.siblings[location.index - 1];
    location.siblings.splice(location.index, 1);
    parent.children ??= [];
    parent.children.push(location.block);
    return true;
  }

  function outdentBlock(blockId: string): boolean {
    const location = findBlockLocation(blockId);
    if (!location?.parent) return false;
    const parentLocation = findBlockLocation(location.parent.id);
    if (!parentLocation) return false;
    location.siblings.splice(location.index, 1);
    parentLocation.siblings.splice(parentLocation.index + 1, 0, location.block);
    return true;
  }

  function documentOrder(): string[] {
    const ids: string[] = [];
    const visit = (siblings: EditorBlock[]): void => {
      siblings.forEach((block) => {
        ids.push(block.id);
        visit(block.children ?? []);
      });
    };
    visit(blocks);
    return ids;
  }

  function selectionRootIds(blockIds: string[]): string[] {
    const selected = new Set(blockIds);
    const roots = blockIds.filter((blockId) => {
      let parent = findBlockLocation(blockId)?.parent;
      while (parent) {
        if (selected.has(parent.id)) return false;
        parent = findBlockLocation(parent.id)?.parent;
      }
      return Boolean(findBlockLocation(blockId));
    });
    const order = documentOrder();
    return [...new Set(roots)].sort((left, right) => order.indexOf(left) - order.indexOf(right));
  }

  function moveBlocksToTarget(blockIds: string[], targetId: string, placement: "before" | "after" | "inside"): boolean {
    const roots = selectionRootIds(blockIds);
    if (!roots.length || roots.includes(targetId)) return false;
    const targetLocation = findBlockLocation(targetId);
    if (!targetLocation) return false;
    let ancestor = targetLocation.parent;
    while (ancestor) {
      if (roots.includes(ancestor.id)) return false;
      ancestor = findBlockLocation(ancestor.id)?.parent;
    }

    const movingBlocks = roots.map((id) => findBlockLocation(id)?.block).filter(Boolean) as EditorBlock[];
    [...roots].reverse().forEach((id) => {
      const location = findBlockLocation(id);
      if (location) location.siblings.splice(location.index, 1);
    });
    const destination = findBlockLocation(targetId);
    if (!destination) return false;
    if (placement === "inside") {
      if (destination.block.type !== "toggle") return false;
      destination.block.children ??= [];
      destination.block.children.push(...movingBlocks);
      destination.block.isOpen = true;
    } else {
      destination.siblings.splice(destination.index + (placement === "after" ? 1 : 0), 0, ...movingBlocks);
    }
    return true;
  }

  function clearDragTarget(): void {
    blocksRoot.querySelectorAll<HTMLElement>(".editor-block--drag-before, .editor-block--drag-after, .editor-block--drag-inside").forEach((element) => {
      element.classList.remove("editor-block--drag-before", "editor-block--drag-after", "editor-block--drag-inside");
    });
  }

  function blockIdAtPoint(clientX: number, clientY: number): string {
    const target = document.elementFromPoint(clientX, clientY);
    return target?.closest<HTMLElement>("[data-id]")?.dataset.id ?? "";
  }

  function selectionRange(firstId: string, lastId: string): string[] {
    const order = documentOrder();
    const firstIndex = order.indexOf(firstId);
    const lastIndex = order.indexOf(lastId);
    if (firstIndex < 0 || lastIndex < 0) return [firstId];
    return order.slice(Math.min(firstIndex, lastIndex), Math.max(firstIndex, lastIndex) + 1);
  }

  function beginBlockDrag(event: PointerEvent, blockId: string): void {
    if (event.button !== 0) return;
    event.preventDefault();
    const selected = selectedBlockIds.has(blockId) && selectedBlockIds.size > 0;
    blockDragState = {
      sourceId: blockId,
      blockIds: selected ? selectionRootIds([...selectedBlockIds]) : [blockId],
      mode: event.shiftKey ? "select" : "move",
      targetId: "",
      placement: "after",
      moved: false,
    };

    const onMove = (moveEvent: PointerEvent): void => {
      const state = blockDragState;
      if (!state) return;
      const targetId = blockIdAtPoint(moveEvent.clientX, moveEvent.clientY);
      if (!targetId) return;
      if (state.mode === "select") {
        setSelectedBlockIds(selectionRange(state.sourceId, targetId));
        selectedId = state.sourceId;
        return;
      }
      const target = blocksRoot.querySelector<HTMLElement>(`[data-id="${targetId}"]`);
      if (!target || state.blockIds.includes(targetId)) return;
      const targetLocation = findBlockLocation(targetId);
      let ancestor = targetLocation?.parent;
      while (ancestor) {
        if (state.blockIds.includes(ancestor.id)) return;
        ancestor = findBlockLocation(ancestor.id)?.parent;
      }
      clearDragTarget();
      state.targetId = targetId;
      const header = target.querySelector<HTMLElement>(".editor-toggle__header");
      const rect = (header ?? target).getBoundingClientRect();
      const relativeY = moveEvent.clientY - rect.top;
      state.placement = target.classList.contains("editor-block--toggle") && relativeY >= rect.height * 0.2 && relativeY <= rect.height * 0.8
        ? "inside"
        : relativeY < rect.height / 2 ? "before" : "after";
      state.moved = true;
      target.classList.add(state.placement === "before" ? "editor-block--drag-before" : state.placement === "after" ? "editor-block--drag-after" : "editor-block--drag-inside");
    };

    const finish = (): void => {
      const state = blockDragState;
      blockDragState = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      clearDragTarget();
      if (!state) return;
      if (state.mode === "select") {
        selectedId = state.sourceId;
        syncBlockSelectionUI();
        return;
      }
      if (!state.moved || !state.targetId || !moveBlocksToTarget(state.blockIds, state.targetId, state.placement)) return;
      suppressNextHandleMenu = true;
      window.setTimeout(() => { suppressNextHandleMenu = false; }, 0);
      selectedId = state.sourceId;
      setSelectedBlockIds(state.blockIds);
      render();
      scheduleSave();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  }

  function moveBlockWithTab(blockId: string, outdent: boolean, blockIds = [blockId]): void {
    const roots = selectionRootIds(blockIds);
    const ordered = outdent ? [...roots].reverse() : roots;
    let moved = false;
    ordered.forEach((id) => {
      moved = (outdent ? outdentBlock(id) : indentBlock(id)) || moved;
    });
    if (!moved) return;
    selectedId = blockId;
    render();
    window.requestAnimationFrame(() => focusBlock(blockId));
    scheduleSave();
  }

  function splitBlockAtSelection(blockId: string): void {
    const location = findBlockLocation(blockId);
    const snapshot = captureSelection(true);
    if (!location || !snapshot || snapshot.field !== "richText") return;
    const { block, siblings, index, parent } = location;
    const value = block.richText ?? [];
    const before = sliceRichText(value, 0, snapshot.start);
    const after = sliceRichText(value, snapshot.end);

    if (block.type === "toggle") {
      block.richText = before;
      const child = createEditorBlock("paragraph", "", { richText: after });
      block.children ??= [];
      block.children.unshift(child);
      block.isOpen = true;
      selectedId = child.id;
      render();
      window.requestAnimationFrame(() => focusBlock(child.id));
      scheduleSave();
      return;
    }

    if (!getRichTextPlainText(value) && block.type !== "paragraph") {
      if (parent && ["bulleted_list", "numbered_list", "todo"].includes(block.type)) {
        moveBlockWithTab(blockId, true);
        return;
      }
      siblings[index] = replaceBlockType(block, "paragraph", "");
      render();
      window.requestAnimationFrame(() => focusBlock(blockId));
      scheduleSave();
      return;
    }

    block.richText = before;
    const nextType = ["bulleted_list", "numbered_list", "todo"].includes(block.type)
      ? block.type
      : "paragraph";
    const next = createEditorBlock(nextType, "", {
      richText: after,
      checked: nextType === "todo" ? false : undefined,
    });
    siblings.splice(index + 1, 0, next);
    selectedId = next.id;
    render();
    window.requestAnimationFrame(() => focusBlock(next.id, false));
    scheduleSave();
  }

  function removeOrMergeAtStart(blockId: string): boolean {
    const location = findBlockLocation(blockId);
    const snapshot = captureSelection(true);
    if (!location || !snapshot || snapshot.start !== 0 || snapshot.end !== 0) return false;
    const { block, siblings, index, parent } = location;
    const text = blockPlainText(block);

    if (block.type === "toggle") {
      siblings[index] = replaceBlockType(block, "paragraph", text);
      render();
      window.requestAnimationFrame(() => focusBlock(blockId));
      scheduleSave();
      return true;
    }

    if (!text && block.type !== "paragraph") {
      siblings[index] = replaceBlockType(block, "paragraph", "");
      render();
      window.requestAnimationFrame(() => focusBlock(blockId, false));
      scheduleSave();
      return true;
    }

    if (!text && siblings.length > 1) {
      siblings.splice(index, 1);
      const previous = siblings[Math.max(0, index - 1)] ?? parent;
      if (!previous) return false;
      selectedId = previous.id;
      render();
      window.requestAnimationFrame(() => focusBlock(previous.id, true));
      scheduleSave();
      return true;
    }

    const previous = siblings[index - 1];
    if (index > 0 && previous && isRichTextBlock(previous.type) && isRichTextBlock(block.type)) {
      const previousLength = getRichTextPlainText(previous.richText).length;
      previous.richText = mergeRichText([...(previous.richText ?? []), ...(block.richText ?? [])]);
      siblings.splice(index, 1);
      selectedId = previous.id;
      render();
      window.requestAnimationFrame(() => {
        restoreSelection({
          blockId: previous.id,
          field: "richText",
          start: previousLength,
          end: previousLength,
        });
      });
      scheduleSave();
      return true;
    }
    return false;
  }
  function focusTableCell(blockId: string, row: number, col: number): void {
    const cell = blocksRoot.querySelector<HTMLElement>(
      `[data-id="${blockId}"] [data-rich-root][data-row="${row}"][data-col="${col}"]`,
    );
    cell?.focus();
  }

  function handleTableTab(event: KeyboardEvent, blockId: string, editable: HTMLElement): void {
    const block = getBlock(blockId);
    if (!block || block.type !== "table") return;
    event.preventDefault();
    const rows = normalizeTableRows(block.rows);
    const row = Number(editable.dataset.row);
    const col = Number(editable.dataset.col);
    const width = rows[0]?.length ?? 1;
    let flatIndex = row * width + col + (event.shiftKey ? -1 : 1);
    if (flatIndex >= rows.length * width) {
      rows.push(Array.from({ length: width }, () => ({ richText: [] })));
      block.rows = rows;
      render();
    }
    flatIndex = Math.max(0, flatIndex);
    window.requestAnimationFrame(() => focusTableCell(blockId, Math.floor(flatIndex / width), flatIndex % width));
  }

  function handleRichKeydown(event: KeyboardEvent, blockId: string, editable: HTMLElement): void {
    if (event.isComposing || event.keyCode === 229) return;

    if (slashState.blockId === blockId && !slashMenu.hidden) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        slashState.index = Math.max(0, Math.min(slashState.index + delta, slashState.items.length - 1));
        renderSlashMenu(editable);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        chooseSlashCommand(slashState.items[slashState.index]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        hideSlashMenu();
        return;
      }
    }

    if (editable.dataset.field === "table-cell") {
      if (event.key === "Tab") handleTableTab(event, blockId, editable);
      return;
    }

    const block = getBlock(blockId);
    if (!block) return;
    if (event.key === "Tab") {
      event.preventDefault();
      moveBlockWithTab(blockId, event.shiftKey);
      return;
    }
    if (
      event.key === " " &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      block.type === "paragraph"
    ) {
      const shortcut = blockPlainText(block);
      const target = shortcut === "-"
        ? "bulleted_list"
        : /^\d+\.$/.test(shortcut)
          ? "numbered_list"
          : shortcut === ">"
            ? "quote"
            : shortcut === "\""
              ? "toggle"
              : "";
      if (target) {
        event.preventDefault();
        const location = findBlockLocation(blockId);
        if (!location) return;
        location.siblings[location.index] = replaceBlockType(block, target, "");
        selectedId = blockId;
        render();
        window.requestAnimationFrame(() => focusBlock(blockId));
        scheduleSave();
        return;
      }
      const context = activeSlashContext(blockId);
      const command = context ? exactSlashCommand(`/${context.query}`) : undefined;
      if (command) {
        event.preventDefault();
        slashState = { blockId, index: 0, items: [command], start: context!.start, end: context!.end };
        chooseSlashCommand(command);
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      hideSlashMenu();
      splitBlockAtSelection(blockId);
      return;
    }
    if (event.key === "Backspace" && removeOrMergeAtStart(blockId)) event.preventDefault();
  }

  function hideBlockContextMenu(): void {
    if (blockContextMenu) blockContextMenu.hidden = true;
  }

  function showBlockActionMenu(blockId: string, anchor: HTMLElement): void {
    if (!blockContextMenu) return;
    blockContextMenu.innerHTML = `
      <button type="button" data-context-action="color">\uC0C9 \uC124\uC815</button>
      <button type="button" data-context-action="copy-url">\uC774 \uBE14\uB85D\uC73C\uB85C \uC774\uB3D9\uD558\uB294 URL \uBCF5\uC0AC</button>
      <button type="button" class="block-action-menu__delete" data-context-action="delete">\uBE14\uB85D \uC0AD\uC81C</button>
    `;
    blockContextMenu.dataset.blockId = blockId;
    positionFloating(blockContextMenu, anchor.getBoundingClientRect(), "below");
  }
  function handleBlockAction(blockId: string, action: string): void {
    if (action === "drag") return;
    const location = findBlockLocation(blockId);
    if (!location) return;
    const { siblings, index, parent } = location;
    if (action === "add-after") {
      const next = createEditorBlock("paragraph");
      siblings.splice(index + 1, 0, next);
      selectedId = next.id;
    }
    if (action === "remove") {
      siblings.splice(index, 1);
      selectedBlockIds.delete(blockId);
      if (!blocks.length) blocks.push(createEditorBlock("paragraph"));
      const fallback = siblings[Math.min(index, siblings.length - 1)] ?? parent ?? blocks.at(-1);
      selectedId = fallback?.id ?? blocks[0].id;
    }
    render();
    window.requestAnimationFrame(() => focusBlock(selectedId));
    scheduleSave();
  }

  function handleTableAction(blockId: string, action: string): void {
    const block = getBlock(blockId);
    if (!block || block.type !== "table") return;
    const rows = normalizeTableRows(block.rows);
    const width = rows[0]?.length ?? 1;
    if (action === "add-row") rows.push(Array.from({ length: width }, () => ({ richText: [] })));
    if (action === "add-col") rows.forEach((row) => row.push({ richText: [] }));
    if (action === "remove-row" && rows.length > 1) rows.pop();
    if (action === "remove-col" && width > 1) rows.forEach((row) => row.pop());
    block.rows = rows;
    render();
    scheduleSave();
  }

  function updateImageWidthUI(element: HTMLElement, displayWidth?: number): void {
    const preview = element.querySelector<HTMLElement>("[data-image-preview]");
    const label = element.querySelector<HTMLOutputElement>("[data-image-size-label]");
    const input = element.querySelector<HTMLInputElement>("[data-image-width]");
    if (displayWidth) {
      preview?.style.setProperty("--editor-image-width", `${displayWidth}px`);
      if (label) label.textContent = `${displayWidth}px`;
      if (input) input.value = String(displayWidth);
      return;
    }
    preview?.style.removeProperty("--editor-image-width");
    if (label) label.textContent = "\uBCF8\uBB38 \uB108\uBE44";
    if (input) input.value = "";
  }

  function setImageDisplayWidth(blockId: string, value: unknown, element?: HTMLElement): void {
    const block = getBlock(blockId);
    if (!block || block.type !== "image") return;
    const displayWidth = normalizeImageDisplayWidth(value);
    if (displayWidth) block.displayWidth = displayWidth;
    else delete block.displayWidth;
    const blockElement = element ?? blocksRoot.querySelector<HTMLElement>(`[data-id="${blockId}"]`);
    if (blockElement) updateImageWidthUI(blockElement, displayWidth);
    syncOutput();
    scheduleSave();
  }

  function beginImageResize(event: PointerEvent, blockId: string, handle: HTMLButtonElement): void {
    if (event.button !== 0) return;
    const block = getBlock(blockId);
    const element = handle.closest<HTMLElement>("[data-id]");
    const stage = element?.querySelector<HTMLElement>("[data-image-stage]");
    const preview = element?.querySelector<HTMLElement>("[data-image-preview]");
    if (!block || block.type !== "image" || !element || !stage || !preview || preview.classList.contains("is-empty")) return;

    event.preventDefault();
    event.stopPropagation();
    selectedBlockIds.clear();
    selectedId = blockId;
    syncBlockSelectionUI();

    const stageRect = stage.getBoundingClientRect();
    const centerX = stageRect.left + stageRect.width / 2;
    const maximum = Math.max(1, Math.min(IMAGE_MAX_DISPLAY_WIDTH, stageRect.width));
    const minimum = Math.min(IMAGE_MIN_DISPLAY_WIDTH, maximum);
    let nextWidth = normalizeImageDisplayWidth(block.displayWidth) ?? Math.round(maximum);
    preview.classList.add("is-resizing");
    handle.setPointerCapture?.(event.pointerId);

    const update = (clientX: number): void => {
      nextWidth = Math.round(Math.max(minimum, Math.min(maximum, Math.abs(clientX - centerX) * 2)));
      updateImageWidthUI(element, nextWidth);
    };

    const onMove = (moveEvent: PointerEvent): void => {
      moveEvent.preventDefault();
      update(moveEvent.clientX);
    };

    const finish = (): void => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      preview.classList.remove("is-resizing");
      if (nextWidth >= maximum - 2) setImageDisplayWidth(blockId, undefined, element);
      else setImageDisplayWidth(blockId, nextWidth, element);
    };

    update(event.clientX);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  }

  function bindBlocks(): void {
    blocksRoot.querySelectorAll<HTMLElement>("[data-id]").forEach((element) => {
      const blockId = element.dataset.id;
      if (!blockId) return;
      element.addEventListener("pointerdown", (event) => {
        const target = event.target;
        const action = target instanceof Element ? target.closest<HTMLElement>("[data-block-action]")?.dataset.blockAction : "";
        if (action === "drag") return;
        selectedBlockIds.clear();
        selectedId = blockId;
        syncBlockSelectionUI();
      });
      element.querySelector<HTMLButtonElement>("[data-block-action=\"drag\"]")?.addEventListener("pointerdown", (event) => {
        beginBlockDrag(event, blockId);
      });
      element.querySelectorAll<HTMLButtonElement>("[data-block-action]").forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.dataset.blockAction ?? "";
          if (action === "drag") {
            if (suppressNextHandleMenu) {
              suppressNextHandleMenu = false;
              return;
            }
            selectedBlockIds.clear();
            selectedId = blockId;
            syncBlockSelectionUI();
            showBlockActionMenu(blockId, button);
            return;
          }
          handleBlockAction(blockId, action);
        });
      });
      element.querySelectorAll<HTMLButtonElement>("[data-table-action]").forEach((button) => {
        button.addEventListener("click", () => { if (button.closest<HTMLElement>("[data-id]") === element) handleTableAction(blockId, button.dataset.tableAction ?? ""); });
      });
      element.querySelectorAll<HTMLButtonElement>("[data-image-resize]").forEach((handle) => {
        handle.addEventListener("pointerdown", (event) => beginImageResize(event, blockId, handle));
        handle.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(event.key)) return;
          event.preventDefault();
          const block = getBlock(blockId);
          if (!block || block.type !== "image") return;
          const stageWidth = Math.min(
            IMAGE_MAX_DISPLAY_WIDTH,
            element.querySelector<HTMLElement>("[data-image-stage]")?.getBoundingClientRect().width ?? IMAGE_MAX_DISPLAY_WIDTH,
          );
          const current = normalizeImageDisplayWidth(block.displayWidth) ?? Math.round(stageWidth);
          const delta = event.key === "ArrowRight" || event.key === "ArrowUp" ? 10 : -10;
          setImageDisplayWidth(blockId, current + delta, element);
        });
      });
      element.querySelector<HTMLInputElement>("[data-image-width]")?.addEventListener("change", (event) => {
        setImageDisplayWidth(blockId, event.currentTarget.value, element);
      });
      element.querySelector<HTMLButtonElement>("[data-image-width-reset]")?.addEventListener("click", () => {
        setImageDisplayWidth(blockId, undefined, element);
      });
      element.querySelectorAll<HTMLButtonElement>("[data-toggle-action]").forEach((button) => button.addEventListener("click", () => { if (button.closest<HTMLElement>("[data-id]") !== element) return; const block = getBlock(blockId); if (!block || block.type !== "toggle") return; block.isOpen = !block.isOpen; element.querySelector<HTMLElement>(".editor-toggle__children")?.toggleAttribute("hidden", !block.isOpen); button.setAttribute("aria-expanded", String(block.isOpen)); syncOutput(); scheduleSave(); }));
      element.querySelectorAll<HTMLButtonElement>("[data-toggle-empty]").forEach((button) => button.addEventListener("click", () => { if (button.closest<HTMLElement>("[data-id]") !== element) return; const block = getBlock(blockId); if (!block || block.type !== "toggle") return; const child = createEditorBlock("paragraph"); block.children = [child]; block.isOpen = true; render(); window.requestAnimationFrame(() => focusBlock(child.id)); scheduleSave(); }));
      element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[data-field], textarea[data-field]").forEach((field) => {
        const eventName = field.type === "checkbox" ? "change" : "input";
        field.addEventListener(eventName, () => { if (field.closest<HTMLElement>("[data-id]") === element) updatePlainField(blockId, field); });
      });
      element.querySelectorAll<HTMLElement>("[data-rich-root]").forEach((editable) => {
        editable.addEventListener("input", () => {
          if (editable.dataset.ownerId !== blockId) return;
          updateRichTextFromEditable(blockId, editable);
          updateSlashMenu(blockId, editable);
        });
        editable.addEventListener("keydown", (event) => { if (editable.dataset.ownerId === blockId) handleRichKeydown(event, blockId, editable); });
        editable.addEventListener("blur", () => { if (editable.dataset.ownerId === blockId) window.setTimeout(hideSlashMenu, 120); });
      });
    });
  }

  function focusBlock(blockId: string, atEnd = false): void {
    const editable = blocksRoot.querySelector<HTMLElement>(`[data-id="${blockId}"] [data-rich-root]`);
    const fallback = blocksRoot.querySelector<HTMLElement>(
      `[data-id="${blockId}"] textarea, [data-id="${blockId}"] input`,
    );
    if (!editable) {
      fallback?.focus();
      return;
    }
    const length = editable.textContent?.length ?? 0;
    const snapshot: SelectionSnapshot = {
      blockId,
      field: editable.dataset.field === "table-cell" ? "table-cell" : "richText",
      row: editable.dataset.field === "table-cell" ? Number(editable.dataset.row) : undefined,
      col: editable.dataset.field === "table-cell" ? Number(editable.dataset.col) : undefined,
      start: atEnd ? length : 0,
      end: atEnd ? length : 0,
    };
    restoreSelection(snapshot);
  }

  function addBlockFromPalette(target: string): void {
    const [rawType, rawLevel] = target.split(":");
    const type = rawType as EditorBlockType;
    const block = createEditorBlock(type, "", {
      level: type === "heading" ? clampHeadingLevel(rawLevel) : undefined,
    });
    const location = selectedId ? findBlockLocation(selectedId) : undefined;
    const siblings = location?.siblings ?? blocks;
    const index = location?.index ?? siblings.length - 1;
    siblings.splice(Math.max(0, index) + 1, 0, block);
    selectedId = block.id;
    render();
    window.requestAnimationFrame(() => focusBlock(block.id));
    scheduleSave();
  }

  function serializedBlock(block: EditorBlock): Record<string, unknown> {
    const base: Record<string, unknown> = { id: block.id, type: block.type };
    if (block.backgroundColor) base.backgroundColor = block.backgroundColor;
    if (block.textColor) base.textColor = block.textColor;
    if (isRichTextBlock(block.type)) base.richText = normalizeRichText(block.richText);
    if (block.type === "toggle") { if (block.isOpen) base.isOpen = true; base.children = (block.children ?? []).map(serializedBlock); }
    if (block.type === "heading") base.level = block.level ?? 1;
    if (block.type === "todo") base.checked = Boolean(block.checked);
    if (block.type === "callout") base.icon = block.icon ?? "i";
    if (block.type === "context") base.title = block.title ?? "맥락";
    if (block.type === "code") {
      base.language = block.language ?? "text";
      base.code = block.code ?? "";
    }
    if (block.type === "equation") base.equation = block.equation ?? "";
    if (block.type === "image") {
      base.src = block.src ?? "";
      base.alt = block.alt ?? "";
      if (block.caption?.length) base.caption = normalizeRichText(block.caption);
      if (block.isHeroImage) base.isHeroImage = true;
      const displayWidth = normalizeImageDisplayWidth(block.displayWidth);
      if (displayWidth) base.displayWidth = displayWidth;
    }
    if (block.type === "bookmark") {
      base.url = block.url ?? "";
      base.title = block.title ?? "Bookmark";
      if (block.description) base.description = block.description;
    }
    if (block.type === "table") {
      base.hasHeaderRow = block.hasHeaderRow !== false;
      base.rows = normalizeTableRows(block.rows);
    }
    if (block.type !== "toggle" && block.children?.length) base.children = block.children.map(serializedBlock);
    return base;
  }

  function getDocument(): EditorDocument {
    return {
      version: 2,
      meta: getMeta(),
      page: structuredClone(pageAppearance),
      blocks: blocks.map((block) => serializedBlock(block) as EditorBlock),
    };
  }

  function getJson(): string {
    return JSON.stringify(getDocument(), null, 2);
  }

  function syncOutput(): void {
    const meta = getMeta();
    const title = meta.title || "제목 없음";
    const slug = meta.slug || slugify(title);
    const json = getJson();
    if (slugPreview) slugPreview.textContent = slug;
    if (datePreview) datePreview.textContent = meta.pubDate || today;
    if (blockCount) blockCount.textContent = String(blocks.length);
    if (jsonEditor && document.activeElement !== jsonEditor) jsonEditor.value = json;
    if (jsonSize) jsonSize.textContent = `${json.length} chars`;
  }
  function applyJsonEditor(): void {
    if (!jsonEditor) return;
    try {
      const raw: unknown = JSON.parse(jsonEditor.value);
      if (!raw || typeof raw !== "object" || (raw as Record<string, unknown>).version !== 2 || !Array.isArray((raw as Record<string, unknown>).blocks)) {
        throw new Error("Invalid Post JSON v2 document.");
      }
      const document = normalizeStoredDocument(raw);
      setMeta(document.meta);
      pageAppearance = structuredClone(document.page);
      blocks = structuredClone(document.blocks);
      selectedBlockIds.clear();
      selectedId = blocks[0]?.id ?? "";
      jsonEditor.classList.remove("is-invalid");
      render();
      scheduleSave();
    } catch {
      jsonEditor.classList.add("is-invalid");
    }
  }
  function persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDocument()));
    if (saveState) saveState.textContent = "저장됨";
  }

  function scheduleSave(): void {
    if (saveState) saveState.textContent = "저장 중";
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persist, 180);
  }

  async function copyText(value: string, label: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    showToast(`${label} 복사됨`);
  }

  function getBlockUrl(blockId: string): string {
    const meta = getMeta();
    const slug = meta.slug || slugify(meta.title || "untitled");
    const siteOrigin = root.dataset.siteOrigin || window.location.origin;
    const url = new URL(`/blog/${encodeURIComponent(slug)}`, siteOrigin);
    url.hash = blockId;
    return url.toString();
  }

  async function copyBlockUrl(blockId: string): Promise<void> {
    try {
      await copyText(getBlockUrl(blockId), "\uBE14\uB85D URL");
    } catch {
      showToast("URL\uC744 \uBCF5\uC0AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }
  }

  async function importJsonFile(file: File): Promise<void> {
    try {
      const raw: unknown = JSON.parse(await file.text());
      if (!raw || typeof raw !== "object" || (raw as Record<string, unknown>).version !== 2 || !Array.isArray((raw as Record<string, unknown>).blocks)) {
        throw new Error("Unsupported document format");
      }
      const document = normalizeStoredDocument(raw);
      setMeta(document.meta);
      pageAppearance = structuredClone(document.page);
      blocks = structuredClone(document.blocks);
      selectedBlockIds.clear();
      selectedId = blocks[0]?.id ?? "";
      render();
      scheduleSave();
      showToast(`${file.name} 불러옴`);
    } catch {
      showToast("Post JSON v2 파일만 불러올 수 있습니다.");
    } finally {
      if (jsonImport) jsonImport.value = "";
    }
  }

  function downloadFallback(value: string, filename: string): void {
    const blob = new Blob([value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(`${filename} 다운로드 완료`);
  }

  async function saveJson(value: string, filename: string): Promise<void> {
    const pickerWindow = window as Window & {
      showSaveFilePicker?: (options: Record<string, unknown>) => Promise<{
        createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>;
      }>;
    };
    if (!pickerWindow.showSaveFilePicker) {
      downloadFallback(value, filename);
      return;
    }
    try {
      const handle = await pickerWindow.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: "Post JSON",
          accept: { "application/json": [".json"] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(value);
      await writable.close();
      showToast(`${filename} 저장 완료`);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "AbortError") throw error;
    }
  }
  function showToast(message: string): void {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  jsonEditor?.addEventListener("input", () => {
    window.clearTimeout(jsonInputTimer);
    jsonInputTimer = window.setTimeout(applyJsonEditor, 350);
  });
  metaInputs.forEach((input) => {
    input.addEventListener("input", () => {
      syncOutput();
      scheduleSave();
    });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-page-action]").forEach((button) => {
  statusTrigger?.addEventListener("click", () => {
    setStatusMenu(statusMenu?.hidden ?? true);
  });
  root.querySelectorAll<HTMLButtonElement>("[data-status-option]").forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.statusOption ?? "";
      statuses = statuses.includes(value) ? statuses.filter((status) => status !== value) : [...statuses, value];
      renderStatusPicker();
      syncOutput();
      scheduleSave();
    });
  });
  statusChips?.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-status-remove]");
    if (!button) return;
    statuses = statuses.filter((status) => status !== button.dataset.statusRemove);
    renderStatusPicker();
    syncOutput();
    scheduleSave();
  });
  statusInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== ",") return;
    event.preventDefault();
    const next = normalizeStatuses(statusInput.value);
    if (!next.length) return;
    statuses = normalizeStatuses([...statuses, ...next]);
    statusInput.value = "";
    renderStatusPicker();
    syncOutput();
    scheduleSave();
  });
    button.addEventListener("click", () => {
      const action = button.dataset.pageAction;
      if (action === "add-icon") void openEmojiMenu("page", "", button);
      if (action === "add-cover" || action === "change-cover") openCoverMenu(button);
      if (action === "remove-icon") {
        delete pageAppearance.icon;
        renderPageAppearance();
        syncOutput();
        scheduleSave();
      }
      if (action === "remove-cover") {
        delete pageAppearance.cover;
        renderPageAppearance();
        syncOutput();
        scheduleSave();
        hideCoverMenu();
      }
    });
  });

  pageIcon.addEventListener("click", () => {
    void openEmojiMenu("page", "", pageIcon);
  });

  root.querySelectorAll<HTMLButtonElement>("[data-add-block]").forEach((button) => {
    button.addEventListener("click", () => addBlockFromPalette(button.dataset.addBlock ?? "paragraph"));
  });

  jsonImport?.addEventListener("change", () => {
    const file = jsonImport.files?.[0];
    if (file) void importJsonFile(file);
  });

  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const meta = getMeta();
      const slug = meta.slug || slugify(meta.title || "untitled");
      const json = getJson();
      if (button.dataset.action === "load-json") {
        jsonImport?.click();
        return;
      }
      if (button.dataset.action === "copy-json") await copyText(json, "JSON");
      if (button.dataset.action === "save-json") await saveJson(json, `${slug}.post.json`);
      if (button.dataset.action === "reset-sample") {
        const sample = sampleDocument();
        setMeta(sample.meta);
        pageAppearance = structuredClone(sample.page);
        blocks = structuredClone(sample.blocks);
        selectedId = blocks[0]?.id ?? "";
        render();
        scheduleSave();
      }
      if (button.dataset.action === "clear-document") {
        setMeta({
          title: "",
          slug: "",
          description: "",
          pubDate: today,
          category: "",
          tags: "",
          status: [],
        });
        pageAppearance = {};
        blocks = [createEditorBlock("paragraph")];

        selectedId = blocks[0].id;
        render();
        scheduleSave();
      }
    });
  });
  inlineToolbar.querySelectorAll<HTMLButtonElement>("[data-inline-mark]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      runInlineMark(button.dataset.inlineMark as InlineMark);
    });
  });

  inlineToolbar.querySelector<HTMLButtonElement>("[data-inline-action='text-color']")?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    openInlineColorMenu();
  });
  inlineToolbar.querySelector<HTMLButtonElement>("[data-inline-action='link']")?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    editInlineLink();
  });


  blockContextMenu?.addEventListener("click", (event) => {
    const action = (event.target as Element | null)?.closest<HTMLElement>("[data-context-action]")?.dataset.contextAction;
    const blockId = blockContextMenu.dataset.blockId;
    if (action === "color" && blockId) openBlockColorMenu(blockId);
    if (action === "copy-url" && blockId) void copyBlockUrl(blockId);
    if (action === "delete" && blockId) handleBlockAction(blockId, "remove");
    hideBlockContextMenu();
  });
  root.addEventListener("mouseup", () => window.setTimeout(() => showInlineToolbar(), 0));
  root.addEventListener("keyup", () => {
    window.setTimeout(() => showInlineToolbar(), 0);
  });
  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (inlineToolbar.contains(target) || colorMenu.contains(target) || slashMenu.contains(target) || emojiMenu.contains(target) || coverMenu.contains(target) || blockContextMenu?.contains(target) || statusPicker?.contains(target)) return;
    if (!target.closest("[data-rich-root]")) hideInlineToolbar();
    hideColorMenu();
    hideEmojiMenu();
    hideCoverMenu();
    hideBlockContextMenu();
  });
  window.addEventListener("beforeunload", persist);
    setStatusMenu(false);

  const state = loadDocument();
  setMeta({ ...state.meta, pubDate: state.meta.pubDate || today });
  pageAppearance = state.page ?? {};
  blocks = state.blocks.length ? state.blocks : [createEditorBlock("paragraph")];
  selectedId = blocks[0]?.id ?? "";
  render();
  persist();
}
