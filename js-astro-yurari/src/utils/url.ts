/**
 * サイト内パスに base (GitHub Pages のプロジェクトページなど `/repo/`) を付ける。
 * base が "/" のときはそのまま返す。
 */
export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 表示中の pathname が、サイト内パス target のページか (末尾スラッシュの違いは無視) */
export function isCurrent(pathname: string, target: string) {
  const trim = (s: string) => s.replace(/\/$/, "") || "/";
  return trim(pathname) === trim(withBase(target));
}
