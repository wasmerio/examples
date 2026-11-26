import { parse } from 'yaml';
import contactRaw from '../data/contact.yml?raw';
import { SITE } from '../consts.ts';

/* The contact rows from `src/data/contact.yml` (its header has the shape): the
   parse, the validation, and `email: true` -> SITE.email. Markup: Contact.astro. */
export type ContactRow = {
  label: string;
  /** The row's text. Exactly one of `value` and `email` is set. */
  value?: string;
  /** An address, or `true` for SITE.email. Always obfuscated when rendered. */
  email?: boolean | string;
  href?: string;
  mono?: boolean;
  note?: string;
};

/** What Contact.astro actually renders: the union above, resolved. */
export type ResolvedRow = {
  label: string;
  /** Set when the row is an address; Contact.astro sends it through Email. */
  address?: string;
  /** Set when it is not. */
  text?: string;
  href?: string;
  mono: boolean;
  note?: string;
};

/* Anchored, unlike the audit's version: that hunts inside a page, this asks
   whether a whole field IS an address. The domain allows dots — without them
   `me@mail.uni-example.de` was neither caught in `value:` nor accepted in
   `email:`. */
const ADDRESS_SHAPED = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const raw = parse(contactRaw) as unknown;

/** Validated because `?raw` + `yaml.parse` has no schema: a mis-keyed row would
    render as a label with nothing after it. The address check pre-empts the
    audit, which fails later with no file name; this names the row. */
function validate(input: unknown): ResolvedRow[] {
  if (input === null || input === undefined) return [];
  if (!Array.isArray(input)) {
    throw new Error('contact.yml: expected a list of rows at the top level');
  }
  return input.map((row: ContactRow, i) => {
    const where = `contact.yml row ${i + 1}${row?.label ? ` (${row.label})` : ''}`;
    if (!row || typeof row !== 'object') throw new Error(`${where}: not a mapping`);
    if (typeof row.label !== 'string' || row.label.trim() === '') {
      throw new Error(`${where}: needs a \`label\``);
    }

    const hasEmail = row.email !== undefined && row.email !== false;
    const hasValue = typeof row.value === 'string' && row.value.trim() !== '';
    if (hasEmail === hasValue) {
      throw new Error(`${where}: set exactly one of \`value\` and \`email\``);
    }
    if (row.href !== undefined && !/^(https?:\/\/|\/|mailto:|matrix:|xmpp:)/.test(row.href)) {
      throw new Error(`${where}: \`href\` must be an absolute URL or a site-relative path`);
    }

    if (hasValue && ADDRESS_SHAPED.test(row.value!.trim())) {
      throw new Error(
        `${where}: \`value: ${row.value}\` is an email address. Write it as ` +
          '`email:` instead — a raw address in the markup is shipped in the ' +
          'served bytes and fails `npm run audit`.',
      );
    }

    const address = hasEmail ? (row.email === true ? SITE.email : String(row.email)) : undefined;
    if (address !== undefined && !ADDRESS_SHAPED.test(address)) {
      throw new Error(`${where}: \`email: ${address}\` does not look like an address`);
    }

    return {
      label: row.label,
      address,
      text: hasValue ? row.value!.trim() : undefined,
      href: row.href,
      mono: row.mono === true,
      note: row.note,
    };
  });
}

export const contactRows: ResolvedRow[] = validate(raw);
