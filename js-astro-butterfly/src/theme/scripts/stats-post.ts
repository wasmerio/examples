const API = 'https://cdn.busuanzi.cc/api.php';

export async function fetchCounts(url: string, signal: AbortSignal) {
  signal.throwIfAborted();
  const response = await fetch(API, {
    method: 'POST',
    // A string body matches 3.6.9's text/plain request and avoids a CORS preflight.
    body: JSON.stringify({ url, referrer: '' }),
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    signal,
  });
  if (!response.ok) return null;
  const data: Record<string, unknown> | null = await response.json();
  return data;
}
