import type { StarreadThemeConfig } from '../scripts/type/config';

export interface ClientConfig {
  enhanceApp?: (context: {
    config: StarreadThemeConfig;
  }) => void | Promise<void>;
  layouts?: Record<string, unknown>;
  components?: Record<string, unknown>;
  widgets?: Record<string, unknown>;
}

export function defineClientConfig(config: ClientConfig): ClientConfig {
  return config;
}

export default {
  enhanceApp: undefined,
  layouts: {},
  components: {},
  widgets: {},
};