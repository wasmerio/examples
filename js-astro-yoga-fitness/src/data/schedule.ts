import type { ScheduleDay } from '../types';

/**
 * Weekly timetable. Each "Reserve" button uses the entry's `bookingUrl`,
 * falling back to `site.bookingUrl` from `src/config/site.ts`.
 */
export const schedule: ScheduleDay[] = [
  {
    short: 'Mon',
    name: 'Monday',
    classes: [
      { time: '06:30', period: 'am', className: 'Sunrise Vinyasa', instructor: 'Arjun Mehta', duration: '60 min' },
      { time: '09:30', period: 'am', className: 'Hatha Foundations', instructor: 'Maya Collins', duration: '75 min', level: 'Beginner' },
      { time: '12:15', period: 'pm', className: 'Lunchtime Breathwork', instructor: 'Sofia Lindqvist', duration: '45 min' },
      { time: '18:30', period: 'pm', className: 'Yin & Restore', instructor: 'Walter Greene', duration: '60 min' },
    ],
  },
  {
    short: 'Tue',
    name: 'Tuesday',
    classes: [
      { time: '07:00', period: 'am', className: 'Power & Balance', instructor: 'Arjun Mehta', duration: '60 min', level: 'Intermediate' },
      { time: '10:00', period: 'am', className: 'Prenatal Care', instructor: 'Maya Collins', duration: '50 min' },
      { time: '19:00', period: 'pm', className: 'Vinyasa Flow', instructor: 'Arjun Mehta', duration: '60 min' },
    ],
  },
  {
    short: 'Wed',
    name: 'Wednesday',
    classes: [
      { time: '06:30', period: 'am', className: 'Sunrise Vinyasa', instructor: 'Arjun Mehta', duration: '60 min' },
      { time: '12:15', period: 'pm', className: 'Lunchtime Breathwork', instructor: 'Sofia Lindqvist', duration: '45 min' },
      { time: '17:30', period: 'pm', className: 'Hatha Foundations', instructor: 'Maya Collins', duration: '75 min', level: 'Beginner' },
      { time: '19:30', period: 'pm', className: 'Yin & Restore', instructor: 'Walter Greene', duration: '60 min' },
    ],
  },
  {
    short: 'Thu',
    name: 'Thursday',
    classes: [
      { time: '07:00', period: 'am', className: 'Hatha Foundations', instructor: 'Maya Collins', duration: '75 min', level: 'Beginner' },
      { time: '10:00', period: 'am', className: 'Prenatal Care', instructor: 'Maya Collins', duration: '50 min' },
      { time: '18:30', period: 'pm', className: 'Power & Balance', instructor: 'Arjun Mehta', duration: '60 min', level: 'Intermediate' },
    ],
  },
  {
    short: 'Fri',
    name: 'Friday',
    classes: [
      { time: '06:30', period: 'am', className: 'Sunrise Vinyasa', instructor: 'Arjun Mehta', duration: '60 min' },
      { time: '12:15', period: 'pm', className: 'Lunchtime Breathwork', instructor: 'Sofia Lindqvist', duration: '45 min' },
      { time: '18:00', period: 'pm', className: 'Candlelit Yin', instructor: 'Walter Greene', duration: '75 min' },
    ],
  },
  {
    short: 'Sat',
    name: 'Saturday',
    classes: [
      { time: '08:00', period: 'am', className: 'Vinyasa Flow', instructor: 'Arjun Mehta', duration: '60 min' },
      { time: '10:00', period: 'am', className: 'Beginner Series', instructor: 'Maya Collins', duration: '75 min', level: 'Beginner' },
      { time: '16:00', period: 'pm', className: 'Sound & Stillness', instructor: 'Sofia Lindqvist', duration: '60 min' },
    ],
  },
  {
    short: 'Sun',
    name: 'Sunday',
    classes: [
      { time: '09:00', period: 'am', className: 'Slow Sunday Flow', instructor: 'Walter Greene', duration: '75 min' },
      { time: '11:30', period: 'am', className: 'Breath & Meditation', instructor: 'Sofia Lindqvist', duration: '45 min' },
    ],
  },
];
