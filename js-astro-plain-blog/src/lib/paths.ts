// Deployment base path, e.g. "/PlainBlog/" on a GitHub Pages project site or
// "/" on a root domain. SITE_URL stays free of the path so that base and site
// compose: canonical and RSS URLs are built from both.
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** Prefix a site-root path with the deployment base path. */
export const sitePath = (path: string) => `${base}/${path.replace(/^\/+/, "")}`;
