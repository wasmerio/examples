import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = [
    {
      id: 'faq-1',
      question: 'How long should I meditate each day?',
      answer:
        'Start with just 5 minutes daily. Even a short practice is powerful when consistent. As you progress, you can extend to 10, 20, or 30 minutes.',
    },
    {
      id: 'faq-2',
      question: "I can't stop my mind from wandering. Am I doing it wrong?",
      answer:
        "Not at all! Mind-wandering is completely normal. Meditation is noticing when your mind wanders and gently bringing it back—that's the practice itself.",
    },
    {
      id: 'faq-3',
      question: 'Best time of day to meditate?',
      answer:
        "Early morning (after waking) is ideal for most people. However, the best time is whenever you'll actually do it. Consistency matters more than timing.",
    },
    {
      id: 'faq-4',
      question: 'Do I need a special place to meditate?',
      answer:
        'No. While a quiet, comfortable space helps, meditation can happen anywhere—your bedroom, a park, even on the bus. Find what works for you.',
    },
    {
      id: 'faq-5',
      question: 'Is meditation religious? Can anyone do it?',
      answer:
        'Meditation has roots in many traditions, but modern mindfulness meditation is secular and evidence-based. Anyone can benefit, regardless of beliefs.',
    },
    {
      id: 'faq-6',
      question: 'How long before I see results?',
      answer:
        'Some benefits (like reduced stress) appear within days. Deeper changes take weeks or months. Trust the process and keep practicing.',
    },
    {
      id: 'faq-7',
      question: 'What if I fall asleep during meditation?',
      answer:
        "It's fine! Your body might need rest. If it happens frequently, try meditating earlier in the day or sitting upright instead of lying down.",
    },
    {
      id: 'faq-8',
      question: 'Can I meditate while walking?',
      answer:
        'Yes! Walking meditation is a powerful practice. Focus on the sensation of each step, your breath, and your surroundings as you walk slowly.',
    },
  ];

  return (
    <div className="from-secondary/10 via-background to-primary/5 min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-4"
        >
          <a href="/">
            <button className="hover:bg-secondary/20 rounded-full p-2 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </a>
          <div>
            <h1 className="font-heading text-foreground text-4xl font-bold">
              FAQ
            </h1>
            <p className="text-muted-foreground">
              Answers to your meditation questions
            </p>
          </div>
        </motion.div>

        {/* FAQs */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`faq-item-${faq.id}`}
            >
              <div className="border-border/40 bg-card overflow-hidden rounded-xl border shadow-lg transition-shadow hover:shadow-xl">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === faq.id ? null : faq.id)
                  }
                  className="bg-card hover:bg-card/80 w-full p-6 text-left transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-foreground text-lg font-bold">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-primary flex-shrink-0"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-border/40 overflow-hidden border-t"
                    >
                      <p className="text-muted-foreground p-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-primary/10 mt-12 rounded-2xl p-8 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions? We'd love to hear from you.
          </p>
          <a href="/contact">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2 font-bold shadow-lg transition-all hover:shadow-xl">
              Contact Us
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
