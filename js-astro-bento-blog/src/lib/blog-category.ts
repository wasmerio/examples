type CategoryEntry = {
  data: {
    category?: string;
  };
  filePath?: string;
};

export function getBlogCategory(entry: CategoryEntry): string {
  const explicitCategory = entry.data.category?.trim();
  if (explicitCategory) return explicitCategory;

  const normalizedPath = entry.filePath?.replace(/\\/g, "/") ?? "";
  const contentPath = normalizedPath.split("/content/blog/")[1] ?? "";
  const segments = contentPath.split("/").filter(Boolean);

  return segments.length > 1 ? segments.slice(0, -1).join("/") : "uncategorized";
}
