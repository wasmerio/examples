import AnimatedText from "../../../../components/animatedText";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";

function Partners() {
  const {
    home: { partners },
  } = useContext(ConfigContext)!;
  if (!partners) return null;

  return (
    <section id={partners.id} className="relative p-4">
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-neutral -z-10" />
      <div className="max-w-screen-lg mx-auto mb-12 flex flex-col items-center">
        <h2 className="text-neutral-content text-4xl my-4 font-bold">
          <AnimatedText text={partners.title} />
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 1, once: true, margin: "0px 0px -100px 0px" }}
          className="mt-4 w-full grid gap-8 grid-cols-[repeat(auto-fit,minmax(100px,1fr))] justify-items-center md:gap-8"
        >
          {partners.logos.map((logo, index) => (
            <motion.img
              key={index}
              src={logo}
              alt="partner logo"
              variants={{
                hidden: { y: "-80%", opacity: 0 },
                visible: { y: "0%", opacity: 1 },
              }}
              transition={{ delay: 0.25 + index * 0.25 }}
              className="w-20 h-20"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Partners;
