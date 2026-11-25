export const creativeCommonsLicenses = [
  'CC BY 4.0',
  'CC BY-SA 4.0',
  'CC BY-ND 4.0',
  'CC BY-NC 4.0',
  'CC BY-NC-SA 4.0',
  'CC BY-NC-ND 4.0',
] as const;

export type CreativeCommonsLicense = (typeof creativeCommonsLicenses)[number];

export interface CopyrightOptions {
  enabled?: boolean;
  license?: CreativeCommonsLicense;
}

export const creativeCommonsLicenseUrls: Record<
  CreativeCommonsLicense,
  string
> = {
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC BY-ND 4.0': 'https://creativecommons.org/licenses/by-nd/4.0/',
  'CC BY-NC 4.0': 'https://creativecommons.org/licenses/by-nc/4.0/',
  'CC BY-NC-SA 4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  'CC BY-NC-ND 4.0': 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
};
