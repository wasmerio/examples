import type { PageSection, PageData } from './types';

export default class Page {
  public readonly permalink: string;
  public readonly title: string;
  public readonly summary: string;
  public readonly categories: string[];
  public readonly tags: string[];
  private _section: PageSection | null;

  constructor(pageData: Partial<PageData>) {
    if (!pageData.permalink) {
      throw new Error('Received page data without a permalink');
    }

    this.permalink = pageData.permalink;
    this.title = pageData.title ?? '';
    this.summary = pageData.summary ?? '';
    this._section = pageData.section ?? null;
    this.categories = pageData.categories ?? [];
    this.tags = pageData.tags ?? [];
  }

  get id(): string {
    return this.permalink;
  }

  get section(): PageSection {
    if (!this._section) {
      if (this.permalink.includes('/posts/')) {
        this._section = 'posts';
      } else if (this.permalink.includes('/notes/')) {
        this._section = 'notes';
      } else {
        throw new Error(`Unable to determine page section from '${this.permalink}' permalink`);
      }
    }

    return this._section;
  }
}
