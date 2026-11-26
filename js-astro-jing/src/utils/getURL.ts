const normalizePathname = (pathname: string): string =>
  pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");

export const getCanonicalURL = (url: URL, site: URL | undefined): string => {
  const pathname = normalizePathname(url.pathname);
  return new URL(pathname, site).toString().replace(/\/$/, "");
};

export const getMarkdownURL = (canonicalURL: string): string => {
  const url = new URL(canonicalURL);
  url.pathname = `${url.pathname.replace(/\/$/, "")}.md`;
  return url.toString();
};

export const getMarkdownPath = (url: URL): string => {
  const pathname = normalizePathname(url.pathname).replace(/\/$/, "");
  return `${pathname}.md`;
};
