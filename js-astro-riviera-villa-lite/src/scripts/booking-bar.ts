import { addDays } from '../lib/dates.ts';
import { emitDates, formatDay, isIsoDate, onDates, scrollToId, todayIso } from './events.ts';

export function initBookingBar(form: HTMLFormElement): void {
  const arrival = form.querySelector<HTMLInputElement>('[data-arrival]');
  const departure = form.querySelector<HTMLInputElement>('[data-departure]');
  const guests = form.querySelector<HTMLSelectElement>('[data-guests]');
  if (!arrival || !departure || !guests) return;

  form.dataset.enhanced = '';
  const today = todayIso();
  arrival.min = today;
  departure.min = addDays(today, 1);

  const refresh = () => {
    for (const input of [arrival, departure]) {
      const display = input.parentElement?.querySelector<HTMLElement>('[data-display]');
      if (!display) continue;
      if (!display.dataset.placeholder) display.dataset.placeholder = display.textContent ?? '';
      const has = isIsoDate(input.value);
      display.textContent = has ? formatDay(input.value) : display.dataset.placeholder;
      display.dataset.empty = String(!has);
    }
    departure.min = isIsoDate(arrival.value) ? addDays(arrival.value, 1) : addDays(today, 1);
  };

  // Clicking anywhere on the field opens the date picker where the browser allows it.
  form.querySelectorAll<HTMLElement>('[data-date-field]').forEach((field) => {
    field.addEventListener('click', () => {
      const input = field.querySelector<HTMLInputElement>('input');
      try {
        input?.showPicker();
      } catch {
        input?.focus();
      }
    });
  });

  arrival.addEventListener('change', () => {
    if (isIsoDate(arrival.value) && isIsoDate(departure.value) && departure.value <= arrival.value) {
      departure.value = '';
    }
    refresh();
  });
  departure.addEventListener('change', refresh);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    emitDates({
      arrival: isIsoDate(arrival.value) ? arrival.value : undefined,
      departure: isIsoDate(departure.value) ? departure.value : undefined,
      guests: Number(guests.value) || undefined,
      source: 'bar',
    });
    scrollToId((form.dataset.target ?? '#booking').slice(1));
  });

  onDates((detail) => {
    if (detail.source === 'bar') return;
    if (detail.arrival !== undefined) arrival.value = detail.arrival;
    if (detail.departure !== undefined || detail.arrival !== undefined) departure.value = detail.departure ?? '';
    if (detail.guests) guests.value = String(Math.min(detail.guests, guests.options.length));
    refresh();
  });

  refresh();
}
