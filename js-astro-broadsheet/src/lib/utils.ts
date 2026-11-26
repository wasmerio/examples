import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function tagPath(tag: string) {
  return `/tags/${encodeURIComponent(tag)}`;
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const chineseCharacterCount = (textOnly.match(/[\u3400-\u9fff]/g) || [])
    .length;
  const wordCount = textOnly
    .replace(/[\u3400-\u9fff]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTimeMinutes = Math.max(
    1,
    Math.ceil(chineseCharacterCount / 400 + wordCount / 200),
  );
  return `阅读约 ${readingTimeMinutes} 分钟`;
}
