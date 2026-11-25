import source from '../../blog.config';
import { canonicalLocale } from './locale';
import { validateConfig } from './validate-config';
import { siteAddress } from './site-url';
const config = {
  ...source,
  site: {
    ...source.site,
    ...siteAddress(source.site.baseUrl),
    defaultLocale: canonicalLocale(source.site.defaultLocale),
    locales: source.site.locales.map(canonicalLocale),
    localePrefixPolicy: source.site.localePrefixPolicy ?? 'redirect-to-default',
  },
};

validateConfig(config);
export default config;
