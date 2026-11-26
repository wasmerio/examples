/** Prefix an absolute-path href with the configured base. url("/blog/") */
export const url = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

/** One rule for every image slot (heroes, covers, gallery, cards): a
 *  public/ path gets the base prefix, a full http(s) URL passes through. */
export const resolveImg = (src: string) =>
  /^https?:\/\//.test(src) ? src : url(src);

/** True for an absolute http(s) URL. External links get target="_blank" +
 *  rel="noopener"; undefined, relative, and anchor hrefs are internal. */
export const isExternal = (href?: string) =>
  !!href && /^https?:\/\//.test(href);
