export type NodeEnv = 'development' | 'staging' | 'production' | 'test';

export interface ImportMetaEnv {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
  readonly PUBLIC_BASE_URL?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_ASSETS_URL?: string;
  readonly PUBLIC_SENTRY_DSN?: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
  readonly SENTRY_DSN?: string;
  readonly SENTRY_AUTH_TOKEN?: string;
  readonly SENTRY_ORG?: string;
  readonly SENTRY_PROJECT?: string;
  readonly DATABASE_URL?: string;
  readonly REDIS_URL?: string;
  readonly SMTP_HOST?: string;
  readonly SMTP_PORT?: string;
  readonly SMTP_USER?: string;
  readonly SMTP_PASS?: string;
  readonly JWT_SECRET?: string;
  readonly API_KEY?: string;
  readonly WEBHOOK_SECRET?: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface ProcessEnvConfig {
  readonly NODE_ENV: NodeEnv;
  readonly PORT?: string;
  readonly HOST?: string;
  readonly PUBLIC_BASE_URL?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_ASSETS_URL?: string;
  readonly PUBLIC_SENTRY_DSN?: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
  readonly SENTRY_DSN?: string;
  readonly SENTRY_AUTH_TOKEN?: string;
  readonly SENTRY_ORG?: string;
  readonly SENTRY_PROJECT?: string;
  readonly DATABASE_URL?: string;
  readonly REDIS_URL?: string;
  readonly SMTP_HOST?: string;
  readonly SMTP_PORT?: string;
  readonly SMTP_USER?: string;
  readonly SMTP_PASS?: string;
  readonly JWT_SECRET?: string;
  readonly API_KEY?: string;
  readonly WEBHOOK_SECRET?: string;
}

export interface RuntimeConfig {
  nodeEnv: NodeEnv;
  isDev: boolean;
  isStg: boolean;
  isProd: boolean;
  isTest: boolean;
  port: number;
  host: string;
  baseUrl: string;
  siteUrl: string;
  assetsUrl: string;
}

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
}

export interface RedisConfig {
  url: string;
  host: string;
  port: number;
  password?: string;
  database?: number;
  keyPrefix?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SentryConfig {
  dsn: string;
  environment: NodeEnv;
  tracesSampleRate: number;
  debug: boolean;
  org?: string;
  project?: string;
  authToken?: string;
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}

export interface SecurityConfig {
  jwtSecret: string;
  apiKey: string;
  webhookSecret: string;
  corsOrigins: string[];
  rateLimitMax: number;
  rateLimitWindow: number;
}

export interface FeatureFlags {
  enableAnalytics: boolean;
  enableSentry: boolean;
  enableRedis: boolean;
  enableDatabase: boolean;
  enableSmtp: boolean;
  enableAuth: boolean;
  enableWebhooks: boolean;
}

export interface AppConfig {
  runtime: RuntimeConfig;
  database?: DatabaseConfig;
  redis?: RedisConfig;
  smtp?: SmtpConfig;
  sentry?: SentryConfig;
  analytics?: AnalyticsConfig;
  security?: SecurityConfig;
  features: FeatureFlags;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: NodeEnv;
      readonly PORT?: string;
      readonly HOST?: string;
      readonly PUBLIC_BASE_URL?: string;
      readonly PUBLIC_SITE_URL?: string;
      readonly PUBLIC_ASSETS_URL?: string;
      readonly PUBLIC_SENTRY_DSN?: string;
      readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
      readonly PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
      readonly SENTRY_DSN?: string;
      readonly SENTRY_AUTH_TOKEN?: string;
      readonly SENTRY_ORG?: string;
      readonly SENTRY_PROJECT?: string;
      readonly DATABASE_URL?: string;
      readonly REDIS_URL?: string;
      readonly SMTP_HOST?: string;
      readonly SMTP_PORT?: string;
      readonly SMTP_USER?: string;
      readonly SMTP_PASS?: string;
      readonly JWT_SECRET?: string;
      readonly API_KEY?: string;
      readonly WEBHOOK_SECRET?: string;
    }
  }

  interface ImportMetaEnv {
    MODE: string;
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
    SSR: boolean;
    PUBLIC_BASE_URL?: string;
    PUBLIC_SITE_URL?: string;
    PUBLIC_ASSETS_URL?: string;
    PUBLIC_SENTRY_DSN?: string;
    PUBLIC_GOOGLE_ANALYTICS_ID?: string;
    PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
    SENTRY_DSN?: string;
    SENTRY_AUTH_TOKEN?: string;
    SENTRY_ORG?: string;
    SENTRY_PROJECT?: string;
    DATABASE_URL?: string;
    REDIS_URL?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    JWT_SECRET?: string;
    API_KEY?: string;
    WEBHOOK_SECRET?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
