export interface Service {
  title: string;
  description: string;
  details: string[];
  format: string;
}

export const services: Service[] = [
  {
    title: 'Group Classes',
    description:
      'High-energy HIIT, strength circuits, spin, and mobility sessions led by certified coaches. Every class is scalable to your level.',
    details: ['15+ classes every week', 'All levels welcome', 'Member drop-in or class packs'],
    format: '45–60 min · Studio floor',
  },
  {
    title: 'Personal Training',
    description:
      'One-to-one programming built around your goals, your schedule, and your body. Sessions include a full movement assessment to start.',
    details: ['Custom training plans', 'Form coaching in every session', 'Monthly progress reviews'],
    format: '60 min · By appointment',
  },
  {
    title: 'Nutrition Coaching',
    description:
      'Practical, judgement-free guidance built around real meals and real schedules. No cleanses, no rigid plans — just habits that last.',
    details: ['Weekly check-ins', 'Meal templates, not meal police', 'Works with any dietary style'],
    format: '6-week programme · Weekly check-ins',
  },
  {
    title: 'Recovery & Mobility',
    description:
      'Guided stretching, foam rolling, and breathwork sessions for busy nervous systems. Short practices you can use anywhere.',
    details: ['Drop-in friendly', 'No previous experience needed', 'Includes take-home routines'],
    format: '30 min · Drop-in sessions',
  },
  {
    title: 'Open Gym Access',
    description:
      'Full access to squat racks, free weights, and conditioning zones. Coaching support is always on the floor when you need a spot.',
    details: ['7 days a week', 'Early and late hours', 'Barbell, dumbbell, and bodyweight zones'],
    format: 'Membership · 05:30–23:00',
  },
  {
    title: 'Online Coaching',
    description:
      'Train anywhere with remote programming, video form checks, and a coach on chat. Same standards as the studio, minus the commute.',
    details: ['Syncs with your own equipment', 'Weekly video feedback', 'Flexible pause when life happens'],
    format: 'Monthly · App-based',
  },
];
