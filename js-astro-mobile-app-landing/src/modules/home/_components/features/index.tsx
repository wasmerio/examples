import AnimatedText from "../../../../components/animatedText";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";

function Features() {
  const {
    home: { features },
  } = useContext(ConfigContext)!;
  if (!features) return null;

  return (
    <section id={features.id} className="max-w-screen-lg mx-auto px-4 py-12">
      <div className="mb-12 max-w-none flex flex-col items-center prose prose-lg text-center">
        <h1 className="mb-3">
          <AnimatedText text={features.title} />
        </h1>
        <motion.div
          className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full overflow-hidden [--w:200px] md:[--w:350px]"
          whileInView={{ width: "var(--w)" }}
          viewport={{ amount: 1, once: true, margin: "0px 0px -100px 0px" }}
        />
        {features.subtitle && (
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 0.7 }}
            viewport={{ once: true }}
            className="text-md max-w-lg"
          >
            {features.subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
      >
        {features.cards.map((feat, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { x: "-100%", opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
            transition={{ delay: 0.25 + index * 0.25 }}
            className={clsx(
              "shadow-md border-primary/10 border-2 card relative overflow-hidden group px-12",
              {
                "col-span-2":
                  index === features!.cards.length - 1 &&
                  features!.cards.length % 2 === 1,
              }
            )}
          >
            <div className="relative mb-4 mt-4">
              <div
                className={clsx(
                  "absolute left-0 right-0 top-0 bottom-0 bg-secondary/50 -z-10 rounded-lg"
                )}
              />
              <figure className="py-4">
                <img
                  src={feat.icon}
                  alt="feature icon"
                  className="w-40 transition-transform group-hover:scale-90"
                />
              </figure>
            </div>
            <div className="w-full pt-0 px-0 card-body items-center text-center transition-transform max-w-none group-hover:scale-95">
              <h2 className="card-title text-2xl font-bold">{feat.title}</h2>
              <div className="h-0.5 w-full bg-primary/10" />
              <p className="opacity-[.7]">{feat.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Features;
