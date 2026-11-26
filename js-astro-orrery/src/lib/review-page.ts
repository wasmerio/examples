/**
 * Where the "Formgong" credit next to the form points: your own review page on Formgong, where your clients read and
 * leave reviews. The build asks Formgong once (POST /api/review-page with your form's access key and your site's
 * address); Formgong makes the page the first time, with its public switch on, and answers with its address every
 * time after. You can turn the page off in the Formgong dashboard (Reviews → your site → Settings).
 * Without a real key or address the credit links formgong.com/review-page/<key>, which finds the page on the first
 * click; with the placeholder key or another form backend it links formgong.com.
 */
const FORMGONG = "https://formgong.com";
let page: Promise<string> | undefined;

export function reviewPageUrl(accessKey: string, endpoint: string, site: URL | undefined): Promise<string> {
  page ??= (async () => {
    if (!/^fk_[A-Za-z0-9_-]{8,64}$/.test(accessKey) || accessKey === "fk_your_access_key" || !endpoint.startsWith(FORMGONG)) return FORMGONG;
    const fallback = `${FORMGONG}/review-page/${accessKey}`;
    try {
      const response = await fetch(`${FORMGONG}/api/review-page`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ access_key: accessKey, site_url: site?.href ?? null }),
        signal: AbortSignal.timeout(5000),
      });
      const data = (await response.json()) as { url?: unknown };
      return typeof data.url === "string" && data.url.startsWith(`${FORMGONG}/`) ? data.url : fallback;
    } catch {
      return fallback;
    }
  })();
  return page;
}
