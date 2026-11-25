import AnimatedText from "../../../../components/animatedText";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";

const planImages = [
  "/misc/wallet-front-color.webp",
  "/misc/money-front-color.webp",
  "/misc/locker-front-color.webp",
];

const planBGs = ["bg-primary/80", "bg-secondary/80", "bg-accent/80"];

function Pricing() {
  const {
    home: { pricing },
  } = useContext(ConfigContext)!;
  if (!pricing) return null;

  return (
    <section
      id={pricing.id}
      className="overflow-hidden max-w-screen-lg mx-auto px-4 py-12"
    >
      <div className="mb-12 max-w-none flex flex-col items-center prose prose-lg text-center">
        <h1 className="mb-0">
          <AnimatedText text={pricing.title} />
        </h1>
        <motion.p
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 0.7 }}
          viewport={{ once: true }}
          className="text-xl max-w-lg"
        >
          {pricing.subtitle}
        </motion.p>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col max-w-none gap-8 md:flex-row md:justify-center"
      >
        {pricing.plans?.map((plan, index) => (
          <motion.div
            key={index}
            transition={{ delay: 0.25 + index * 0.25 }}
            className="md:w-1/3 flex relative"
            variants={{
              hidden: { x: "-100%", opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            {plan.featured && (
              <div className="absolute top-0 bottom-1 right-1 left-0 bg-secondary -z-10 rounded-[var(--rounded-box)]" />
            )}
            <div
              className={clsx(
                "border-2 border-primary/10 flex-1 card p-0 shadow-md bg-base-100 z-10 overflow-hidden",
                {
                  "-translate-x-3 -translate-y-3 transition-transform hover:translate-x-0 hover:translate-y-0":
                    plan.featured,
                }
              )}
            >
              <div className="card-body p-0 text-center">
                <div className="flex relative">
                  {plan.featured && (
                    <div className="rounded-none badge badge-info top-0 right-0 absolute">
                      Best Price
                    </div>
                  )}
                  <div className={clsx("h-32 w-[40%] p-4", planBGs[index])}>
                    <img
                      src={planImages[index]}
                      alt="pricing plan"
                      className="m-0 h-full w-full object-contain"
                    />
                  </div>
                  <div className="mt-8 flex-1 font-bold">
                    <h4 className="text-xl my-1">{plan.title}</h4>
                    <p className="my-1">{plan.price}</p>
                  </div>
                </div>
                <div className="w-full flex-1 flex flex-col mb-4">
                  {plan.rows.map((row, index) => (
                    <div key={index} className="flex relative items-center">
                      <span className="relative flex h-3 w-3 mx-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                      </span>
                      <p className="flex-1 text-left my-2">{row}</p>
                    </div>
                  ))}
                </div>
                {pricing.actionText && (
                  <div className="w-full">
                    <a
                      href="/app"
                      className="btn btn-primary btn-square no-animation rounded-none w-full text-lg h-auto py-4"
                    >
                      {pricing.actionText}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Pricing;
