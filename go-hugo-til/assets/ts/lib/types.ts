export type Permalink = string;
export type PageSection = 'posts' | 'notes';

export interface PageData {
  id: string;
  permalink: Permalink;
  title: string;
  summary: string;
  section: PageSection;
  categories: string[];
  tags: string[];
  in: string[];
  out: string[];
}

export interface PageGraph {
  in: Permalink[];
  out: Permalink[];
}

export interface GraphData {
  graph: {
    [key: Permalink]: PageGraph;
  };
  pages: {
    [key: Permalink]: Partial<PageData>;
  };
}
