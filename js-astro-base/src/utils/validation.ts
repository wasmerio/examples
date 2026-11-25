/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Validates a name field
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim() === "") {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: "Name must be less than 100 characters" };
  }

  return { isValid: true };
}

/**
 * Validates a message field
 */
export function validateMessage(message: string): ValidationResult {
  if (!message || message.trim() === "") {
    return { isValid: false, error: "Message is required" };
  }

  if (message.trim().length < 10) {
    return { isValid: false, error: "Message must be at least 10 characters" };
  }

  if (message.trim().length > 5000) {
    return { isValid: false, error: "Message must be less than 5000 characters" };
  }

  return { isValid: true };
}

/**
 * Sanitizes input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 5000); // Limit length
}
