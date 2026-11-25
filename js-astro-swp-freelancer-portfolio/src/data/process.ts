import type { ProcessStep } from '~/types';

export const process: ProcessStep[] = [
  {
    stage: 'Stage 01',
    title: 'Listen',
    body: 'Two calls with you, four with your customers, plus every support ticket you are willing to share. I come back with the problem in one paragraph and you tell me where I got it wrong.',
    timing: 'Week 1',
  },
  {
    stage: 'Stage 02',
    title: 'Frame',
    body: 'Structure, flows and the hard trade-offs on paper before anything gets styled. You sign off a skeleton, which costs far less to change than a finished screen.',
    timing: 'Week 2',
  },
  {
    stage: 'Stage 03',
    title: 'Draw',
    body: 'Full-fidelity work with real copy and the ugly states included — loading, empty, error, name-far-too-long. Reviewed live, cameras on, every Thursday.',
    timing: 'Weeks 3–5',
  },
  {
    stage: 'Stage 04',
    title: 'Leave well',
    body: 'Component library, tokens, a written spec and a walkthrough with your engineers. A month of questions answered at no charge afterwards.',
    timing: 'Week 6',
  },
];

export const processHeading = {
  eyebrow: 'The shape of it',
  title: 'Four stages, and you see something every Thursday.',
  intro:
    'The order is load-bearing. Each stage hands the next one something it cannot start without, which is how we avoid designing a screen for a decision nobody has made.',
};
