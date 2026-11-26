/**
 * Remark plugin to generate an abstract of markdown files from the first
 * paragraph
 */

import { defineMdastPlugin } from "satteri";

export const mdastAbstract = defineMdastPlugin({
    name: "abstract",
    paragraph(node, ctx) {
        // If we already have an abstract we are done
        if (ctx.data.astro.frontmatter["abstract"]) return;

        var text = ctx.textContent(node);
        ctx.data.astro.frontmatter["abstract"] = text
            .replaceAll("\n", " ")
            .trim();
    },
});
