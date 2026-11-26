import { defineExtension } from "@rigel-cms/rigel/extensions";
import WidgetsButton from "./WidgetsButton.svelte";
import Callout from "./Callout.svelte";
import CalloutEditor from "./CalloutEditor.svelte";

export default defineExtension({
  name: "widgets",
  groups: [{ name: "widgets", label: "Widgets", button: WidgetsButton }],
  commands: [{
    name: "insert-callout",
    label: "Insert callout",
    slash: "callout",
    group: "widgets",
    run: context => context.insertBlock("callout", { title: "Good to know", message: "Add a useful note for your readers.", tone: "info" }),
  }, {
    name: "insert-warning",
    label: "Insert warning",
    slash: "warning",
    group: "widgets",
    run: context => context.insertBlock("callout", { title: "Before you begin", message: "Describe what readers should watch out for.", tone: "warning" }),
  }],
  blocks: [{
    name: "callout",
    label: "Callout",
    editor: CalloutEditor,
    render: Callout,
    validate(data) {
      if (typeof data.title !== "string" || data.title.length > 140) throw new Error("Callout title must be at most 140 characters.");
      if (typeof data.message !== "string" || data.message.length > 2000) throw new Error("Callout message must be at most 2000 characters.");
      if (data.tone !== "info" && data.tone !== "warning") throw new Error("Choose an info or warning callout.");
    },
    toMarkdown: data => [data.title, data.message].map(value => `> ${String(value).replace(/[\\`*_{}\[\]<>#!|]/g, "\\$&").replace(/\r?\n/g, "\n> ")}`).join("\n>\n"),
  }],
});
