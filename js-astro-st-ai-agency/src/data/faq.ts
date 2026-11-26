import type { FAQItem } from '../types';

export const faqs: FAQItem[] = [
  {
    question: 'Do we need our own AI team first?',
    answer:
      'No. Most clients start with an operations lead and one engineer who can grant access. We supply the agent engineering; you supply the domain judgement about what a correct answer looks like. By month three your ops lead is usually shipping changes without us.',
  },
  {
    question: 'Where does our data go?',
    answer:
      'Into your infrastructure by default. On Scale we deploy into your cloud account; on Embedded we run fully on premise. Nothing trains a model, retention windows are set by you, and every third-party call is listed in the data map we hand over in week one.',
  },
  {
    question: 'What happens when the agent gets it wrong?',
    answer:
      'It should stop rather than guess — that is what the confidence thresholds and refusal rules are for. When something still slips through, you replay the run step by step, see which tool call caused it, add the case to the test set, and the regression suite blocks it from happening twice.',
  },
  {
    question: 'Which models do you use?',
    answer:
      'Whichever wins on your evaluation set, re-tested quarterly. We are deliberately not tied to one provider — routing is a configuration file, not a rewrite. If compliance restricts you to a specific list, we fix routing to that list and show you the quality cost.',
  },
  {
    question: 'How long until we see something real?',
    answer:
      'An agent running against real data in a sandbox by the end of week three. Production traffic usually lands in week six, gated behind the security review and a passing evaluation run. If we are going to miss that, you hear it in week two, not week five.',
  },
  {
    question: 'Can we take it in-house later?',
    answer:
      'Yes, and it is written into the contract. You own the code, prompts, evaluation set and infrastructure definitions from day one. Handover is a four-week programme with shadowing, runbook review and a final on-call swap. No exit fee.',
  },
];
