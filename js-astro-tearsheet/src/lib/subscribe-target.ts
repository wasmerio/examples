// Where every subscribe form posts. One place, so a provider change touches no component:
// to use another provider, return its form action and email field name here.
import { newsletter } from '../config';

export interface SubscribeTarget {
  action: string;
  method: 'get' | 'post';
  emailField?: string; // absent: the email input is not submitted at all (demo)
  hidden: Record<string, string>;
  newTab: boolean;
}

export function subscribeTarget(): SubscribeTarget {
  // Demo builds (DEMO_FORMS=1) send no address anywhere: the form lands on /subscribed and the
  // email input has no name, so it never reaches the URL either.
  if (import.meta.env.DEMO_FORMS === '1')
    return { action: '/subscribed', method: 'get', hidden: {}, newTab: false };

  return {
    action: `https://buttondown.com/api/emails/embed-subscribe/${newsletter.username}`,
    method: 'post',
    emailField: 'email',
    hidden: {},
    newTab: true, // the provider's confirmation page opens beside the issue, not over it
  };
}
