import { describe, expect, it } from 'vitest';
import { formKeyProblem, formMarkup, normalizeFormKey, servicePayload } from './booking-service.ts';

const UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

describe('form service key', () => {
  it('keeps only the form ID from a pasted Formspree address', () => {
    expect(normalizeFormKey('formspree', ' https://formspree.io/f/xwkgabcd ')).toBe('xwkgabcd');
    expect(formKeyProblem('formspree', normalizeFormKey('formspree', 'https://formspree.io/f/xwkgabcd'))).toBeNull();
  });

  it('keeps only the access key from a pasted Web3Forms snippet', () => {
    expect(normalizeFormKey('web3forms', `<input type="hidden" name="access_key" value="${UUID}">`)).toBe(UUID);
  });

  it('names the expected format when the key is wrong', () => {
    expect(formKeyProblem('web3forms', 'abc')).toContain('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(formKeyProblem('formspree', 'https://example.com/form')).toContain('https://formspree.io/f/xwkgabcd');
    expect(formKeyProblem('none', 'anything')).toBeNull();
  });
});

describe('form without JavaScript', () => {
  it('posts to the service with its hidden fields', () => {
    expect(formMarkup('web3forms', UUID, 'Booking request', 'Villa')).toEqual({
      action: 'https://api.web3forms.com/submit',
      method: 'post',
      hidden: { access_key: UUID, subject: 'Booking request', from_name: 'Villa' },
    });
    expect(formMarkup('formspree', 'xwkgabcd', 'Booking request', 'Villa').action).toBe('https://formspree.io/f/xwkgabcd');
  });

  it('has no address to post to without a service, so the form stays hidden', () => {
    expect(formMarkup('none', '', 'Booking request', 'Villa').action).toBeNull();
    expect(formMarkup('web3forms', '', 'Booking request', 'Villa').action).toBeNull();
  });
});

describe('spam traps', () => {
  const traps = { botcheck: true, gotcha: 'http://spam.example' };
  const meta = { subject: 'Booking request', villaName: 'Villa', traps };

  it('sends the Web3Forms botcheck field', () => {
    expect(servicePayload('web3forms', UUID, { name: 'Bot' }, meta)).toMatchObject({ botcheck: true, access_key: UUID });
  });

  it('sends the Formspree _gotcha field', () => {
    expect(servicePayload('formspree', 'xwkgabcd', { name: 'Bot' }, meta)).toMatchObject({
      _gotcha: 'http://spam.example',
      _subject: 'Booking request',
    });
  });
});
