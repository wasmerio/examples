import Timeline from '@/components/ui/timeline'
import ExperienceTimelineItem from '@/components/home/experience/experience-timeline-item'

const EXPERIENCES = [
  {
    index: '01',
    logo: '/images/features/logo-01.webp',
    company: 'Lumio',
    role: 'Design Engineer',
    period: '2025 -',
    status: { text: 'Present', tone: 'positive' as const },
    stack: ['React', 'Figma', 'Design system', 'Tailwind'],
    achievement: 'Built a design system adopted by 4 product teams within 30 days',
    description:
      "Joined as the first design engineer on the team. Owned the entire design-to-code pipeline, built the product's design system from scratch, shipped new features weekly, and made sure nothing got lost between Figma and production."
  },
  {
    index: '02',
    logo: '/images/features/logo-02.webp',
    company: 'Trackflow HQ',
    role: 'Frontend Engineer + Designer',
    period: '2023 - 2024, 1 year',
    stack: ['React', 'Next.js', 'Figma', 'CSS', 'Component architecture'],
    achievement: 'Rebuilt the entire dashboard UI and cut user drop-off by 40%',
    description:
      'Started as a frontend engineer but quickly moved into a hybrid role. Rebuilt the core dashboard UI, reduced design inconsistencies across 30+ screens, and introduced component-based thinking to a team that had never used one.'
  },
  {
    index: '03',
    logo: '/images/features/logo-03.webp',
    company: 'Orion Labs',
    role: 'Freelance Design Engineer',
    period: '2023, 5 Months',
    stack: ['Framer', 'Motion design', 'Visual design', 'Copywriting'],
    achievement: 'Designed and shipped a full marketing site solo in under a week',
    description:
      'Brought in to design and build a launch marketing site before a funding announcement. Delivered a fully animated Framer site in 5 days — design, build, and deployment handled solo.'
  },
  {
    index: '04',
    logo: '/images/features/logo-04.webp',
    company: 'Self-initiated',
    role: 'Side Projects & Open Source',
    period: '2022 -',
    status: { text: 'Ongoing · Personal', tone: 'accent' as const },
    stack: ['React', 'Framer', 'TypeScript', 'Passion for building'],
    achievement: '3 shipped products with real users, 1 open source component library',
    description:
      'Built a Framer component playground, a minimal habit tracker app, and a Chrome extension for designers. Where most of the real learning happens — no deadlines, no clients, just curiosity and craft.'
  }
]

const ExperienceTimeline = () => {
  return (
    <Timeline
      data={EXPERIENCES.map(({ index, ...experience }) => ({
        index,
        content: <ExperienceTimelineItem {...experience} />
      }))}
    />
  )
}

export default ExperienceTimeline
