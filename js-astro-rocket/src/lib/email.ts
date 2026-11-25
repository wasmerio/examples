import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from 'astro:env/server';

/**
 * Whether the email-backed forms have the keys they need.
 *
 * Both forms used to find this out the same way: by being submitted. The
 * contact endpoint returns "Email service is not configured" with a 500 — but
 * only after a visitor has typed a name, an address and a message and pressed
 * send. A form that looks like it works and doesn't is worse than one that
 * says so up front.
 *
 * These read at render time instead, so a form can decide its own state before
 * anyone types into it. Both are `optional` in the env schema, so a missing
 * key is a valid state rather than a build error.
 *
 * Where the notice goes matters as much as the check. A "not configured" line
 * is a message for whoever is building the site, not for their visitors, so it
 * belongs behind `import.meta.env.DEV`. In production the form disables its
 * submit instead of inviting input that cannot go anywhere.
 */

/** The contact form needs a key to send with. */
export const contactConfigured = Boolean(RESEND_API_KEY);

/** The newsletter needs an audience to add the address to as well. */
export const newsletterConfigured = Boolean(RESEND_API_KEY && RESEND_AUDIENCE_ID);
