import { useState } from "react";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
  onChange?: (isAnnual: boolean) => void;
  defaultAnnual?: boolean;
  className?: string;
}

export function PricingToggle({
  onChange,
  defaultAnnual = false,
  className,
}: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(defaultAnnual);

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    onChange?.(annual);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 p-1 rounded-full bg-muted",
        className
      )}
    >
      <button
        onClick={() => handleToggle(false)}
        className={cn(
          "px-6 py-2 rounded-full text-sm font-medium transition-all",
          !isAnnual
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Monthly
      </button>
      <button
        onClick={() => handleToggle(true)}
        className={cn(
          "px-6 py-2 rounded-full text-sm font-medium transition-all relative",
          isAnnual
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Annual
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-500 text-white">
          Save 20%
        </span>
      </button>
    </div>
  );
}
