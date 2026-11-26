import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[800px] h-[800px] bg-neon-purple/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[600px] h-[600px] bg-neon-blue/20 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neon-blue/30 text-neon-blue font-medium text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Next-Generation Interaction</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight"
          >
            Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Hologram</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
          >
            Experience the future of web interfaces with fluid animations, zero layout shifts, and blazing fast performance powered by Astro and React.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <button className="px-8 py-4 rounded-full bg-white text-quantum-900 font-bold text-lg hover:bg-neon-blue transition-colors duration-300 flex items-center gap-2 group">
              Explore Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full glass-panel text-white font-bold text-lg hover:bg-white/10 transition-colors duration-300">
              View Documentation
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
