import { createCustomer, getCustomerAccessToken } from "@/lib/shopify";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password || !firstName) {
      return new Response("Email and password are required", { status: 400 });
    }

    // Create customer via Shopify API
    const { customer, customerCreateErrors } = await createCustomer({
      email,
      password,
      firstName,
    });

    if (customerCreateErrors && customerCreateErrors.length > 0) {
      return new Response(JSON.stringify({ errors: customerCreateErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate token
    const { token } = await getCustomerAccessToken({ email, password });

    const response = new Response(JSON.stringify({ customer, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // Set the authentication token in a cookie without HttpOnly
    response.headers.set("Set-Cookie", `token=${token}; Path=/; SameSite=Lax`);

    return response;
  } catch (error: any) {
    console.error("Error in API:", error);
    return new Response(
      JSON.stringify({
        errors: [
          {
            code: "INTERNAL_ERROR",
            message: error.message || "An unknown error occurred",
          },
        ],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
