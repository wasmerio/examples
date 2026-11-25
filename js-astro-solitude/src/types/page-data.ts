import type { AboutData } from './about';
import type { BrevityItem, FriendLink } from './page';

export interface FriendGroup {
  class_name?: string;
  class_desc?: string;
  descr?: string;
  type?: 'card' | 'item' | 'discn';
  title_link?: string;
  title_link_text?: string;
  sort?: 'default' | 'random';
  suffix?: string;
  topimg_suffix?: string;
  link_list: FriendLink[];
}

export interface LinksData {
  links: FriendGroup[];
  banner_suffix?: string;
}

export interface KitData {
  groups: {
    name: string;
    description?: string;
    items: {
      name: string;
      specification?: string;
      description?: string;
      image?: string;
      link?: string;
    }[];
  }[];
}

export interface BrevityData {
  title?: string;
  items: BrevityItem[];
  header?: {
    description?: string;
    cover?: string;
    button?: { text: string; link: string };
  };
}

export interface PageData {
  about: AboutData;
  links: LinksData;
  kit: KitData;
  brevity: BrevityData;
}
