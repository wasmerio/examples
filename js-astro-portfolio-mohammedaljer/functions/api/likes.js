export const onRequestGet = async (context) => {
  const key = "likes_global";
  const likes = Number((await context.env.PORTFOLIO_KV.get(key)) || "0");
  return new Response(JSON.stringify({ likes }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
};
