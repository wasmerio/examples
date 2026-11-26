import { defineMdastPlugin } from "satteri";
import {
    createSlugDirective,
    reportUnexpectedForm,
} from "./mdast-directive-utils.mjs";

// Generate goto directives
export const mdastFamilyTree = defineMdastPlugin({
    name: "familyTree",
    textDirective(node, ctx) {
        if (node.name === "familyTree") {
            reportUnexpectedForm(ctx, node, ":familyTree");
        }
    },
    leafDirective: createSlugDirective("familyTree", "familytree"),
});
