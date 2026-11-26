// src/lib/sentry.ts
import * as Sentry from '@sentry/node';

const SENTRY_DSN = process.env.SENTRY_DSN ?? '';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sentryを初期化します。
 * 本番環境かつDSNが設定されている場合のみ初期化を行います。
 *
 * @returns {void} 返り値はありません。
 */
export const initSentry = (): void => {
  if (isProduction && SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
    console.log('✅ Sentry initialized (Production)');
  } else {
    console.log('ℹ️ Sentry not initialized (Development mode)');
  }
};

/**
 * 例外（Exception）をSentryに送信します。
 * 本番環境ではSentryへ送信し、開発環境ではコンソールにエラー情報を出力します。
 *
 * @param {Error} error - キャプチャしたいErrorオブジェクト
 * @returns {void} 返り値はありません。
 */
export const captureException = (error: Error): void => {
  if (isProduction && Sentry.getClient()) {
    Sentry.captureException(error);
  } else {
    console.error('[DEV] Captured Exception:', error);
  }
};

/**
 * 警告（Warning）メッセージをSentryに送信します。
 * 本番環境ではSentryへ送信し、開発環境ではコンソールに警告情報を出力します。
 *
 * @param {string} message - 警告内容を表す文字列
 * @returns {void} 返り値はありません。
 */
export const captureWarning = (message: string): void => {
  if (isProduction && Sentry.getClient()) {
    Sentry.captureMessage(message, 'warning');
  } else {
    console.warn('[DEV] Captured Warning:', message);
  }
};

/**
 * HTTPレスポンスエラーをSentryに送信します。
 * 例えばAPIエラーなど、URL、ステータスコード、レスポンスボディを付加してレポートします。
 * 本番環境ではSentryへ送信し、開発環境ではコンソールにエラー情報を出力します。
 *
 * @param {string} url - エラーが発生したリクエストURL
 * @param {number} status - HTTPステータスコード
 * @param {unknown} [responseBody] - （オプション）レスポンスボディの内容
 * @returns {void} 返り値はありません。
 */
export const captureHttpError = (url: string, status: number, responseBody?: unknown): void => {
  const message = `HTTP Error: ${status} at ${url}`;

  if (isProduction && Sentry.getClient()) {
    Sentry.captureMessage(message, {
      level: 'error',
      extra: {
        url,
        status,
        responseBody,
      },
    });
  } else {
    console.error('[DEV] Captured HTTP Error:', { url, status, responseBody });
  }
};
