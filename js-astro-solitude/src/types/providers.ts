export type SearchProvider = 'local' | 'algolia' | 'docsearch' | false;
export type CoverColorProvider = 'local' | 'api' | 'ave' | false;
export type CommentProvider =
  'twikoo' | 'waline' | 'valine' | 'artalk' | 'giscus';

export interface FeatureModules {
  search: SearchProvider;
  friend_links: boolean;
  keyboard: boolean;
  music: boolean;
  right_menu: boolean;
  translate: boolean;
  covercolor: CoverColorProvider;
}
