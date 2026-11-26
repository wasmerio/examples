import { defineMdastPlugin } from "satteri";
import {
    createSlugDirective,
    reportUnexpectedForm,
} from "./mdast-directive-utils.mjs";

// Satteri plugin that uses directives to embed a statblock
// referenced by slug into a page
export const mdastStatblock = defineMdastPlugin({
    name: "statblock",
    textDirective(node, ctx) {
        if (node.name === "statblock") {
            reportUnexpectedForm(ctx, node, ":statblock");
        }
    },
    leafDirective: createSlugDirective("statblock", "statblock"),
});
