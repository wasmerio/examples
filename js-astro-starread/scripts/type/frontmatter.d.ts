export interface Author {
  name?: string;
  avatar?: string;
}

export interface EntryData {
  title: string;
  date?: string | Date;
  cover?: string;
  author?: Author;
  categories?: string[];
  tags?: string[];
  views?: number;
  id?: string;
  lang?: string;
  description?: string;
}

export interface ProcessedAuthor {
  name: string;
  avatar: string;
}

export interface ProcessedEntry {
  data: EntryData;
  body: string;
  _collection: string;
  id: string;
  processed?: {
    date: string;
    cover: string;
    author: ProcessedAuthor;
    categories: string[];
    category: string;
    tags: string[];
    views: number;
    id: string;
  };
}

export interface AdjacentEntry {
  title: string;
  cover: string;
  date: string;
  id: string;
}

export interface IndexEntry {
  title: string;
  description: string;
  cover: string;
  categories: string[];
  tags: string[];
  date: string;
  content: string;
  id: string;
  topic: string;
  lang: string;
  route: string;
}

export interface PathInfo {
  topic: string;
  lang: string;
  id: string;
}
