/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TERMS OF SERVICE — edit the sections below with your own terms.
 * ─────────────────────────────────────────────────────────────────────────────
 * Each section has a `heading` and a `content` array of paragraphs.
 * Add, remove, or reorder sections as needed for your business.
 *
 * The `effectiveDate` is displayed at the top of the page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const termsOfService = {
  effectiveDate: 'September 1, 2026',

  sections: [
    {
      heading: 'Acceptance of Terms',
      content: [
        'By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.',
      ],
    },
    {
      heading: 'Services',
      content: [
        'We provide general contracting, repair, installation, inspection, remodeling, and maintenance services as described on our website. All services are subject to availability and may vary by location.',
        'Specific terms for individual projects — including scope of work, timelines, and pricing — will be outlined in a separate written estimate or contract provided before work begins.',
      ],
    },
    {
      heading: 'Estimates & Pricing',
      content: [
        'Estimates are provided based on the information available at the time of assessment. Actual costs may vary if unforeseen conditions are discovered during the course of work. We will communicate any changes to scope or pricing before proceeding.',
        'Payment terms, accepted methods, and any deposit requirements will be specified in your individual service agreement.',
      ],
    },
    {
      heading: 'Scheduling & Cancellations',
      content: [
        'We make every effort to arrive within the scheduled time window. However, service times may occasionally shift due to weather, prior job complexity, or emergency calls.',
        'If you need to reschedule or cancel an appointment, please contact us at least 24 hours in advance. Cancellation fees may apply for missed appointments without adequate notice.',
      ],
    },
    {
      heading: 'Warranties & Guarantees',
      content: [
        'We stand behind our workmanship and offer a satisfaction guarantee on all services performed. Specific warranty terms will be detailed in your service agreement.',
        'Warranties do not cover damage caused by misuse, neglect, acts of nature, or modifications made by others after our work is completed.',
      ],
    },
    {
      heading: 'Limitation of Liability',
      content: [
        'To the fullest extent permitted by law, our total liability for any claim arising from our services shall not exceed the amount you paid for the specific service giving rise to the claim.',
        'We are not liable for indirect, incidental, or consequential damages, including lost profits or data, even if we have been advised of the possibility of such damages.',
      ],
    },
    {
      heading: 'Intellectual Property',
      content: [
        'All content on this website — including text, images, logos, and design — is our property or used with permission and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our written consent.',
      ],
    },
    {
      heading: 'Governing Law',
      content: [
        'These Terms of Service are governed by and construed in accordance with the laws of the state in which our business is registered, without regard to conflict of law principles.',
      ],
    },
    {
      heading: 'Changes to These Terms',
      content: [
        'We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with a revised effective date. Your continued use of our website or services after changes are posted constitutes acceptance of the updated terms.',
      ],
    },
    {
      heading: 'Contact Us',
      content: [
        'If you have questions about these Terms of Service, please contact us using the information on our Contact page.',
      ],
    },
  ],
} as const;

export type TermsOfService = typeof termsOfService;
