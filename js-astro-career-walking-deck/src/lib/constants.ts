import type { Site, Page } from './types'

export const loaderAnimation = [
  '.loader',
  { opacity: [1, 0], pointerEvents: 'none' },
  { easing: 'ease-out' },
]

export const LINKS = {
  gitlab: 'https://gitlab.com/kylifornication',
  github: 'https://github.com/kylifornication-code',
  linkedin: 'https://www.linkedin.com/in/kylejamescwu/',
  mail: 'mailto:kyleroyjames@gmail.com',
  instagram: 'https://www.instagram.com/caj_ink/',
  medium: 'https://ladvace.medium.com/',
  discord: 'https://discordapp.com/users/163300027618295808',
}

// Global
export const SITE: Site = {
  TITLE: 'Astro Sphere',
  DESCRIPTION:
    'Welcome to Kyle James\'s (KJs) career walking deck/site.',
  AUTHOR: 'Kyle James (KJ)',
}

// Work Page
export const WORK: Page = {
  TITLE: 'Work',
  DESCRIPTION: 'Places I have worked.',
}

// Study Page
export const STUDIES = [
  {
    title: 'IT Management: Cyber Security',
    institution: 'Central Washington University',
    link: 'https://www.cwu.edu',
    date: '2013 - 2016',
  },
  {
    title: 'Political Science',
    institution: 'Central Washington University',
    link: 'https://www.cwu.edu',
    date: '2011 - 2013',
  },
  {
    title: 'Web Development and Design',
    institution: 'Central Washington University',
    link: 'https://www.cwu.edu',
    date: '2013 - 2016',
  },
]

export const EXPERIENCE = [
  {
    company: 'The Walt Disney Company',
    location: 'Greater Seattle Area',
    position: 'Sr Manager, Security Engineering Partnerships',
    start: 'Mar 2025',
    link: 'https://www.linkedin.com/company/1292/',
    end: 'Current',
    tasks: [
      'Leading security engineering partnerships and strategic initiatives',
      'Application security and cross-functional team leadership',
      'Building strategic partnerships across security and engineering organizations',
    ],
  },
  {
    company: 'The Walt Disney Company',
    location: 'Seattle, Washington',
    position: 'Open Source Committee Chair',
    start: 'Jun 2021',
    link: 'https://www.linkedin.com/company/1292/',
    end: 'Current',
    tasks: [
      'Drive adoption, change, and community engagement of open source across The Walt Disney Company',
      'Managed programs and projects around standardizing technical, security, and legal reviews across segments',
      'Company-wide OSS training and scaling SCA/OSS scanning capabilities',
      'Developer relations and building strong relationships across the organization',
    ],
  },
  {
    company: 'The Walt Disney Company',
    location: 'Greater Seattle Area',
    position: 'Sr Staff Security Engineer | Manager',
    start: 'Aug 2022',
    link: 'https://www.linkedin.com/company/1292/',
    end: 'Mar 2025',
    tasks: [
      'Secure the magic, and make it easy for engineers to build security into our products and experiences',
      'Produce and procure Disneys enterprise-wide secure development services and programs',
      'Developer enablement focused on making security a resume-worthy accolade for developers',
      'Managed security tools: Snyk SCA, Whitehat SAST & DAST, Edgescan, Checkmarx SAST, Tenable ASM, ArmorCode ASPM',
    ],
  },
  {
    company: 'The Walt Disney Company',
    location: 'Seattle, Washington',
    position: 'Sr Software Product Engineer, DevOps Platforms and Enablement',
    start: 'Sep 2021',
    link: 'https://www.linkedin.com/company/1292/',
    end: 'Dec 2022',
    tasks: [
      'Collaborated and helped lead 4 functional engineering teams across entitlements, billing automation, and engineering tools',
      'Improved Entertainment divisions incident response process by integrating thousands of accounts across observability tools',
      'Developed ecosystem strategy for app monitoring tooling, product evals, and reducing spend through enterprise licensing negotiations',
      'Represented Disney at external events: DevOps Days, JUG, Gradle Dev days, AWS RE:Invent, UW Women in Tech',
      'Planned and supported JETA (JEDI Engineering Training Academy) program events',
    ],
  },
  {
    company: 'The Walt Disney Company',
    location: 'Seattle, Washington',
    position: 'Senior Product Manager, Developer Enablement and Engineering Platforms',
    start: 'Aug 2020',
    link: 'https://www.linkedin.com/company/1292/',
    end: 'Sep 2021',
    tasks: [
      'Change agent during 21st Century Fox acquisition, rationalized $2.5M in duplicate service contracts',
      'Worked with FXNetworks and STAR India to get GitHub.com approved for use across the company',
      'Consolidated multiple GitHub and MSFT contracts with $1.2M in savings',
      'Automated support with self-service sites and provided guardrails for implementing security into SDLC',
      'Managed technologies: GitHub, Bamboo, Circle CI, Jenkins, Octopus CI, Team City, Spinnaker, GitLab, Nexus',
    ],
  },
  {
    company: 'The Walt Disney Company',
    location: 'Seattle, Washington',
    position: 'DevOps Platform Product Owner, Enterprise Eng Shared Services',
    start: 'Apr 2018',
    link: 'https://www.linkedin.com/company/1292/',
    end: 'Aug 2020',
    tasks: [
      'Scaled GitLab from 50 users to 10k users, worked with GitLab to build self-service importer from GitHub',
      'Ran million dollar project to migrate 3k users and 50k projects, reducing $500k in licensing/support costs',
      'Evolved CICD offering to serve 12k users with multiple SCM deployments',
      'Ran Slackbot community of practice with 150+ technologists to learn about NLP and building bots',
      'Managed technologies: Slack, GitHub, GitLab, GitLab CICD, Sonatype Nexus, Jenkins, MacStadium',
    ],
  },
  {
    company: 'The Walt Disney Company',
    location: 'Seattle, Washington',
    position: 'Product Owner/Solutions Engineer',
    start: 'Jan 2017',
    link: 'https://www.linkedin.com/company/1292/',
    end: 'May 2018',
    tasks: [
      'Led migration project moving users from Perforce to GitHub, finished project early with self-service migration tool',
      'Built out first iteration of platforms hosted in AWS, migrating off Chef',
      'Built scripts to automate support, common engineering tasks, and help customers migrate workloads',
      'Made name as collaborator, developing relationships with teams and executives across Disney',
      'Managed technologies: GitHub, GitLab, GitLab CI, Nexus, Slack, Confluence, multiple custom micro-services',
    ],
  },
  {
    company: 'Kylifornication Web Design & Marketing',
    location: 'Greater Seattle Area',
    position: 'Web Designer and Marketing Consultant',
    start: 'Jan 2014',
    end: 'Jun 2021',
    tasks: [
      'Built ~50 sites ranging from custom coded informational web apps to CMS designed sites',
      'Scaled infrastructure with AWS, load balancers, autoscaling, and edge hosting after site reached 20k daily users',
      'Mobile UX: android, web, and iOS - Front-end development and design',
      'Projects utilizing JQuery, JQuery Mobile, XML, AJAX, JavaScript, HTML5, CSS3',
      'CMS Projects in WordPress, Wix, SquareSpace, Volusion',
      'Systems analysis, SEO, and SEM strategy',
    ],
  },
  {
    company: 'Zones, LLC',
    location: 'Auburn, Washington',
    position: 'Partner & Program Mgmt: Lenovo Consultant',
    start: 'Jun 2016',
    link: 'https://www.linkedin.com/company/7689/',
    end: 'Jan 2017',
    tasks: [
      'Developed unique GTM channel strategy and built programs around them',
      'Maintained tracking data in Dynamics CRM and managed $25 million+ quarterly pipeline',
      'Created and led company-wide cross-brand program resulting in every brand hitting or exceeding GTM targets',
      'Developed channel programs allowing Zones AEs to beat the market by 10% in AIO PC sales',
      'Lenovo Mini-site redesign using UX best practices',
    ],
  },
  {
    company: 'Rhino Security Labs, Inc',
    location: 'Greater Seattle Area',
    position: 'Technical Marketing Associate',
    start: 'Jan 2016',
    link: 'https://www.linkedin.com/company/3173487/',
    end: 'Jun 2016',
    tasks: [
      'Led remote dev team on version 2 of RhinoSecurityLabs.com site - managing project timelines, deliverables, cost, and QA',
      'Developed new web presence and email marketing campaigns',
      'Built automation: Python, Zapier and IFTTT flows from Sales to Slack',
      'Built initial customer base to launch 3rd party SIEM offering and kick start enterprise offering',
      'Curated and collaborated on technical content, web strategies, SEO/SEM targeting enterprise customers',
    ],
  },
  {
    company: 'Xperience Adventures',
    location: 'Greater Seattle Area',
    position: 'Director of Marketing PNW',
    start: 'Dec 2013',
    link: 'https://www.linkedin.com/company/3526652/',
    end: 'Jun 2016',
    tasks: [
      'Took events from a couple dozen to over 200 by developing full remote planning/working model',
      'Ran ~50 paid events across major US cities over few years',
      'Developed new email marketing strategies and calendar campaigns',
      'Planned, managed, and marketed largest 2014 race in Seattle, WA',
      'Social Media Management using Hootsuite Pro, SEO and SEM best practices',
    ],
  },
]
