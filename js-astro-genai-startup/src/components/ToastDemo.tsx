import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: "success" | "error" | "warning" | "info";
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    className: "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  info: {
    icon: Info,
    className: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
};

export function ToastDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    variant: Toast["variant"],
    title: string,
    description?: string
  ) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, title, description, variant };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      {/* Demo Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={() =>
            addToast("success", "Success!", "Your changes have been saved.")
          }
          variant="outline"
          className="border-green-500/50 hover:bg-green-500/10"
        >
          Show Success
        </Button>
        <Button
          onClick={() =>
            addToast("error", "Error", "Something went wrong. Please try again.")
          }
          variant="outline"
          className="border-red-500/50 hover:bg-red-500/10"
        >
          Show Error
        </Button>
        <Button
          onClick={() =>
            addToast("warning", "Warning", "Please review your settings before continuing.")
          }
          variant="outline"
          className="border-yellow-500/50 hover:bg-yellow-500/10"
        >
          Show Warning
        </Button>
        <Button
          onClick={() =>
            addToast("info", "Info", "New features are available in the dashboard.")
          }
          variant="outline"
          className="border-blue-500/50 hover:bg-blue-500/10"
        >
          Show Info
        </Button>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const config = toastConfig[toast.variant];
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all animate-in slide-in-from-right ${config.className}`}
            >
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{toast.title}</p>
                {toast.description && (
                  <p className="text-sm opacity-90 mt-1">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 rounded-md p-1 hover:bg-background/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
