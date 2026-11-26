import type { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  {
    number: '1',
    title: 'Watch the work',
    description:
      'Two days sitting with the team that does the task today. We record the real decision points, the exceptions nobody wrote down, and where the cost actually sits.',
    timing: 'Week 1 — process map & baseline',
  },
  {
    number: '2',
    title: 'Build one narrow slice',
    description:
      'A single workflow, running against real data in a sandbox. If it cannot beat the manual baseline on a labelled set, we tell you and we stop.',
    timing: 'Week 2–4 — working agent',
  },
  {
    number: '3',
    title: 'Harden, then operate',
    description:
      'Guardrails, permissions, spend caps, rollback and escalation rules. Then we run it with you, on call, until your ops lead can ship a change alone.',
    timing: 'Week 5–6 — live, then shared on-call',
  },
];
