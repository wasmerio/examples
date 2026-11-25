import AnimatedText from "../../../../components/animatedText";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import SwirlArrowBottomLeft from "./svg/swirlArrowBottomLeft";
import SwirlArrowBottomRight from "./svg/swirlArrowBottomRight";
import SwirlArrowBottom from "./svg/swirlArrowBottom";

function HowItWorks() {
  const {
    home: { howItWorks },
  } = useContext(ConfigContext)!;

  if (!howItWorks) return null;

  return (
    <section
      id={howItWorks.id}
      className="overflow-hidden max-w-screen-lg mx-auto px-4 py-12"
    >
      <div className="mb-12 max-w-none flex flex-col items-center prose prose-lg text-center">
        <h1 className="mb-3">
          <AnimatedText text={howItWorks.title} />
        </h1>
        {howItWorks.subtitle && (
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 0.7 }}
            viewport={{ once: true }}
            className="text-md max-w-lg"
          >
            {howItWorks.subtitle}
          </motion.p>
        )}
      </div>
      <div className="flex flex-col gap-52">
        {howItWorks.steps.map((step, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className={clsx(
              "text-primary relative flex flex-col rounded-md md:flex-row",
              {
                "md:flex-row-reverse": index % 2 === 0,
              }
            )}
          >
            {index < howItWorks!.steps.length - 1 && (
              <>
                <motion.div
                  variants={{
                    hidden: {
                      scale: 0,
                      translateX: "-50%",
                    },
                    visible: { scale: 1, translateX: "-50%" },
                  }}
                  transition={{ stiffness: 150, type: "spring" }}
                  className="hidden w-48 absolute -bottom-44 left-1/2 md:block"
                >
                  {index % 2 === 0 ? (
                    <SwirlArrowBottomLeft />
                  ) : (
                    <SwirlArrowBottomRight />
                  )}
                </motion.div>
                <motion.div
                  variants={{
                    hidden: {
                      scale: 0,
                      translateX: "-50%",
                    },
                    visible: { scale: 1, translateX: "-50%" },
                  }}
                  transition={{ stiffness: 150, type: "spring" }}
                  className="w-16 absolute -bottom-48 left-1/2 md:hidden md:-bottom-36"
                >
                  <SwirlArrowBottom />
                </motion.div>
              </>
            )}
            <motion.div
              variants={{
                hidden: { x: index % 2 === 0 ? "100%" : "-100%", opacity: 0 },
                visible: { x: "0%", opacity: 1 },
              }}
              className="mb-8 flex flex-col text-center justify-center prose flex-1"
            >
              <div className="pb-0 font-sketch text-8xl text-primary">
                {index < 10 && 0}
                {index + 1}
              </div>
              <h4 className="mt-0 text-2xl font-bold">{step.title}</h4>
              <p className="mx-auto max-w-sm opacity-[.7]">{step.subtitle}</p>
            </motion.div>
            <motion.div
              variants={{
                hidden: { x: index % 2 === 1 ? "100%" : "-100%", opacity: 0 },
                visible: { x: "0%", opacity: 1 },
              }}
              className="flex-1 flex justify-center"
            >
              <img
                className="rounded-3xl lg:w-[75%]"
                src={step.image}
                alt={`step ${index}`}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
