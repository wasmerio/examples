import { defineMdastPlugin } from "satteri";

// Process links
export const mdastLink = defineMdastPlugin({
    name: "link",
    link(node, ctx) {
        if (!node.url) return;
        try {
            new URL(node.url);
        } catch {
            const url = node.url
                .trim()
                .replace(/[\s$*_+~.()'"!\-:@]+/g, " ")
                .replace(/\s+/g, "-")
                .toLowerCase();
            ctx.setProperty(node, "url", url);

            const frontmatter = ctx.data.astro.frontmatter;
            (frontmatter.outgoingLinks ??= []).push(url);
        }
    },
});
