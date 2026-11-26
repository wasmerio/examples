import { defineMdastPlugin } from "satteri";
import {
    createSlugDirective,
    reportUnexpectedForm,
} from "./mdast-directive-utils.mjs";

// Satteri plugin that uses directives to specify a table to
// add to a page
export const mdastRngTable = defineMdastPlugin({
    name: "rngTable",
    textDirective(node, ctx) {
        if (node.name === "table") {
            reportUnexpectedForm(ctx, node, ":table");
        }
    },
    leafDirective: createSlugDirective("table", "rngtable", {
        slugProperty: "table",
        labelProperty: "label",
    }),
});
