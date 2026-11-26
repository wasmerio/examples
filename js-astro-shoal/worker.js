// Used only by the "Deploy to Cloudflare" button. That button stores the access key as a runtime
// secret, after the static build has already written fk_your_access_key into the pages, so this
// swaps the placeholder for the secret as each page is served. Other hosts ignore this file.
const PLACEHOLDER = "fk_your_access_key";

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const key = env.PUBLIC_FORMGONG_ACCESS_KEY;
    if (!key || key === PLACEHOLDER || !(response.headers.get("content-type") || "").startsWith("text/html")) return response;
    return new HTMLRewriter()
      .on(`input[name="access_key"][value="${PLACEHOLDER}"]`, { element: (input) => input.setAttribute("value", key) })
      .transform(response);
  },
};
