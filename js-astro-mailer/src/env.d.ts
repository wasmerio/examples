import type { SearchItem } from "@/lib/search";

declare global {
  interface Window {
    mailerSearch?: {
      load: () => Promise<SearchItem[]>;
      search: (query: string) => Promise<SearchItem[]>;
      escapeHtml: (value: string) => string;
      resultMarkup: (item: SearchItem) => string;
    };
  }
}

export {};
