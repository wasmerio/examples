import type { FaqItem } from '~/types';

export const faq: FaqItem[] = [
  {
    question: 'How long does a project usually take?',
    answer:
      'A full product engagement runs six weeks end to end. An identity is three to four. A second opinion is one week. If your deadline is tighter than that, say so early and you will get an honest answer about whether it fits.',
  },
  {
    question: 'Is the price fixed?',
    answer:
      'Yes, wherever the scope is defined. One number, one payment schedule and a written list of what sits inside it. Anything outside becomes a conversation before work starts, never a surprise line on an invoice.',
  },
  {
    question: 'Can you work alongside our engineers?',
    answer:
      'That is the normal arrangement. I join your stand-ups, write specs in whatever format your team already uses, and stay reachable for a month after handover so questions get answered rather than guessed at.',
  },
  {
    question: 'What lands in my hands at the end?',
    answer:
      'Source files, a component library with every state documented, a token sheet, exported assets and a written spec covering behaviour and edge cases. Build engagements also include the front-end templates and a configured theme.',
  },
  {
    question: 'Do you take small pieces of work?',
    answer:
      'Sometimes. A single landing page, a pricing rewrite or a one-week review all fit comfortably. Anything larger tends to work better as a short sprint than as hours scattered across a quarter.',
  },
  {
    question: 'Who owns the work at the end?',
    answer:
      'You do, completely, once the final payment clears. Files transfer into your accounts rather than living in mine. I only ask permission to show the work publicly, and I will keep it private if you would rather.',
  },
];

export const faqHeading = {
  eyebrow: 'FAQ',
  title: 'Asked before nearly every project.',
  asideTitle: 'Not sure yet?',
  asideBody:
    'Send a paragraph about what is going wrong. If I am not right for it I will say so and name someone who is, usually the same day.',
};
