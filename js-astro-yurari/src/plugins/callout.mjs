import { defineMdastPlugin } from "satteri";
import tabler from "@iconify-json/tabler/icons.json" with { type: "json" };

// GitHub 形式のコールアウト記法を変換する Sätteri (mdast) プラグイン。
//   > [!NOTE]
//   > 本文
// マーカーの後ろに書くとタイトルを置き換えられる (> [!TIP] ひとこと)。

const types = {
  note: { label: "Note", icon: "info-circle" },
  tip: { label: "Tip", icon: "bulb" },
  important: { label: "Important", icon: "message-report" },
  warning: { label: "Warning", icon: "alert-triangle" },
  caution: { label: "Caution", icon: "alert-octagon" },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const iconSvg = (name) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.25em" height="1.25em" aria-hidden="true">${tabler.icons[name].body}</svg>`;

const marker = /^\[!(\w+)\][ \t]*([^\n]*)\n?/;

export default defineMdastPlugin({
  name: "callout",
  blockquote(node, ctx) {
    const paragraph = node.children[0];
    const text = paragraph?.type === "paragraph" ? paragraph.children[0] : undefined;
    const m = text?.type === "text" && text.value.match(marker);
    const def = m && types[m[1].toLowerCase()];
    if (!def) return;

    const kind = m[1].toLowerCase();
    const title = m[2].trim() || def.label;

    // マーカー行を本文から取り除く。空になったテキスト/段落ごと消す
    const rest = text.value.slice(m[0].length);
    if (rest) ctx.setProperty(text, "value", rest);
    else if (paragraph.children.length === 1) ctx.removeNode(paragraph);
    else ctx.removeNode(text);

    ctx.setProperty(node, "data", { hName: "div", hProperties: { className: ["callout", `callout-${kind}`] } });
    ctx.prependChild(node, {
      type: "html",
      value: `<div class="callout-title">${iconSvg(def.icon)}<span>${esc(title)}</span></div>`,
    });
  },
});
