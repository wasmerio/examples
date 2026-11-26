/**
 * Content constants for the Astro Validation Landing theme
 * Update these values to customize your landing page content
 */

export const siteConfig = {
  name: "Astro Validation Landing",
  title: "Astro Validation Landing - Validate Your Product Idea",
  description:
    "Build beautiful, high-converting landing pages to test your product idea, gather early interest, and validate market demand—without writing code.",
  image: "/og-image.png",
  quickLinks: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" }
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "mailto:hello@astro-validation-landing.com" }
  ]
};

export const header = {
  name: siteConfig.name,
  navLinks: siteConfig.quickLinks,
  cta: {
    label: "Get Early Access",
    href: "#cta"
  }
};

export const hero = {
  headline:
    "Stop Guessing, Start Validating. Launch Your Idea with Confidence.",
  subheadline:
    "Quickly build beautiful, high-converting landing pages to test your product idea, gather early interest, and validate market demand—without writing a single line of custom code. Get started today with Astro Validation Landing.",
  primaryCta: {
    label: "Get Early Access Now",
    href: "#cta"
  },
  secondaryCta: {
    label: "Learn More",
    href: "#features"
  },
  image: {
    src: "/images/hero-illustration.png",
    alt: "Hero illustration showing a validation dashboard"
  }
};

export const problem = {
  headline: "Are You Building in the Dark?",
  description:
    "Many entrepreneurs spend months or even years building the perfect product, only to discover that nobody wants it. You might be iterating on assumptions instead of validated facts. Without early market validation, you risk wasting time and resources on ideas that won't resonate with your audience."
};

export const solution = {
  headline: "Validate Your Vision, Faster & Smarter.",
  description:
    "Astro Validation Landing is your secret weapon for testing product ideas quickly and gathering real market feedback before you invest heavily in development. Our theme makes it simple to create stunning, conversion-optimized landing pages that capture interest, collect emails, and validate market demand. Launched from concept to live in hours, not weeks."
};

export const features = {
  heading: "Why Astro Validation Landing is Your Secret Weapon",
  description:
    "Everything you need to validate your product idea and gather market feedback.",
  items: [
    {
      icon: "⚡",
      headline: "Blazing Fast Performance",
      description:
        "Lighthouse 100 scores. Built with Astro for instant page loads that keep visitors engaged and boost conversions."
    },
    {
      icon: "✨",
      headline: "Stunning, Conversion-Focused Designs",
      description:
        "Pre-built, responsive layouts designed by conversion experts. Every pixel serves a purpose."
    },
    {
      icon: "🎨",
      headline: "Effortless Customization",
      description:
        "Swap colors, fonts, and content with simple configuration. No coding required for basic changes."
    },
    {
      icon: "📊",
      headline: "Integrated Analytics & Tracking",
      description:
        "Built-in hooks for Google Analytics, Segment, and custom tracking. Measure what matters."
    },
    {
      icon: "🔒",
      headline: "Built for Security & Privacy",
      description:
        "GDPR-compliant, no third-party trackers by default. Your visitors' data is safe."
    },
    {
      icon: "📱",
      headline: "Mobile-First Design",
      description:
        "Perfectly optimized for every device. Your landing page looks incredible on phones, tablets, and desktops."
    }
  ]
};

export const howItWorks = {
  heading: "Launch Your Idea in 3 Simple Steps",
  description:
    "From concept to live landing page validation in minutes, not weeks.",
  items: [
    {
      number: "1",
      headline: "Choose Your Template",
      description:
        "Select a pre-designed template or start from scratch. Customize colors, fonts, and layout to match your brand."
    },
    {
      number: "2",
      headline: "Customize Your Message",
      description:
        "Write your headline, add your value proposition, and upload your image. All without touching a line of code."
    },
    {
      number: "3",
      headline: "Go Live & Gather Insights",
      description:
        "Deploy in seconds and start collecting emails and feedback. Access detailed analytics to understand your audience."
    }
  ]
};

export const testimonials = {
  heading: "What Early Adopters Are Saying",
  description:
    "Real founders share their success stories using Astro Validation Landing.",
  items: [
    {
      quote:
        "We validated our SaaS idea in 48 hours using Astro Validation Landing. Got 200+ email signups from day one. This tool is a game-changer.",
      author: "Sarah Chen",
      company: "Product Manager at TechStartup",
      avatar: "SC",
      image: "/images/avatar-1.jpg"
    },
    {
      quote:
        "As a non-technical founder, I was skeptical. But this made launching a validation page easier than I expected. Highly recommended!",
      author: "Marcus Johnson",
      company: "Founder, AI Solutions Co.",
      avatar: "MJ",
      image: "/images/avatar-2.jpg"
    },
    {
      quote:
        "The conversion optimization built into this theme is incredible. Our CTR is 3x higher than typical landing page templates.",
      author: "Elena Rodriguez",
      company: "Growth Lead, FinTech Ventures",
      avatar: "ER",
      image: "/images/avatar-3.jpg"
    }
  ]
};

export const cta = {
  headline: "Ready to Validate Your Next Big Idea?",
  description:
    "Stop guessing and start validating today. Build your high-converting validation landing page in minutes, not weeks.",
  button: {
    label: "Start Validating Today!",
    href: "#email-signup"
  },
  disclaimer: "No spam, ever. Unsubscribe anytime."
};

export const faq = {
  heading: "Got Questions? We've Got Answers.",
  description: "Everything you need to know about Astro Validation Landing.",
  items: [
    {
      question: "What products can I validate?",
      answer:
        "You can validate any product or service idea—SaaS, mobile apps, physical products, online courses, consulting services, and more. If you have an idea and want to test market demand, this theme is for you."
    },
    {
      question: "Do I need coding skills?",
      answer:
        "No! Astro Validation Landing is designed for non-technical founders and entrepreneurs. You can customize colors, copy, and layout through simple configuration. For advanced customization, basic HTML/CSS knowledge helps."
    },
    {
      question: "How do I collect emails?",
      answer:
        "The theme includes placeholder forms that integrate with popular email platforms like Mailchimp, ConvertKit, and Brevo. We also support custom webhooks for any service you use."
    },
    {
      question: "Is it mobile-responsive?",
      answer:
        "Absolutely! Every component is built mobile-first and tested across all devices. Your landing page will look perfect on phones, tablets, and desktops."
    },
    {
      question: "What support is available?",
      answer:
        "We offer email support, an active community forum, and comprehensive documentation. Plus, the source code is yours to modify as needed."
    }
  ]
};

export const footer = {
  sections: {
    quickLinks: {
      title: "Quick Links",
      links: siteConfig.quickLinks
    },
    legal: {
      title: "Legal",
      links: siteConfig.legalLinks
    }
  },
  copyright: `© ${new Date().getFullYear()} Astro Validation Landing. All rights reserved.`,
  social: [
    { name: "Twitter", icon: "twitter", url: "https://twitter.com" },
    { name: "GitHub", icon: "github", url: "https://github.com" },
    { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com" }
  ]
};
