import type { SiteConfig } from '../site.config';
import { t, type Locale } from '../i18n';
import type { COPYRIGHT_LICENSE_NOTICES } from '../i18n-licenses';

type CopyrightLicenseKey = keyof (typeof COPYRIGHT_LICENSE_NOTICES)['zh-CN'];

const LICENSE_ICONS: Record<string, string> = {
  CC_BY_4_0: 'CC-BY',
  CC_BY_SA_4_0: 'CC-BY-SA',
  CC_BY_NC_4_0: 'CC-BY-NC',
  CC_BY_NC_SA_4_0: 'CC-BY-NC-SA',
  CC_BY_NC_ND_4_0: 'CC-BY-NC-ND',
  CC_BY_ND_4_0: 'CC-BY-ND',
  CC_ZERO_1_0: 'CC0',
  MIT: 'MIT',
  BSD_2_CLAUSE: 'BSD-2',
  BSD_3_CLAUSE: 'BSD-3',
  APACHE_2_0: 'Apache-2.0',
  GPL_2_0: 'GPL-2.0',
  GPL_3_0: 'GPL-3.0',
  LGPL_2_1: 'LGPL-2.1',
  LGPL_3_0: 'LGPL-3.0',
  MPL_2_0: 'MPL-2.0',
  EPL_2_0: 'EPL-2.0',
  UNLICENSE: 'Unlicense',
  WTFPL: 'WTFPL',
  AGPL_3_0: 'AGPL-3.0',
  CUSTOM: 'Custom',
};

export function getCopyrightNotice(
  licenseType: string,
  locale: Locale,
): string {
  const notices = t(locale).copyrightLicenseNotices;
  if (licenseType in notices) {
    return notices[licenseType as CopyrightLicenseKey];
  }
  return '';
}

export function getLicenseIcon(licenseType: string): string | null {
  return LICENSE_ICONS[licenseType] ?? null;
}

export function formatCopyrightBlock(
  title: string,
  author: string,
  url: string,
  locale: Locale,
): string {
  return t(locale).copyrightFormatTemplate(title, author, url);
}

export function shouldShowCopyright(config: SiteConfig['copyright']): boolean {
  return config.enable;
}
