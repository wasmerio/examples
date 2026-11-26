// Both arguments are site paths in the same locale (e.g. /pt-br/docs).
export function isActive(href: string, pathname: string, home = '/'): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return href === home ? path === home : path === href || path.startsWith(`${href}/`);
}
