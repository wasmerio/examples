import { services } from "@/config/services";

export const contact = {
  lead: "Tell us a little about the project. A founder or director reads every message and replies within two working days.",
  /** Options in the form. Services come from the services config. */
  interests: services.map((service) => service.title),
  budgets: ["Under $25k", "$25k to $50k", "$50k to $100k", "$100k+"],
  timings: ["As soon as possible", "In the next three months", "Later this year", "Just exploring"],
  success: "Thank you. We have your message and will reply within two working days.",
};

export const faq = [
  {
    question: "What does a project usually cost?",
    answer:
      "Most identity projects start around $40k and most websites around $60k. We send a fixed proposal after a first call, so you know the number before anything starts.",
  },
  {
    question: "How long does it take?",
    answer:
      "An identity takes eight to twelve weeks, a website ten to sixteen. Packaging depends on the printer, and we plan around their calendar from day one.",
  },
  {
    question: "Do you work with startups?",
    answer:
      "Yes, often. Around a third of our clients are pre-launch. If the budget is tight we will suggest a smaller first phase rather than a smaller effort.",
  },
  {
    question: "Can you work with our in-house team?",
    answer:
      "Gladly. We often build the system and train the team who will run it, then step back to a few hours a month of art direction.",
  },
];
