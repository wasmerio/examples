import type { ComponentProps, HTMLProps, ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { Markdown } from "./markdown";

type MessageProps = {
  children: ReactNode;
  className?: string;
} & HTMLProps<HTMLDivElement>;

function Message({ children, className, ...props }: MessageProps) {
  return (
    <div className={cn("flex gap-3", className)} {...props}>
      {children}
    </div>
  );
}

type MessageAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  delayMs?: number;
  className?: string;
};

function MessageAvatar({ src, alt, fallback, delayMs, className }: MessageAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarImage alt={alt} src={src} />
      {fallback ? <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback> : null}
    </Avatar>
  );
}

type MessageContentProps = {
  children: ReactNode;
  markdown?: boolean;
  className?: string;
} & HTMLProps<HTMLDivElement>;

function MessageContent({ children, markdown = false, className, ...props }: MessageContentProps) {
  const classNames = cn(
    "prose break-words whitespace-normal rounded-lg bg-secondary p-2 text-sm text-foreground dark:prose-invert",
    className,
  );

  if (markdown) {
    return (
      <Markdown className={classNames} {...props}>
        {children as string}
      </Markdown>
    );
  }

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}

type MessageActionsProps = {
  children: ReactNode;
  className?: string;
} & HTMLProps<HTMLDivElement>;

function MessageActions({ children, className, ...props }: MessageActionsProps) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

type MessageActionProps = {
  className?: string;
  tooltip: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
} & ComponentProps<typeof Tooltip>;

function MessageAction({ tooltip, children, className, side = "top", ...props }: MessageActionProps) {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={className} side={side}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { Message, MessageAction, MessageActions, MessageAvatar, MessageContent };
