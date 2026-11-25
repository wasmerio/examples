import { motion } from 'framer-motion';
import { ArrowLeft, Heart, PawPrint } from 'lucide-react';

export default function About() {
  return (
    <div className="from-primary/5 via-background to-secondary/5 min-h-screen bg-gradient-to-br p-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <a href="/">
            <button
              data-testid="button-back-about"
              className="hover:bg-secondary/20 mb-4 rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div className="space-y-4 text-center">
            <PawPrint className="text-primary mx-auto h-12 w-12" />
            <h1 className="font-heading text-foreground text-4xl font-bold md:text-5xl">
              About Purrfectly Zen
            </h1>
          </div>

          <div className="bg-card rounded-[2rem] border-none shadow-lg">
            <div className="space-y-6 p-8 md:p-12">
              <div className="space-y-4">
                <h2 className="font-heading text-foreground text-2xl font-bold">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  At Purrfectly Zen, we believe that cats are the ultimate
                  meditation teachers. They embody stillness, presence, and the
                  art of doing absolutely nothing—which is actually everything.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="font-heading text-foreground text-2xl font-bold">
                  Why Cats?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Cats teach us the philosophy of zen through their everyday
                  actions. They don't overthink. They rest when they need to.
                  They appreciate simple moments like a sunny window or a soft
                  lap. Purrfectly Zen helps you embrace these lessons through
                  guided meditation and mindfulness practices.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="font-heading text-foreground text-2xl font-bold">
                  About Our Name
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  "Purrfect" is a playful wordplay combining two things we love:
                  the soothing sound of a cat's purr and the idea of perfection.{' '}
                  <span className="text-foreground font-semibold">Purr</span>{' '}
                  (the cat's peaceful rumble) +{' '}
                  <span className="text-foreground font-semibold">Perfect</span>{' '}
                  (our goal for your meditation practice) ={' '}
                  <span className="text-primary font-semibold">Purrfect</span>.
                  It perfectly captures the essence of our mission: using the
                  calming presence of cats to help you find your perfect zen
                  state.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="font-heading text-foreground text-2xl font-bold">
                  What We Offer
                </h2>
                <ul className="space-y-3">
                  {[
                    'Interactive meditation timer with customizable sessions',
                    'Breathing techniques & mindfulness exercises',
                    'Daily affirmations & zen wisdom',
                    'A supportive community of cat lovers',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Heart className="text-primary mt-1 h-5 w-5 flex-shrink-0 fill-current" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-border/40 border-t pt-4">
                <p className="text-muted-foreground text-center italic">
                  Find your zen. One breath, one paw print at a time. 🐱✨
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href="/">
              <button
                data-testid="button-back-home-about"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-2 font-bold"
              >
                Back to Home
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
