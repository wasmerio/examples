import { defineExtension } from "@rigel-cms/rigel/extensions";
import CallToAction from "./CallToAction.svelte";
import CallToActionButton from "./CallToActionButton.svelte";
import CallToActionEditor from "./CallToActionEditor.svelte";

export default defineExtension({
  name: "call-to-action",
  commands: [{
    name: "insert-cta",
    label: "Insert call to action",
    slash: "cta",
    toolbar: true,
    button: CallToActionButton,
    run: context => context.insertBlock("call-to-action", { text: "Learn more", href: "/contact/" }),
  }],
  blocks: [{
    name: "call-to-action",
    label: "Call to action",
    editor: CallToActionEditor,
    render: CallToAction,
    validate(data) {
      if (typeof data.text !== "string" || !data.text.trim() || data.text.length > 140) throw new Error("CTA text must contain 1 to 140 characters.");
      if (typeof data.href !== "string" || !data.href || /[\x00-\x20\\]/.test(data.href)) throw new Error("CTA destination must be a safe URL.");
      let url: URL;
      try { url = new URL(data.href, "https://example.invalid"); }
      catch { throw new Error("CTA destination must be a safe URL."); }
      if (!["http:", "https:", "mailto:"].includes(url.protocol)) throw new Error("CTA destination must use HTTP, HTTPS, mailto, or a relative URL.");
    },
    toMarkdown: data => `[${String(data.text).replace(/[\\[\]]/g, "\\$&") }](<${encodeURI(String(data.href)).replace(/[<>]/g, encodeURIComponent)}>)`,
  }],
});
