import { cn } from "@/lib/utils";

interface MarqueeLogosProps {
  logos: {
    name: string;
    url: string;
  }[];
  className?: string;
  reverse?: boolean;
}

export function MarqueeLogos({
  logos,
  className,
  reverse = false,
}: MarqueeLogosProps) {
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-8",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100"
          >
            <img
              src={logo.url}
              alt={logo.name}
              className="h-12 w-auto object-contain"
            />
          </div>
        ))}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-8",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        aria-hidden="true"
      >
        {logos.map((logo, index) => (
          <div
            key={`duplicate-${index}`}
            className="flex items-center justify-center px-8 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100"
          >
            <img
              src={logo.url}
              alt={logo.name}
              className="h-12 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
