/**
 * LatentFolio Free content configuration.
 *
 * Replace the clearly marked example content before publishing your site.
 * All sample people, employers, projects, and metrics are fictional.
 */

export const template = {
  name: 'LatentFolio',
  edition: 'Free',
  creator: 'Dharani Eswaramurthi',
  creatorUrl: 'https://github.com/Dharani-Eswaramurthi',
};

export const profile = {
  name: 'Alex Morgan',
  shortName: 'Alex',
  initials: 'AM',
  role: 'AI Product Engineer',
  location: 'Berlin, Germany',
  availability: 'Open to remote AI engineering roles',
  email: 'hello@example.com',
  bio: 'AI engineer building evaluated LLM applications, retrieval systems, and dependable ML products.',
  resume: '/resume-placeholder.pdf',
  portrait: '/avatar-placeholder.svg',
};

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/yourusername', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yourusername', icon: 'linkedin' },
  { label: 'Medium', href: 'https://medium.com/@yourusername', icon: 'medium' },
];

export const pageCopy = {
  seoTitle: `${profile.name} — AI Product Engineer`,
  seoDescription: `${profile.role} building evaluated LLM, RAG, agentic AI, and production ML systems. Explore selected case studies and engineering outcomes.`,
  heroEyebrow: profile.role,
  heroLocation: `${profile.location} · ${profile.availability}`,
  heroLead: 'I build intelligence',
  heroMiddle: 'people can actually',
  heroAccent: 'use.',
  heroSummary: 'I turn promising models into evaluated, observable, and useful products—from retrieval and agents to the interfaces people rely on.',
  workIntro: 'A focused set of systems explained through the problem, engineering decisions, evaluation method, and measurable result.',
  labIntro: 'Explore three system modes. Each visualization shows how evidence, controls, and feedback move through a production AI workflow.',
  expertiseIntro: 'I work where model behavior, backend reliability, product experience, and responsible delivery meet.',
  journeyTitle: 'From learning models to leading systems.',
  journeyIntro: 'A sample career path showing how to connect role progression with concrete ownership. Replace every entry with your real experience.',
  writingKicker: '04 / Field notes',
  writingTitle: 'Ideas, experiments, and lessons from shipping AI.',
  writingIntro: 'Use this section for technical writing, research notes, talks, or open-source documentation.',
  contactKicker: 'Have an ambitious AI problem?',
  contactTitle: 'Let’s build something worth shipping.',
  contactBody: `I’m ${profile.availability.toLowerCase()} and interested in teams where AI has to earn trust through evidence.`,
};

export const proofPoints = [
  { value: '27%', label: 'higher answer accuracy', detail: 'Evaluation-led retrieval' },
  { value: '38%', label: 'lower inference cost', detail: 'Caching and model routing' },
  { value: '2.1×', label: 'faster review cycles', detail: 'Human-in-the-loop tooling' },
  { value: '99.9%', label: 'service availability', detail: 'Observable ML delivery' },
];

export type CaseStudy = {
  slug: string;
  index: string;
  label: string;
  title: string;
  seoTitle: string;
  summary: string;
  outcome: string;
  challenge: string;
  approach: string[];
  result: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  visual: 'rag' | 'voice' | 'commerce';
  accent: 'violet' | 'orange' | 'teal';
  external?: { label: string; href: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'support-copilot',
    index: '01',
    label: 'Retrieval · Evaluation',
    title: 'A support copilot that knows when evidence is not enough.',
    seoTitle: `Evaluated RAG Support Copilot Case Study — ${profile.name}`,
    summary: 'A fictional example showing how to present hybrid retrieval, answer evaluation, abstention, and human escalation as one production system.',
    outcome: '27% higher answer accuracy · 38% lower cost',
    challenge: 'The example support team had accurate knowledge spread across long, overlapping documents. A basic vector search returned plausible passages but could not reliably recognize weak evidence or conflicting policies.',
    approach: [
      'Combined semantic retrieval with exact-term search, then reranked candidates against the user’s intent.',
      'Added offline evaluation sets for retrieval quality, groundedness, citation accuracy, and safe abstention.',
      'Introduced caching, model routing, and human escalation when evidence confidence dropped below a defined threshold.',
    ],
    result: 'In this fictional demo, the evaluated workflow improved answer accuracy by 27% and reduced inference cost by 38% while making unsupported answers visible to reviewers.',
    metrics: [
      { value: '+27%', label: 'answer accuracy' },
      { value: '−38%', label: 'inference cost' },
      { value: '4', label: 'evaluation dimensions' },
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'pgvector', 'OpenTelemetry', 'AWS'],
    visual: 'rag',
    accent: 'violet',
  },
  {
    slug: 'quality-vision',
    index: '02',
    label: 'Computer vision · MLOps',
    title: 'Visual inspection that makes model uncertainty actionable.',
    seoTitle: `Computer Vision Quality System Case Study — ${profile.name}`,
    summary: 'A fictional computer-vision case study centered on calibration, drift monitoring, edge inference, and a review queue for uncertain predictions.',
    outcome: '18% fewer false rejects · 120 ms inference',
    challenge: 'The example inspection line needed low-latency classification, but changes in lighting and materials made raw confidence scores unreliable and expensive false rejects difficult to diagnose.',
    approach: [
      'Calibrated confidence against production-like validation data and routed uncertain items to a compact review queue.',
      'Tracked data slices, drift, and false-reject cost rather than reporting a single aggregate accuracy score.',
      'Optimized the model for edge inference and added traceable model-version metadata to each decision.',
    ],
    result: 'The fictional system reduced false rejects by 18%, met a 120 ms inference budget, and gave operators a clearer path for reviewing ambiguous cases.',
    metrics: [
      { value: '−18%', label: 'false rejects' },
      { value: '120 ms', label: 'edge inference' },
      { value: '7', label: 'monitored data slices' },
    ],
    stack: ['PyTorch', 'ONNX', 'OpenCV', 'MLflow', 'Docker', 'Azure'],
    visual: 'voice',
    accent: 'orange',
  },
  {
    slug: 'document-agents',
    index: '03',
    label: 'Agents · Document operations',
    title: 'Document agents designed around approvals, not autonomy theater.',
    seoTitle: `Human-in-the-Loop Agent Workflow Case Study — ${profile.name}`,
    summary: 'A fictional agent workflow that demonstrates tool permissions, review checkpoints, structured outputs, and observable failure recovery.',
    outcome: '2.1× faster review · 100% approval traceability',
    challenge: 'The sample operations team repeated the same extraction, comparison, and drafting steps across complex documents, but uncontrolled automation would have created unacceptable compliance risk.',
    approach: [
      'Split the workflow into narrow tools with explicit permissions, schemas, timeouts, and retry limits.',
      'Placed approval checkpoints before irreversible actions and stored the evidence behind every generated field.',
      'Evaluated completion quality and reviewer correction rate across representative document families.',
    ],
    result: 'In the demo scenario, reviewers completed work 2.1× faster while retaining a complete approval and evidence trail for every output.',
    metrics: [
      { value: '2.1×', label: 'review throughput' },
      { value: '100%', label: 'approval traceability' },
      { value: '0', label: 'unreviewed actions' },
    ],
    stack: ['TypeScript', 'Python', 'LangGraph', 'PostgreSQL', 'Temporal', 'GCP'],
    visual: 'commerce',
    accent: 'teal',
  },
];

export const experience = [
  {
    company: 'Example AI Studio',
    location: 'Remote',
    marker: 'EA',
    roles: [
      { title: 'Senior AI Product Engineer', dates: '2025 — Present' },
      { title: 'Machine Learning Engineer', dates: '2023 — 2025' },
    ],
    note: 'Replace this fictional entry with scope, decisions, and outcomes from your current role—not a duplicate of your résumé bullets.',
  },
  {
    company: 'Applied ML Lab',
    location: 'Berlin, Germany',
    marker: 'ML',
    roles: [{ title: 'Research Engineer', dates: '2021 — 2023' }],
    note: 'Use the timeline to show progression: what became harder, what you owned, and how your technical judgment grew.',
  },
  {
    company: 'Open-source work',
    location: 'Distributed',
    marker: 'OS',
    roles: [{ title: 'Maintainer & Contributor', dates: '2020 — Present' }],
    note: 'Link meaningful repositories, explain your contribution, and avoid vanity metrics that do not help a reviewer understand the work.',
  },
];

export const expertise = [
  {
    number: '01',
    title: 'LLM applications',
    description: 'Evaluated RAG, agent workflows, structured outputs, guardrails, and model orchestration grounded in product constraints.',
    tools: ['LangGraph', 'LlamaIndex', 'OpenAI', 'Anthropic', 'Gemini', 'Mistral'],
  },
  {
    number: '02',
    title: 'Machine learning systems',
    description: 'Experiment tracking, data quality, serving, observability, and feedback loops that connect model behavior to real outcomes.',
    tools: ['PyTorch', 'MLflow', 'Weights & Biases', 'Ray', 'Docker', 'Kubernetes'],
  },
  {
    number: '03',
    title: 'Product engineering',
    description: 'APIs, interfaces, and cloud delivery treated as one system—from the first interaction to production telemetry.',
    tools: ['FastAPI', 'React', 'TypeScript', 'AWS', 'Azure', 'GCP'],
  },
];

export const articles = [
  {
    title: 'How I evaluate retrieval before changing the model',
    description: 'A sample article card for explaining evaluation sets, failure categories, and the engineering decisions that follow.',
    date: 'Month DD, YYYY',
    source: 'Your publication',
    category: 'RAG evaluation',
    visual: 'ads' as const,
    href: 'https://example.com/article-one',
  },
  {
    title: 'What production feedback taught me about AI interfaces',
    description: 'A second sample showing how writing can demonstrate judgment that a list of technologies cannot.',
    date: 'Month DD, YYYY',
    source: 'Your publication',
    category: 'AI product',
    visual: 'inquiry' as const,
    href: 'https://example.com/article-two',
  },
];

export const writingArchiveUrl = 'https://example.com/writing';

export const education = {
  degree: 'M.S., Computer Science',
  institution: 'Example University',
  dates: '2019 — 2021',
  score: 'Optional distinction or focus',
  certifications: [
    'Relevant cloud or ML certification',
    'Responsible AI or data certification',
  ],
};

export const spotlight = {
  label: 'Open-source / Model Evaluation Kit',
  title: 'Turned repeated evaluation work into a reusable toolkit.',
  href: 'https://github.com/yourusername/example-project',
  body: 'Use this space for a standout open-source project, research artifact, product, talk, or community contribution.',
};
