import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Terminal, Database, Globe, Cpu, Zap, Shield } from 'lucide-react';

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, description, icon: Icon, className = "" }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative flex flex-col items-start justify-between p-8 overflow-hidden rounded-3xl bg-white/5 border border-white/10 group ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 240, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="z-10 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 text-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]">
        <Icon size={28} />
      </div>
      <div className="z-10 mt-auto w-full">
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
}

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 relative z-10 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-sm font-semibold mb-6 tracking-wider uppercase"
        >
            Architecture
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Scale</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          An ecosystem built on cutting-edge primitives, giving you the foundation to build impossible interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
        <BentoCard 
          title="Terminal Output" 
          description="Direct access to raw CLI power right from the browser. Compile and run seamlessly." 
          icon={Terminal} 
          className="md:col-span-2 lg:col-span-2 row-span-1" 
        />
        <BentoCard 
          title="Global Edge" 
          description="Deploy anywhere, run everywhere with sub-50ms latency globally." 
          icon={Globe} 
          className="md:col-span-1 lg:col-span-2 row-span-1" 
        />
        <BentoCard 
          title="Quantum State" 
          description="Predictable, highly-scalable React state living inside Astro islands." 
          icon={Cpu} 
          className="md:col-span-1 lg:col-span-1 row-span-1 md:row-span-2" 
        />
        <BentoCard 
          title="Lightning Fast" 
          description="0 JS by default. Ship interactive islands only when absolutely necessary." 
          icon={Zap} 
          className="md:col-span-2 lg:col-span-2 row-span-1" 
        />
        <BentoCard 
          title="Ironclad Security" 
          description="Static generation means no database queries on the client. Unhackable by design." 
          icon={Shield} 
          className="md:col-span-1 lg:col-span-1 row-span-1" 
        />
      </div>
    </section>
  );
};
