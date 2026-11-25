import type defaults from './defaults.json';
import type { IconName } from '@/lib/icons';

export interface Link {
  name: string;
  url?: string;
  icon?: IconName;
  action?: string;
  children?: Link[];
}
export type Locale = 'zh-CN' | 'zh-TW' | 'en' | 'es';
export interface ThemeLink extends Link {
  img?: string;
  id?: string;
  title?: string;
  class?: string;
  click?: string;
}
export interface Recommendation {
  color?: string;
  title: string;
  description?: string;
  url: string;
  cover?: string;
  label?: string;
  enable?: boolean;
}
interface EmptyArrays {
  'nav.group': Record<string, (Omit<ThemeLink, 'icon'> & { icon?: string })[]>;
  'footer.group': Record<string, ThemeLink[]>;
  'nav.right.custom': ThemeLink[];
  'hometop.recommendList': Recommendation[];
  'aside.my_card.witty_words': string[];
  'aside.my_card.information': ThemeLink[];
  'aside.tags.highlight_list': string[];
  'post.award.list': { name: string; qrcode: string }[];
  'post.share.list': string[];
  'right_menu.custom_list': ThemeLink[];
  'footer.information.left': ThemeLink[];
  'footer.information.right': ThemeLink[];
  'footer.links': (Omit<ThemeLink, 'icon'> & {
    icon?: IconName | IconName[];
  })[];
  'footer.beian': { name: string; url?: string; icon?: string }[];
  'keyboard.list': {
    name?: string;
    modifier: string;
    key: string;
    action?: string;
    url?: string;
  }[];
  'memorial.date': string[];
  'search.tags': string[];
  verify_site: string[];
  'extends.head': string[];
  'extends.body': string[];
}
type Widen<T, P extends string = ''> = P extends keyof EmptyArrays
  ? EmptyArrays[P]
  : T extends null
    ? string | null
    : T extends readonly (infer U)[]
      ? Widen<U>[]
      : T extends object
        ? {
            [K in keyof T]: Widen<
              T[K],
              P extends '' ? K & string : `${P}.${K & string}`
            >;
          }
        : T;
export type ThemeConfig = Widen<typeof defaults>;
export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
export interface SiteConfig {
  site: string;
  base: string;
  title: string;
  description: string;
  locale: Locale;
  timeZone: string;
  hasCJKLanguage: boolean;
  author: { name: string; email?: string };
  pagination: number;
  menus: Link[];
  theme: ThemeConfig;
}
