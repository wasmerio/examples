export const onRequestPost = async (context) => {
  const key = "likes_global";
  const current = Number((await context.env.PORTFOLIO_KV.get(key)) || "0");
  const next = current + 1;
  await context.env.PORTFOLIO_KV.put(key, String(next));
  return new Response(JSON.stringify({ likes: next }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
};
