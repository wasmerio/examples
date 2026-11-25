"use client";

import type { HTMLProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

type CodeBlockProps = {
  children?: ReactNode;
  className?: string;
} & HTMLProps<HTMLDivElement>;

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CodeBlockCodeProps = {
  code: string;
  language?: string;
  theme?: string;
  className?: string;
} & HTMLProps<HTMLDivElement>;

function CodeBlockCode({ code, language = "tsx", theme = "github-light", className, ...props }: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function highlight() {
      if (!code) {
        if (isActive) setHighlightedHtml("<pre><code></code></pre>");
        return;
      }

      const html = await codeToHtml(code, { lang: language, theme });
      if (isActive) {
        setHighlightedHtml(html);
      }
    }

    highlight();

    return () => {
      isActive = false;
    };
  }, [code, language, theme]);

  const classNames = cn("w-full overflow-x-auto text-[13px] [&>pre]:px-4 [&>pre]:py-4", className);

  if (highlightedHtml) {
    return <div className={classNames} dangerouslySetInnerHTML={{ __html: highlightedHtml }} {...props} />;
  }

  return (
    <div className={classNames} {...props}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

type CodeBlockGroupProps = HTMLProps<HTMLDivElement>;

function CodeBlockGroup({ children, className, ...props }: CodeBlockGroupProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export { CodeBlock, CodeBlockCode, CodeBlockGroup };
