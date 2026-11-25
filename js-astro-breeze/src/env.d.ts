// src/env.d.ts

interface Window {
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
  ) => void;
}
