// Renaming a key breaks every page using it and every snippet whose `component_name` matches.
// Lowercase keys override the HTML element MDX would otherwise emit.
import ProseTable from "./ProseTable.astro";

const modules = import.meta.glob("../**/*.astro", { eager: true });

export const mdxComponents: Record<string, unknown> = {
  ...Object.fromEntries(
    Object.entries(modules).map(([path, module]) => [
      path
        .split("/")
        .pop()!
        .replace(/\.astro$/, ""),
      (module as { default: unknown }).default,
    ])
  ),
  table: ProseTable,
};
