/**
 * Reports a directive written in the wrong form, e.g. a leaf-only directive
 * (`::name`) invoked as a text directive (`:name`), or vice versa.
 */
export function reportUnexpectedForm(ctx, node, directiveMarkup) {
    ctx.report({
        message: `Unexpected \`${directiveMarkup}\` directive`,
        node,
        severity: "error",
    });
}

/**
 * Reports a `::name{#id}` directive missing its required `id` attribute.
 */
export function reportMissingId(ctx, node, directiveName) {
    ctx.report({
        message: `Missing \`id\` on \`::${directiveName}\` directive`,
        node,
        severity: "error",
    });
}

/**
 * Builds a `leafDirective` handler for directives of the form
 * `::name{#id}` that render as a single hast element referencing a slug,
 * optionally forwarding the directive's `label` under `labelProperty`.
 *
 * Pass `linksToArticle: true` for directives whose `id` points at another
 * article, to record it in `frontmatter.outgoingLinks` for backlink lookup.
 */
export function createSlugDirective(directiveName, hName, options = {}) {
    const { slugProperty = "slug", labelProperty, linksToArticle } = options;

    return function leafDirective(node, ctx) {
        if (node.name !== directiveName) return;

        const attributes = node.attributes || {};
        const id = attributes.id;

        if (!id) {
            reportMissingId(ctx, node, directiveName);
            return;
        }

        const hProperties = { [slugProperty]: id };
        if (labelProperty) {
            hProperties[labelProperty] = node.label || undefined;
        }

        const data = node.data || (node.data = {});
        data.hName = hName;
        data.hProperties = hProperties;
        ctx.setProperty(node, "data", data);

        if (linksToArticle) {
            const frontmatter = ctx.data.astro.frontmatter;
            (frontmatter.outgoingLinks ??= []).push(id);
        }
    };
}
