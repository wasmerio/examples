import { defineMdastPlugin } from "satteri";
import {
    createSlugDirective,
    reportUnexpectedForm,
} from "./mdast-directive-utils.mjs";

// Generate goto directives
export const mdastGoto = defineMdastPlugin({
    name: "goto",
    textDirective(node, ctx) {
        if (node.name === "goto") {
            reportUnexpectedForm(ctx, node, ":goto");
        }
    },
    leafDirective: createSlugDirective("goto", "goto", {
        linksToArticle: true,
    }),
});
