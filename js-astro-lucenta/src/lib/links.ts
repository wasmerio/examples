/** Opens real outbound links in a new tab; placeholders such as "#" stay on the page. */
export const outbound = (href: string, rel = "noopener") =>
  /^https?:\/\//.test(href) ? { rel, target: "_blank" } : {};
