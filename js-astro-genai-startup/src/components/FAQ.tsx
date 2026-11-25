import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What AI models do you support?",
    answer:
      "We support a wide range of state-of-the-art AI models including GPT-4, Claude, Llama, and custom fine-tuned models. Our platform is model-agnostic and continuously updated with the latest releases.",
  },
  {
    question: "How is pricing calculated?",
    answer:
      "Pricing is based on the number of API requests and the complexity of the AI models used. We offer transparent, pay-as-you-go pricing with no hidden fees. You can upgrade or downgrade your plan at any time.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use bank-level encryption (AES-256) for data at rest and in transit. We're SOC 2 Type II certified and compliant with GDPR, HIPAA, and other major data protection regulations. Your data is never used to train models without explicit consent.",
  },
  {
    question: "Can I use this for commercial projects?",
    answer:
      "Yes! All our plans, including the free tier, can be used for commercial projects. We encourage you to build and ship products using our platform. Enterprise plans offer additional features for large-scale deployments.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Free plans include community support and comprehensive documentation. Pro plans get priority email support with 24-hour response times. Enterprise customers receive 24/7 dedicated support with a dedicated account manager and custom SLAs.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! We offer a generous free tier that includes 1,000 API requests per month. Pro and Enterprise plans come with a 14-day free trial with no credit card required. You can cancel anytime.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              questions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to know about our platform
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
