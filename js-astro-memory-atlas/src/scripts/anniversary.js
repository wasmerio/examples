import { SITE_CONFIG } from '../config/site.js';
import { getSiteDebugDate, parsePacificDateTime } from '../lib/site-debug-time.js';
import { activeLanguage, localize } from '../lib/i18n.js';
import { text } from '../i18n/copy.js';

export function initializeHomeExperience({ entries = [], memories = [], reduceMotion = { matches: true } } = {}) {
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: SITE_CONFIG.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  let simulated = SITE_CONFIG.debugPanel ? parsePacificDateTime(getSiteDebugDate(), SITE_CONFIG.timeZone) : null;
  let currentAnniversary = null;
  let currentBirthday = null;
  let currentDateMessage = null;
  const language = () => activeLanguage();
  const setText = (node, value) => {
    if (node && node.textContent !== value) node.textContent = value;
  };
  const now = () => simulated ?? new Date();
  const records = memories.length
    ? memories
    : entries.map((entry) => ({
        date: entry.querySelector('.timeline-date')?.textContent ?? '',
        title: entry.querySelector('h3')?.innerText.trim() ?? '',
      }));
  const recordTitle = (record) => (typeof record.title === 'string' ? record.title : localize(record.title, language()));
  const anniversaryDialog = document.querySelector('#anniversary-dialog');
  const birthdayDialog = document.querySelector('#birthday-dialog');
  const update = () => {
    const today = formatter.format(now());
    document.querySelectorAll('[data-anniversary-countdown]').forEach((card) => {
      const month = String(card.dataset.month).padStart(2, '0');
      const day = String(card.dataset.day).padStart(2, '0');
      const year = Number(today.slice(0, 4));
      let target = `${year}-${month}-${day}`;
      if (target < today) target = `${year + 1}-${month}-${day}`;
      const days = Math.ceil((Date.parse(`${target}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
      setText(card.querySelector('[data-countdown-days]'), days === 0 ? '' : String(days));
      setText(card.querySelector('[data-countdown-prefix]'), days === 0
        ? text('common.is', language())
        : text('common.in', language()));
      setText(card.querySelector('[data-countdown-unit]'), days === 0
        ? text('common.today', language())
        : text('common.days', language()));
    });
    document.querySelectorAll('.timer[data-start]').forEach((timer) => {
      const elapsed = Math.max(0, now().getTime() - Date.parse(timer.dataset.start));
      const seconds = Math.floor(elapsed / 1000);
      const units = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
      for (const [unit, value] of Object.entries(units)) {
        const node = timer.querySelector(`[data-unit="${unit}"]`);
        setText(node, unit === 'days' ? String(value) : String(value).padStart(2, '0'));
      }
    });
  };
  const setTodayMessage = (title, message) => {
    const note = document.querySelector('[data-today-note]');
    if (!note) return;
    note.querySelector('[data-today-title]').textContent = title;
    note.querySelector('[data-today-message]').textContent = message;
    note.hidden = !title;
  };
  const openAnniversary = (kind) => {
    const anniversary = SITE_CONFIG.anniversaries[kind];
    if (!anniversary || !anniversaryDialog) return;
    currentAnniversary = kind;
    currentBirthday = null;
    const year = Number(formatter.format(now()).slice(0, 4));
    const count = Math.max(0, year - Number(anniversary.date.slice(0, 4)));
    anniversaryDialog.querySelector('[data-anniversary-kicker]').textContent = text('status.anniversary', language());
    anniversaryDialog.querySelector('[data-anniversary-title]').textContent = `${localize(anniversary.label, language())} · ${text('status.anniversaryCount', language(), { count })}`;
    anniversaryDialog.querySelector('[data-anniversary-message]').textContent = text('status.anniversaryMessage', language());
    anniversaryDialog.querySelector('[data-anniversary-intro-title]').textContent = localize(anniversary.label, language());
    const chapters = anniversaryDialog.querySelector('[data-anniversary-chapters]');
    chapters.replaceChildren();
    records.filter((record) => String(record.date).includes(anniversary.date)).slice(0, 3).forEach((record) => {
      const section = document.createElement('section');
      section.className = 'anniversary-chapter';
      const heading = document.createElement('h3');
      heading.textContent = recordTitle(record) || text('status.memory', language());
      section.append(heading);
      chapters.append(section);
    });
    if (!reduceMotion.matches) anniversaryDialog.classList.add('is-entering');
    if (!anniversaryDialog.open) anniversaryDialog.showModal();
  };
  const openBirthday = (id) => {
    const birthday = SITE_CONFIG.birthdays[id];
    if (!birthday || !birthdayDialog) return;
    currentBirthday = id;
    currentAnniversary = null;
    birthdayDialog.dataset.person = id;
    birthdayDialog.querySelector('[data-birthday-kicker]').textContent = `${birthday.date} · ${text('status.birthdayKicker', language()).toUpperCase()}`;
    birthdayDialog.querySelector('[data-birthday-title]').textContent = text('status.birthdayTitle', language(), { name: localize(birthday.name, language()) });
    birthdayDialog.querySelector('[data-birthday-message]').textContent = text('status.birthdayMessage', language());
    if (!birthdayDialog.open) birthdayDialog.showModal();
  };
  document.querySelectorAll('[data-anniversary-open]').forEach((button) => button.addEventListener('click', () => openAnniversary(button.dataset.anniversaryOpen)));
  document.querySelectorAll('[data-birthday]').forEach((button) => button.addEventListener('click', () => openBirthday(button.dataset.birthday)));
  document.querySelector('[data-anniversary-close]')?.addEventListener('click', () => anniversaryDialog?.close());
  document.querySelector('[data-birthday-close]')?.addEventListener('click', () => birthdayDialog?.close());
  document.addEventListener('site-debug-time-change', (event) => {
    simulated = parsePacificDateTime(event.detail?.value, SITE_CONFIG.timeZone);
    update();
    currentDateMessage = event.detail?.value ?? '';
    setTodayMessage(text('status.simulatedDate', language()), text('status.simulatedDateDetails', language(), { date: currentDateMessage }));
  });
  document.addEventListener('site:language-change', () => {
    update();
    if (currentAnniversary) openAnniversary(currentAnniversary);
    if (currentBirthday) openBirthday(currentBirthday);
    if (currentDateMessage) setTodayMessage(text('status.simulatedDate', language()), text('status.simulatedDateDetails', language(), { date: currentDateMessage }));
  });
  update();
  let timer = window.setInterval(update, 1000);
  document.addEventListener('visibilitychange', () => {
    window.clearInterval(timer);
    if (document.hidden) return;
    update();
    timer = window.setInterval(update, 1000);
  });
}
