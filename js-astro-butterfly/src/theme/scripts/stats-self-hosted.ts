export async function fetchSelfHostedCounts(endpoint: string, path: string, signal: AbortSignal) {
  const url = new URL(endpoint);
  if (url.protocol !== 'https:') throw new Error('Statistics endpoint requires HTTPS');
  const body = JSON.stringify({ path, request_id: crypto.randomUUID() });
  const send = async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      signal.throwIfAborted();
      // Give the initial connection time on higher-latency networks.
      const timeout = AbortSignal.timeout(attempt === 0 ? 8000 : 3500);
      try {
        const response = await fetch(url, {
          method: 'POST',
          body,
          credentials: 'include',
          redirect: 'error',
          keepalive: true,
          signal: AbortSignal.any([signal, timeout]),
        });
        if (response.ok) return await response.json() as Record<string, unknown>;
        if (response.status !== 502 && response.status !== 504) return null;
      } catch {
        signal.throwIfAborted();
      }
    }
    return null;
  };
  // Send the next page view after the previous response can establish the visitor cookie.
  return navigator.locks ? navigator.locks.request('blog-stats', { signal }, send) : send();
}
