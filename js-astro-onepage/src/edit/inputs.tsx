// 通用输入原语与排版台版式件，供 EditApp 复用。
// 纯呈现层：不持有业务逻辑，只统一「稿」这一侧的字段外观与增删移控件质感。
import type { ComponentChildren } from "preact";

// 表单控件统一版式：纸白卡底 + 细线，hover 墨线加深，focus 环由 global.css 给朱砂。
// 朱砂不铺控件底色——这里只用中性令牌。
const FIELD =
  "w-full rounded-md border border-(--color-line) bg-(--color-card) px-3 py-2 text-sm text-(--color-ink) transition-colors hover:border-(--color-ink-2)";
const FIELD_LABEL = "mb-1 block text-xs font-medium text-(--color-ink-2)";

// 表单分组：eyebrow 小标题 + 细线分隔；条目数用朱砂等宽字（数据才配朱砂）。
export function Group(props: {
  title: string;
  count?: number;
  action?: ComponentChildren;
  name?: string;
  children: ComponentChildren;
}) {
  return (
    <section data-edit-group={props.name}>
      <div class="mb-4 flex items-baseline justify-between gap-3 border-b border-(--color-line) pb-2">
        <h2 class="eyebrow flex items-baseline gap-2">
          <span>{props.title}</span>
          {props.count != null && (
            <span class="mono text-(--color-accent) tracking-normal normal-case">{props.count}</span>
          )}
        </h2>
        {props.action}
      </div>
      {props.children}
    </section>
  );
}

// 增删移控件：复用 .icon-btn 质感（hover 转朱砂＝校样上的红笔改动）。
// 三个都带 title + aria-label，读屏可辨。
export function RowControls(props: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  upLabel: string;
  downLabel: string;
  removeLabel: string;
}) {
  return (
    <div class="flex shrink-0 items-center gap-1">
      <button class="icon-btn size-9" title={props.upLabel} aria-label={props.upLabel} onClick={props.onUp}>
        ↑
      </button>
      <button class="icon-btn size-9" title={props.downLabel} aria-label={props.downLabel} onClick={props.onDown}>
        ↓
      </button>
      <button class="icon-btn size-9" title={props.removeLabel} aria-label={props.removeLabel} onClick={props.onRemove}>
        ×
      </button>
    </div>
  );
}

export function Text(props: {
  label: string;
  value: string | number | undefined;
  onInput: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label class="block">
      <span class={FIELD_LABEL}>{props.label}</span>
      <input
        class={FIELD}
        value={props.value == null ? "" : String(props.value)}
        placeholder={props.placeholder ?? ""}
        onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
      />
    </label>
  );
}

// 多行文本：介绍 / 一句话 / 页脚这类偏长的字段用它，比单行输入好写好读。
export function Area(props: {
  label: string;
  value: string | undefined;
  onInput: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label class="block">
      <span class={FIELD_LABEL}>{props.label}</span>
      <textarea
        class={`${FIELD} min-h-18 leading-relaxed`}
        value={props.value ?? ""}
        placeholder={props.placeholder ?? ""}
        onInput={(e) => props.onInput((e.target as HTMLTextAreaElement).value)}
      />
    </label>
  );
}

export function Check(props: {
  label: string;
  checked: boolean | undefined;
  onToggle: (v: boolean) => void;
}) {
  return (
    <label class="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        // 勾选态用墨色，别落成浏览器默认蓝、也不铺朱砂（朱砂只留给数据/印章/focus/残留）
        style="accent-color: var(--color-ink)"
        class="size-4"
        checked={!!props.checked}
        onChange={(e) => props.onToggle((e.target as HTMLInputElement).checked)}
      />
      <span>{props.label}</span>
    </label>
  );
}

export function Select(props: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onInput: (v: string) => void;
}) {
  return (
    <label class="block">
      <span class={FIELD_LABEL}>{props.label}</span>
      <select
        class={FIELD}
        value={props.value}
        onChange={(e) => props.onInput((e.target as HTMLSelectElement).value)}
      >
        {props.options.map((o) => (
          <option value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
