// The two form addresses for this site. This is the only place they live.
//
// Replace each placeholder with a FormTango endpoint. Sign up free at
// https://formtango.com, or create one with no account (run once per form):
//
//   curl -X POST https://formtango.com/api/v1/claims \
//     -H "Content-Type: application/json" -d '{"name":"Newsletter"}'
//
// While an address still contains "YOUR_", its form runs in demo mode.

export const NEWSLETTER_FORM = 'https://formtango.com/f/YOUR_NEWSLETTER_FORM_ID';
export const CONTACT_FORM = 'https://formtango.com/f/YOUR_CONTACT_FORM_ID';
