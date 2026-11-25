/** A half-open range of UTF-16 offsets in plain text. */
export interface PostHighlight {
  start: number;
  end: number;
}

/** Browser-ready summary. Prepare local image URLs and reading time at build time. */
export interface PostSummaryData {
  href: string;
  title: string;
  publishDate: string;
  readingTimeMinutes: number;
  description?: string;
  highlights?: {
    title?: readonly PostHighlight[];
    description?: readonly PostHighlight[];
  };
  draft?: boolean;
  cover?: {
    src: string;
    width?: number;
    height?: number;
    srcset?: string;
    sizes?: string;
  };
}

export interface PostListPage {
  items: readonly PostSummaryData[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export interface PageRequest {
  currentPage: number;
  pageSize: number;
  href: string;
}

export interface PostListElement extends HTMLElement {
  /** Omitted/undefined fields retain their values; items: [] clears the list. */
  setPage(update: Partial<PostListPage>): void;
  setLoading(loading: boolean): void;
  setError(message?: string): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'nayuta-post-list': PostListElement;
  }

  interface HTMLElementEventMap {
    'page-request': CustomEvent<PageRequest>;
  }
}
