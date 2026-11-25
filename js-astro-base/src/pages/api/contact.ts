/**
 * NOTE: This API route is not currently used by the contact form.
 * The contact form now uses Web3Forms (https://web3forms.com) directly.
 * This route is kept for reference or if you want to implement a custom backend.
 */

import type { APIRoute } from "astro";
import type { APIResponse, ContactFormData } from "../../types/astro";
import { validateEmail, validateName, validateMessage, sanitizeInput } from "../../utils/validation";
import { ValidationError, handleError, logError } from "../../utils/errors";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = sanitizeInput(formData.get("name")?.toString() || "");
    const email = sanitizeInput(formData.get("email")?.toString() || "");
    const message = sanitizeInput(formData.get("message")?.toString() || "");

    // Validate inputs
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      throw new ValidationError(nameValidation.error || "Invalid name", "name");
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new ValidationError(emailValidation.error || "Invalid email", "email");
    }

    const messageValidation = validateMessage(message);
    if (!messageValidation.isValid) {
      throw new ValidationError(messageValidation.error || "Invalid message", "message");
    }

    // Here you would typically:
    // 1. Send an email using a service like SendGrid, Resend, etc.
    // 2. Save to a database
    // 3. Send to a webhook
    // For now, we'll just log it (in production, implement your preferred method)
    
    logError(
      { name, email, message },
      "Contact form submission (implement email/database handler)"
    );

    // Return success response
    const response: APIResponse<ContactFormData> = {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      data: { name, email, message },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    logError(error, "Contact form API");

    const errorMessage = handleError(error);
    const statusCode = error instanceof ValidationError ? 400 : 500;

    const errorResponse: APIResponse = {
      success: false,
      error: errorMessage,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
