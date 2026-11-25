import type { APIRoute } from "astro";
import { getProducts } from "@/lib/shopify";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const sortKey = url.searchParams.get("sortKey") as string;
  const reverse = url.searchParams.get("reverse") === "true";

  try {
    const { products, pageInfo } = await getProducts({
      sortKey,
      reverse,
      cursor: cursor || undefined,
    });

    return new Response(JSON.stringify({ products, pageInfo }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
