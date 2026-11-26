import { defineMdastPlugin } from "satteri";
import {
    createSlugDirective,
    reportUnexpectedForm,
} from "./mdast-directive-utils.mjs";

// Satteri plugin that uses directives to specify a timeline to
// add to a page
export const mdastTimeline = defineMdastPlugin({
    name: "timeline",
    textDirective(node, ctx) {
        if (node.name === "timeline") {
            reportUnexpectedForm(ctx, node, ":timeline");
        }
    },
    leafDirective: createSlugDirective("timeline", "timeline", {
        slugProperty: "timeline",
        labelProperty: "label",
    }),
});
