/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PRIVACY POLICY — edit the sections below with your own policy content.
 * ─────────────────────────────────────────────────────────────────────────────
 * Each section has a `heading` and a `content` array of paragraphs.
 * Add, remove, or reorder sections as needed for your business.
 *
 * The `effectiveDate` is displayed at the top of the page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const privacyPolicy = {
  effectiveDate: 'September 1, 2026',

  sections: [
    {
      heading: 'Information We Collect',
      content: [
        'We collect personal information that you voluntarily provide when you contact us, request a quote, or use our services. This may include your name, email address, phone number, mailing address, and details about the services you need.',
        'We may also automatically collect certain technical information when you visit our website, including your IP address, browser type, referring URL, and pages visited. This data helps us improve our site and your experience.',
      ],
    },
    {
      heading: 'How We Use Your Information',
      content: [
        'We use the information we collect to respond to your inquiries, schedule and provide our services, send appointment reminders and follow-ups, and process payments.',
        'We may also use your information to send occasional updates about our services, promotions, or company news. You can opt out of these communications at any time by contacting us.',
      ],
    },
    {
      heading: 'Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business (such as payment processors or scheduling software), provided they agree to keep your information confidential.',
        'We may also disclose your information when required by law, to protect our rights, or to comply with a legal process.',
      ],
    },
    {
      heading: 'Cookies & Tracking',
      content: [
        'Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings.',
      ],
    },
    {
      heading: 'Data Security',
      content: [
        'We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      heading: 'Your Rights',
      content: [
        'You have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, please contact us using the information provided below.',
      ],
    },
    {
      heading: 'Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date. We encourage you to review this policy periodically.',
      ],
    },
    {
      heading: 'Contact Us',
      content: [
        'If you have questions or concerns about this Privacy Policy, please contact us using the information on our Contact page.',
      ],
    },
  ],
} as const;

export type PrivacyPolicy = typeof privacyPolicy;
