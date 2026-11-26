import { addDays, isRangeFree, nightsBetween, type NightRange } from '../lib/dates.ts';
import { formEndpoint, servicePayload, type FormProvider } from '../lib/booking-service.ts';
import { readStore } from './availability-store.ts';
import { emitDates, formatDay, isIsoDate, onDates, todayIso } from './events.ts';

interface Season {
  name: string;
  minNights: number;
  ranges: [string, string][];
}

interface FormConfig {
  provider: FormProvider;
  key: string;
  villa: string;
  email: string;
  whatsapp: string;
  capacity: number;
  seasons: Season[];
  labels: Record<string, string>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Season whose month-day ranges contain the arrival date. Ranges may cross New Year (12-20 to 01-03). */
export function seasonOf(seasons: readonly Season[], arrival: string): Season | undefined {
  const md = arrival.slice(5);
  return seasons.find((s) =>
    s.ranges.some(([from, to]) => (from <= to ? md >= from && md <= to : md >= from || md <= to)),
  );
}

/** Booked nights currently known by the page: build dates, or fresher ones written by the calendar. */
function readBusy(): NightRange[] {
  const data = readStore(document.querySelector<HTMLScriptElement>('[data-availability]'));
  return (data?.busy ?? []).map(([start, end]) => ({ start, end }));
}

export function initBookingForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-booking-form]');
  const result = root.querySelector<HTMLElement>('[data-result]');
  if (!form || !result) return;
  const config = JSON.parse(root.dataset.config ?? '{}') as FormConfig;
  // Without a form service the form cannot send on its own: it stays hidden until this script runs.
  form.hidden = false;
  const L = config.labels;

  const field = <T extends HTMLElement>(name: string) => form.querySelector<T>(`[name="${name}"]`);
  const arrival = field<HTMLInputElement>('arrival');
  const departure = field<HTMLInputElement>('departure');
  const adults = field<HTMLSelectElement>('adults');
  const children = field<HTMLSelectElement>('children');
  const name = field<HTMLInputElement>('name');
  const email = field<HTMLInputElement>('email');
  const phone = field<HTMLInputElement>('phone');
  const message = field<HTMLTextAreaElement>('message');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const notice = form.querySelector<HTMLElement>('[data-notice]');
  if (!arrival || !departure || !adults || !children || !name || !email || !phone || !message || !submit) return;

  const today = todayIso();
  arrival.min = today;
  departure.min = addDays(today, 1);

  const setError = (input: HTMLElement, errorId: string, text: string | null) => {
    const error = document.getElementById(errorId);
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (error) {
      error.textContent = text ?? '';
      error.hidden = !text;
    }
  };

  /** Advice that does not block sending: minimum stay, nights already booked. */
  const updateNotice = () => {
    if (!notice) return;
    const messages: string[] = [];
    if (isIsoDate(arrival.value) && isIsoDate(departure.value) && departure.value > arrival.value) {
      const nights = nightsBetween(arrival.value, departure.value);
      const season = seasonOf(config.seasons, arrival.value);
      if (season && nights < season.minNights) {
        messages.push(
          (season.minNights === 1 ? L.minNightsOne : L.minNightsMany)
            ?.replace('{season}', season.name)
            .replace('{n}', String(season.minNights)) ?? '',
        );
      }
      if (!isRangeFree(readBusy(), arrival.value, departure.value)) messages.push(L.datesTaken ?? '');
    }
    notice.textContent = messages.join(' ');
    notice.hidden = messages.length === 0;
  };

  const syncDates = (source: 'form' | 'url') => {
    departure.min = isIsoDate(arrival.value) ? addDays(arrival.value, 1) : addDays(today, 1);
    updateNotice();
    if (source === 'form') emitDates({ arrival: arrival.value, departure: departure.value, source: 'form' });
  };

  const applyDates = (a?: string, d?: string, guests?: number) => {
    if (a !== undefined) arrival.value = isIsoDate(a) ? a : '';
    if (d !== undefined) departure.value = isIsoDate(d) ? d : '';
    if (guests && guests > 0) {
      const total = Math.min(guests, config.capacity);
      const kids = Number(children.value);
      adults.value = String(Math.max(1, total - kids));
    }
    syncDates('url');
  };

  arrival.addEventListener('change', () => {
    if (isIsoDate(departure.value) && departure.value <= arrival.value) departure.value = '';
    syncDates('form');
  });
  departure.addEventListener('change', () => syncDates('form'));

  onDates((detail) => {
    if (detail.source === 'form') return;
    applyDates(detail.arrival, detail.departure, detail.guests);
  });

  // Dates sent by the booking bar of another page, or without JavaScript (?arrival=...&departure=...).
  const params = new URLSearchParams(window.location.search);
  if (params.has('arrival') || params.has('departure')) {
    applyDates(params.get('arrival') ?? undefined, params.get('departure') ?? undefined, Number(params.get('guests')) || undefined);
    emitDates({ arrival: arrival.value, departure: departure.value, source: 'url' });
  }

  const validate = (): HTMLElement | null => {
    let first: HTMLElement | null = null;
    const check = (input: HTMLElement, id: string, text: string | null) => {
      setError(input, id, text);
      if (text && !first) first = input;
    };
    check(
      arrival,
      'booking-arrival-error',
      !isIsoDate(arrival.value) ? (L.required ?? '') : arrival.value < today ? (L.arrivalInPast ?? '') : null,
    );
    check(
      departure,
      'booking-departure-error',
      !isIsoDate(departure.value)
        ? (L.required ?? '')
        : isIsoDate(arrival.value) && departure.value <= arrival.value
          ? (L.departureAfterArrival ?? '')
          : null,
    );
    check(
      children,
      'booking-guests-error',
      Number(adults.value) + Number(children.value) > config.capacity ? (L.tooManyGuests ?? '') : null,
    );
    check(name, 'booking-name-error', name.value.trim() ? null : (L.required ?? ''));
    check(
      email,
      'booking-email-error',
      !email.value.trim() ? (L.required ?? '') : EMAIL.test(email.value.trim()) ? null : (L.invalidEmail ?? ''),
    );
    return first;
  };

  const requestText = () => {
    const lines = [
      L.intro,
      '',
      `${L.arrival}${L.sep}${isIsoDate(arrival.value) ? formatDay(arrival.value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}`,
      `${L.departure}${L.sep}${isIsoDate(departure.value) ? formatDay(departure.value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}`,
      `${L.adults}${L.sep}${adults.value}`,
      `${L.children}${L.sep}${children.value}`,
      `${L.name}${L.sep}${name.value.trim()}`,
      `${L.email}${L.sep}${email.value.trim()}`,
    ];
    if (phone.value.trim()) lines.push(`${L.phone}${L.sep}${phone.value.trim()}`);
    if (message.value.trim()) lines.push('', message.value.trim());
    return lines.join('\n');
  };

  const subject = () =>
    (L.subject ?? '')
      .replace('{a}', isIsoDate(arrival.value) ? formatDay(arrival.value, { day: 'numeric', month: 'short' }) : '-')
      .replace('{d}', isIsoDate(departure.value) ? formatDay(departure.value, { day: 'numeric', month: 'short', year: 'numeric' }) : '-');

  const showResult = (kind: 'success' | 'fallback' | 'error') => {
    const success = result.querySelector<HTMLElement>('[data-result-success]');
    const fallback = result.querySelector<HTMLElement>('[data-result-fallback]');
    if (!success || !fallback) return;
    success.hidden = kind !== 'success';
    fallback.hidden = kind === 'success';
    if (kind !== 'success') {
      const title = fallback.querySelector<HTMLElement>('[data-fallback-title]');
      const text = fallback.querySelector<HTMLElement>('[data-fallback-text]');
      if (title) title.textContent = (kind === 'error' ? title.dataset.errorTitle : title.dataset.plainTitle) ?? '';
      if (text) text.textContent = (kind === 'error' ? text.dataset.errorText : text.dataset.plainText) ?? '';
      const body = requestText();
      const wa = fallback.querySelector<HTMLAnchorElement>('[data-fallback-whatsapp]');
      if (wa && config.whatsapp) wa.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(body)}`;
      const mail = fallback.querySelector<HTMLAnchorElement>('[data-fallback-email]');
      if (mail) {
        mail.href = `mailto:${config.email}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(body)}`;
      }
    }
    if (kind === 'success') form.hidden = true;
    else result.classList.add('mt-8', 'border-t', 'border-line', 'pt-8');
    result.hidden = false;
    result.focus();
  };

  const send = async (): Promise<boolean> => {
    const endpoint = formEndpoint(config.provider, config.key);
    if (!endpoint) return false;
    const fields = {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      arrival: arrival.value,
      departure: departure.value,
      adults: adults.value,
      children: children.value,
      message: requestText(),
    };
    // The spam traps go to the service, which discards what robots send.
    const traps = {
      botcheck: form.querySelector<HTMLInputElement>('[name="botcheck"]')?.checked ?? false,
      gotcha: form.querySelector<HTMLInputElement>('[name="_gotcha"]')?.value ?? '',
    };
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(servicePayload(config.provider, config.key, fields, { subject: subject(), villaName: config.villa, traps })),
    });
    if (config.provider === 'web3forms') {
      const data = (await response.json().catch(() => ({}))) as { success?: boolean };
      return response.ok && data.success === true;
    }
    return response.ok;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }
    if (config.provider === 'none') {
      showResult('fallback');
      return;
    }
    submit.disabled = true;
    submit.textContent = L.sending ?? '';
    try {
      showResult((await send()) ? 'success' : 'error');
    } catch {
      showResult('error');
    } finally {
      submit.disabled = false;
      submit.textContent = L.submit ?? '';
    }
  });
}
