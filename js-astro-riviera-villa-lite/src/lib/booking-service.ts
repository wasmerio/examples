/**
 * The form services that email booking requests to the owner (Web3Forms, Formspree).
 * Pure functions, shared by the config check, the form markup and the browser script.
 */
export type FormProvider = 'web3forms' | 'formspree' | 'none';

const WEB3FORMS_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FORMSPREE_ID = /^[A-Za-z0-9]{6,12}$/;

/** Keeps only the key or form ID when a whole URL or code snippet was pasted. */
export function normalizeFormKey(provider: FormProvider, raw: string): string {
  const key = raw.trim();
  if (!key) return '';
  if (provider === 'formspree') {
    const fromUrl = /formspree\.io\/f\/([A-Za-z0-9]+)/i.exec(key);
    if (fromUrl?.[1]) return fromUrl[1];
  }
  if (provider === 'web3forms') {
    const uuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.exec(key);
    if (uuid) return uuid[0];
  }
  return key;
}

/** A readable problem when the key cannot be right for the chosen service, else null. */
export function formKeyProblem(provider: FormProvider, key: string): string | null {
  if (provider === 'none' || key === '') return null;
  if (provider === 'web3forms' && !WEB3FORMS_KEY.test(key)) {
    return `booking.key: "${key}" is not a Web3Forms access key. It looks like "a1b2c3d4-e5f6-7890-abcd-ef1234567890" (see the email Web3Forms sent you).`;
  }
  if (provider === 'formspree' && !FORMSPREE_ID.test(key)) {
    return `booking.key: "${key}" is not a Formspree form ID. It looks like "xwkgabcd", the end of https://formspree.io/f/xwkgabcd.`;
  }
  return null;
}

export function formEndpoint(provider: FormProvider, key: string): string | null {
  if (!key) return null;
  if (provider === 'web3forms') return 'https://api.web3forms.com/submit';
  if (provider === 'formspree') return `https://formspree.io/f/${encodeURIComponent(key)}`;
  return null;
}

export interface FormMarkup {
  /** Where the form posts when JavaScript is off; null hides the form until the script runs. */
  action: string | null;
  method: 'post';
  /** Hidden fields the service needs for a plain HTML post. */
  hidden: Record<string, string>;
}

/** Attributes of the <form>, so it still sends (or stays hidden) without JavaScript. */
export function formMarkup(provider: FormProvider, key: string, subject: string, villaName: string): FormMarkup {
  const action = formEndpoint(provider, key);
  if (provider === 'web3forms' && action) {
    return { action, method: 'post', hidden: { access_key: key, subject, from_name: villaName } };
  }
  if (provider === 'formspree' && action) return { action, method: 'post', hidden: { _subject: subject } };
  return { action: null, method: 'post', hidden: {} };
}

export interface SpamTraps {
  /** The hidden Web3Forms checkbox: checked only by robots. */
  botcheck: boolean;
  /** The hidden Formspree text field: filled only by robots. */
  gotcha: string;
}

/** JSON body sent with JavaScript: the guest's answers, plus the service's own fields and spam trap. */
export function servicePayload(
  provider: FormProvider,
  key: string,
  fields: Record<string, string>,
  meta: { subject: string; villaName: string; traps: SpamTraps },
): Record<string, string | boolean> {
  if (provider === 'web3forms') {
    return { ...fields, access_key: key, subject: meta.subject, from_name: meta.villaName, botcheck: meta.traps.botcheck };
  }
  if (provider === 'formspree') return { ...fields, _subject: meta.subject, _gotcha: meta.traps.gotcha };
  return { ...fields };
}
