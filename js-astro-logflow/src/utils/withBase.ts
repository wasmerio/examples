export function withBase(path: string) {
  if (!path.startsWith("/")) {
    return path;
  }
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
}

export function normalizeRoutePath(pathname: string) {
  const basePath = import.meta.env.BASE_URL.replace(/\/+$/, "");
  let routePath = pathname;

  if (basePath && basePath !== "/") {
    if (routePath === basePath) {
      routePath = "/";
    } else if (routePath.startsWith(`${basePath}/`)) {
      routePath = routePath.slice(basePath.length);
    }
  }

  routePath = `/${routePath.replace(/^\/+|\/+$/g, "")}`;
  return routePath === "//" ? "/" : routePath;
}

export function isRouteActive(pathname: string, href: string) {
  const currentPath = normalizeRoutePath(pathname);
  const targetPath = normalizeRoutePath(href);

  return targetPath === "/"
    ? currentPath === "/"
    : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}
