import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Wind, Heart, Sparkles } from 'lucide-react';

type Category = 'tips' | 'breathing' | 'affirmations';

interface Guide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const categories: Record<Category, Guide[]> = {
    tips: [
      {
        id: 'tip-1',
        title: 'The Power of Silence',
        description:
          'Like a cat in a sunny window, find peace in quiet moments. Silence is where healing begins.',
        icon: <Sparkles className="h-6 w-6" />,
        color: 'bg-amber-100',
      },
      {
        id: 'tip-2',
        title: 'Slow Blinking',
        description:
          "Practice slow blinking. It's a cat's way of saying 'I love you' and signals trust to your nervous system.",
        icon: <Heart className="h-6 w-6" />,
        color: 'bg-pink-100',
      },
      {
        id: 'tip-3',
        title: 'Mindful Stretching',
        description:
          'Cats stretch throughout the day. Incorporate gentle stretches into your meditation practice.',
        icon: <Wind className="h-6 w-6" />,
        color: 'bg-green-100',
      },
      {
        id: 'tip-4',
        title: 'Comfort is Key',
        description:
          'Find your cozy corner. A comfortable space makes meditation easier and more enjoyable.',
        icon: <Lightbulb className="h-6 w-6" />,
        color: 'bg-blue-100',
      },
      {
        id: 'tip-5',
        title: 'Focus on Your Breath',
        description:
          'Let your breath be your anchor. When your mind wanders, gently bring it back to your natural rhythm.',
        icon: <Wind className="h-6 w-6" />,
        color: 'bg-teal-100',
      },
      {
        id: 'tip-6',
        title: 'Practice Gratitude',
        description:
          "Start each session by noting 3 things you're grateful for. This shifts your mind toward positivity.",
        icon: <Heart className="h-6 w-6" />,
        color: 'bg-fuchsia-100',
      },
      {
        id: 'tip-7',
        title: 'Meditate in Nature',
        description:
          'Whenever possible, take your meditation practice outdoors. Nature amplifies the calming effect.',
        icon: <Sparkles className="h-6 w-6" />,
        color: 'bg-emerald-100',
      },
      {
        id: 'tip-8',
        title: 'Same Time, Every Day',
        description:
          'Build a routine. Meditating at the same time helps train your mind and body to relax faster.',
        icon: <Lightbulb className="h-6 w-6" />,
        color: 'bg-sky-100',
      },
    ],
    breathing: [
      {
        id: 'breath-1',
        title: '4-4-4-4 Breathing',
        description:
          'Inhale for 4, hold for 4, exhale for 4, hold for 4. The perfect cat-like rhythm.',
        icon: <Wind className="h-6 w-6" />,
        color: 'bg-cyan-100',
      },
      {
        id: 'breath-2',
        title: 'Purring Breath',
        description:
          "Exhale with a soft humming sound, like a cat's purr. Feel the vibrations calm your nerves.",
        icon: <Heart className="h-6 w-6" />,
        color: 'bg-purple-100',
      },
      {
        id: 'breath-3',
        title: 'Box Breathing',
        description:
          'Equal parts: inhale, hold, exhale, pause. Simple yet powerful for instant calm.',
        icon: <Sparkles className="h-6 w-6" />,
        color: 'bg-rose-100',
      },
      {
        id: 'breath-4',
        title: 'Extended Exhale',
        description:
          "Make your exhale longer than your inhale. Signals to your body it's safe to relax.",
        icon: <Lightbulb className="h-6 w-6" />,
        color: 'bg-lime-100',
      },
      {
        id: 'breath-5',
        title: 'Alternate Nostril Breathing',
        description:
          'Nadi Shodhana: Balance your nervous system by breathing through alternating nostrils.',
        icon: <Wind className="h-6 w-6" />,
        color: 'bg-violet-100',
      },
      {
        id: 'breath-6',
        title: 'Belly Breathing',
        description:
          'Place your hand on your belly. Feel it rise and fall with each breath. This activates calm.',
        icon: <Heart className="h-6 w-6" />,
        color: 'bg-pink-100',
      },
      {
        id: 'breath-7',
        title: 'Coherent Breathing',
        description:
          '5 seconds in, 5 seconds out. Creates heart-brain coherence for deep relaxation.',
        icon: <Sparkles className="h-6 w-6" />,
        color: 'bg-amber-100',
      },
      {
        id: 'breath-8',
        title: "Lion's Breath",
        description:
          'Take a deep breath, then exhale forcefully while opening your mouth. Releases tension instantly.',
        icon: <Lightbulb className="h-6 w-6" />,
        color: 'bg-orange-100',
      },
    ],
    affirmations: [
      {
        id: 'aff-1',
        title: 'I breathe in calm, I breathe out noise',
        description:
          'Like a cat in the moment, I let go of past worries and future fears.',
        icon: <Heart className="h-6 w-6" />,
        color: 'bg-red-100',
      },
      {
        id: 'aff-2',
        title: 'Slow is better than fast',
        description:
          "I embrace the cat's philosophy of grace and deliberate movement.",
        icon: <Sparkles className="h-6 w-6" />,
        color: 'bg-yellow-100',
      },
      {
        id: 'aff-3',
        title: 'I deserve rest and comfort',
        description:
          "Napping is not laziness, it's wisdom. I honor my body's needs.",
        icon: <Lightbulb className="h-6 w-6" />,
        color: 'bg-indigo-100',
      },
      {
        id: 'aff-4',
        title: 'Every moment is a new beginning',
        description:
          'Like a cat landing on its feet, I adapt and find balance.',
        icon: <Wind className="h-6 w-6" />,
        color: 'bg-orange-100',
      },
      {
        id: 'aff-5',
        title: 'My mind is clear and peaceful',
        description: 'I let go of stress and embrace serenity in every breath.',
        icon: <Heart className="h-6 w-6" />,
        color: 'bg-rose-100',
      },
      {
        id: 'aff-6',
        title: "Like a cat's purr, I radiate calm",
        description:
          'I treat myself with the same compassion I give to others.',
        icon: <Sparkles className="h-6 w-6" />,
        color: 'bg-pink-100',
      },
      {
        id: 'aff-7',
        title: 'Challenges make me stronger',
        description:
          'Like a cat, I land gracefully on my feet through any situation.',
        icon: <Lightbulb className="h-6 w-6" />,
        color: 'bg-cyan-100',
      },
      {
        id: 'aff-8',
        title: 'My energy is positive and vibrant',
        description:
          'I radiate calm confidence and attract good things into my life.',
        icon: <Wind className="h-6 w-6" />,
        color: 'bg-lime-100',
      },
    ],
  };

  const categoryLabels: Record<
    Category,
    { name: string; icon: React.ReactNode }
  > = {
    tips: { name: 'Zen Tips', icon: <Lightbulb className="h-5 w-5" /> },
    breathing: {
      name: 'Breathing Techniques',
      icon: <Wind className="h-5 w-5" />,
    },
    affirmations: {
      name: 'Daily Affirmations',
      icon: <Heart className="h-5 w-5" />,
    },
  };

  return (
    <div className="from-secondary/10 via-background to-primary/5 min-h-screen bg-gradient-to-br p-6">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <a href="/">
            <button
              data-testid="button-back-explore"
              className="hover:bg-secondary/20 rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </a>
          <div>
            <h1 className="font-heading text-foreground text-4xl font-bold">
              Explore Zen
            </h1>
            <p className="text-muted-foreground">
              Deepen your practice with timeless wisdom
            </p>
          </div>
        </motion.div>

        {/* Category Selection */}
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {(Object.keys(categoryLabels) as Category[]).map(
                (category, idx) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    data-testid={`button-category-${category}`}
                    className="group"
                  >
                    <div className="bg-card h-full overflow-hidden rounded-[2rem] border-none shadow-lg transition-all hover:shadow-xl">
                      <div className="flex flex-col items-center gap-4 p-8 text-center">
                        <div className="bg-primary/10 group-hover:bg-primary/20 text-primary flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                          {categoryLabels[category].icon}
                        </div>
                        <h3 className="font-heading text-foreground text-2xl font-bold">
                          {categoryLabels[category].name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {category === 'tips' && 'Learn meditation wisdom'}
                          {category === 'breathing' &&
                            'Master breathing techniques'}
                          {category === 'affirmations' && 'Empower your mind'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ),
              )}
            </motion.div>
          ) : (
            /* Content View */
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Back Button */}
              <motion.button
                onClick={() => setSelectedCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-primary hover:text-primary/80 mb-4 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to categories
              </motion.button>

              {/* Header */}
              <div>
                <h2 className="font-heading text-foreground mb-2 text-3xl font-bold">
                  {categoryLabels[selectedCategory].name}
                </h2>
                <p className="text-muted-foreground">
                  {selectedCategory === 'tips' &&
                    'Wisdom from the wisdom keepers - cats 🐱'}
                  {selectedCategory === 'breathing' &&
                    'Techniques to calm your mind and body'}
                  {selectedCategory === 'affirmations' &&
                    'Affirmations to start your day with zen'}
                </p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <AnimatePresence>
                  {categories[selectedCategory].map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      data-testid={`card-${selectedCategory}-${item.id}`}
                      whileHover={{ y: -5 }}
                    >
                      <div className="bg-card h-full overflow-hidden rounded-[2rem] border-none shadow-lg transition-all hover:shadow-xl">
                        <div className="flex h-full flex-col gap-4 p-8">
                          <div
                            className={`text-primary flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-heading text-foreground mb-2 text-xl font-bold">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Explore;
