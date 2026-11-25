export interface PaginationState {
  currentPage: number;
  lastPage: number;
  firstPageUrl: string;
}

export interface PaginationElement extends HTMLElement {
  /** Update a dynamic query-parameter selector, retaining omitted fields. */
  setPage(update: Partial<PaginationState>): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'nayuta-pagination': PaginationElement;
  }
}
