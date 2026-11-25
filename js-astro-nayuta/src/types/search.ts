export interface SearchResultData {
  url: string;
  meta: {
    title: string;
    publishDate: string;
    readingTimeMinutes: string;
    draft?: string;
  };
  excerpt: string;
}

export interface SearchMatch {
  data(): Promise<SearchResultData>;
}

export interface Pagefind {
  search(query: string): Promise<{ results: SearchMatch[] }>;
}
