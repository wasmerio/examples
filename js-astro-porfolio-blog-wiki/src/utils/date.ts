export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isPublished(date: Date): boolean {
  const previewFuturePosts =
    import.meta.env.DEV &&
    import.meta.env.PUBLIC_PREVIEW_FUTURE_POSTS === "true";

  return previewFuturePosts || date <= new Date();
}
