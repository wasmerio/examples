/// <reference types="astro/client" />

// Extend Astro's built-in types
declare module "astro" {
  interface AstroBuiltinProps {
    class?: string;
    className?: string;
  }
}

// Component prop types
export interface ComponentProps {
  class?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

// Layout props
export interface LayoutProps extends ComponentProps {
  title?: string;
  description?: string;
  lang?: string;
}

// Form data types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
