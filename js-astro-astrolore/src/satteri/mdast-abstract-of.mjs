import { defineMdastPlugin } from "satteri";
import {
    createSlugDirective,
    reportUnexpectedForm,
} from "./mdast-directive-utils.mjs";

export const mdastAbstractOf = defineMdastPlugin({
    name: "abstractOf",
    textDirective(node, ctx) {
        if (node.name === "abstractOf") {
            reportUnexpectedForm(ctx, node, ":abstractOf");
        }
    },
    leafDirective: createSlugDirective("abstractOf", "abstractof", {
        linksToArticle: true,
    }),
});
