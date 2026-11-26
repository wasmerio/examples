
import { motion } from "framer-motion";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What is your primary tech stack?",
    answer:
      "I am technology agnostic but deeply experienced with JavaScript/TypeScript (React, Next.js, Node.js, Astro), Python (FastAPI, AI/ML frameworks), and systems languages like Rust, Zig, and Go. I choose the best tool for the specific problem at hand.",
  },
  {
    question: "What kind of work do you do?",
    answer:
      "I specialize in full-stack development, AI/ML engineering, and developer tooling. I build web applications, APIs, CLI tools, and open-source libraries. I'm particularly interested in developer experience and high-performance systems.",
  },
  {
    question: "Do you accept freelance or contract work?",
    answer:
      "Yes, I am open to discussing freelance projects, consultancy, and open-source collaboration opportunities. Feel free to reach out via LinkedIn or email to discuss your project requirements.",
  },
  {
    question: "How do you approach open source contributions?",
    answer:
      "I believe in building sustainable tools that solve real developer pain points. My contributions focus on long-term maintainability, performance, documentation, and excellent developer experience.",
  },
  {
    question: "Where are you based?",
    answer: `I am based in ${siteConfig.author.location.country}, but I work with teams and clients globally. I'm comfortable with remote collaboration across different time zones.`,
  },
  {
    question: "I tried contacting you but got no response. What should I do?",
    answer:
      "If I haven't responded, I might be busy with other commitments. If your inquiry is important, please feel free to follow up via email or create an issue in the relevant GitHub repository. You can also try reaching me on LinkedIn.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="min-h-[60vh] flex flex-col justify-center py-12 sm:py-16 lg:py-20 bg-muted/20 w-full overflow-hidden"
      suppressHydrationWarning={true}
    >
      <div className="container w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Common questions about my work, availability, and how we can
            collaborate.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b last:border-b-0"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base md:text-lg font-medium px-4 sm:px-6 hover:no-underline hover:bg-muted/50 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed px-4 sm:px-6 pb-4 sm:pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Still have questions? Feel free to reach out.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button className="gap-2 rounded-full" asChild>
              <a href={`mailto:${siteConfig.author.email}`}>
                <Mail className="h-4 w-4" />
                Send Email
              </a>
            </Button>
            <Button variant="outline" className="gap-2 rounded-full" asChild>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="h-4 w-4" />
                Message on LinkedIn
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Schema.org FAQPage structured data */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Safe JSON content for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqData.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
