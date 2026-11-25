import type lucide from '@iconify-json/lucide/icons.json';
import type brands from '@iconify-json/simple-icons/icons.json';

export type IconName =
  | `lucide:${keyof typeof lucide.icons | keyof typeof lucide.aliases}`
  | `simple-icons:${keyof typeof brands.icons | keyof typeof brands.aliases}`;

export const runtimeIcons = [
  'lucide:chevron-left',
  'lucide:chevron-right',
  'lucide:chevrons-left',
  'lucide:chevrons-right',
  'lucide:refresh-cw',
  'lucide:pause',
  'lucide:play',
  'lucide:circle-alert',
  'lucide:file-text',
  'lucide:message-circle',
  'lucide:x',
] as const satisfies readonly IconName[];

export type RuntimeIconName = (typeof runtimeIcons)[number];

const brandIcons: Record<string, IconName> = {
  github: 'simple-icons:github',
  gitlab: 'simple-icons:gitlab',
  gitea: 'simple-icons:gitea',
  gitee: 'simple-icons:gitee',
  twitter: 'simple-icons:x',
  x: 'simple-icons:x',
  facebook: 'simple-icons:facebook',
  weibo: 'simple-icons:sinaweibo',
  weixin: 'simple-icons:wechat',
  wechat: 'simple-icons:wechat',
  qq: 'simple-icons:qq',
  telegram: 'simple-icons:telegram',
  linkedin: 'simple-icons:linkedin',
  reddit: 'simple-icons:reddit',
  pinterest: 'simple-icons:pinterest',
};

export function brandIcon(name: string): IconName {
  return brandIcons[name] ?? 'lucide:share-2';
}
