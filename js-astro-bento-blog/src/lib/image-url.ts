/** Turns Drive download/view URLs into addresses that render in image elements. */
export function toEmbeddableImageUrl(src: string): string {
  try {
    const url = new URL(src);
    const isGoogleDrive = url.hostname === "drive.google.com" || url.hostname === "www.drive.google.com";
    if (!isGoogleDrive) return src;
    const id = url.searchParams.get("id") ?? url.pathname.match(/\/d\/([^/]+)/)?.[1];
    return id ? `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}=w2000` : src;
  } catch {
    return src;
  }
}