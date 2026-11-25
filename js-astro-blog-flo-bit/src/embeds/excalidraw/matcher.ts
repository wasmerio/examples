export default function urlMatcher(url: string): string | undefined {
  // should be an absolute path to an svg file
  if (url.startsWith("/src/") && url.endsWith(".svg")) {
    return url;
  }
  return undefined;
}
