import { siteConfig } from '../config/site';

/**
 * Form backend switching (see docs/customization.md → "Connecting the
 * forms"). Two providers are supported out of the box:
 *
 *  - 'formspree': the form posts to `siteConfig.formEndpoint`.
 *  - 'netlify':   the form is tagged for Netlify Forms at build time;
 *                 submissions appear in the Netlify dashboard.
 */
export function formAttributes(formName: string): Record<string, string> {
  if (siteConfig.formProvider === 'netlify') {
    return {
      method: 'POST',
      action: '/thank-you/',
      name: formName,
      'data-netlify': 'true',
      'netlify-honeypot': 'bot-field',
    };
  }
  return {
    method: 'POST',
    action: siteConfig.formEndpoint,
  };
}

/** Is the site configured for Netlify Forms? */
export const isNetlify = siteConfig.formProvider === 'netlify';
