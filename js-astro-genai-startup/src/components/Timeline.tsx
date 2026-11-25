import type { FC, SVGProps } from "react";

interface TimelineItem {
  title: string;
  description: string;
  date: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Line */}
            {index !== items.length - 1 && (
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
            )}

            {/* Icon */}
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
              {Icon ? (
                <Icon className="h-4 w-4 text-primary" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1 pt-0.5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{item.title}</h4>
                <span className="text-sm text-muted-foreground">
                  {item.date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
