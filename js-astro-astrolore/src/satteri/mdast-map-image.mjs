import { defineMdastPlugin } from "satteri";
import {
    reportMissingId,
    reportUnexpectedForm,
} from "./mdast-directive-utils.mjs";

export const mdastMapImage = defineMdastPlugin({
    name: "mapImage",
    textDirective(node, ctx) {
        if (node.name === "map") {
            reportUnexpectedForm(ctx, node, ":map");
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "map") return;

        const attributes = node.attributes || {};
        const className = attributes.class ?? "";
        const id = attributes.id;

        if (!id) {
            reportMissingId(ctx, node, "map");
            return;
        }

        ctx.data.astro.frontmatter.hasMap = true;

        const data = node.data || (node.data = {});
        data.hName = "map";
        data.hProperties = {
            class: className,
            slug: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
