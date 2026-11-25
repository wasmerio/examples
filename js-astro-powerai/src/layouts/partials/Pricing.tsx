


import type { PricingType } from "@/types/index";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  cardVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations";

interface PageData {
  notFound?: boolean;
  content?: string;
  frontmatter: {
    enable?: boolean;
    title: string;
    subtitle?: string;
    badge: string;
    offer_yearly?: string;
    pricing_plans: Array<PricingType>;
  };
}

const Pricing = ({
  data,
  isHome = true,
}: {
  data: PageData;
  isHome?: boolean;
}) => {
  const { title, enable, badge, pricing_plans, offer_yearly } =
    data.frontmatter;
  const [isYearly, setIsYearly] = useState(false);
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLSpanElement | null>(null);

  // measure and position the slider to match active tab
  useEffect(() => {
    const container = toggleRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    const updateSlider = () => {
      const active = container.querySelector(
        '[role="tab"][aria-selected="true"]',
      ) as HTMLElement | null;
      if (!active) return;
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const left = activeRect.left - containerRect.left;
      const width = activeRect.width;
      slider.style.width = `${Math.round(width)}px`;
      slider.style.transform = `translateX(${Math.round(left)}px)`;
    };

    // initial position
    requestAnimationFrame(updateSlider);

    // update on resize
    window.addEventListener("resize", updateSlider);

    // observe small DOM changes that can affect sizing
    const observer = new MutationObserver(() =>
      requestAnimationFrame(updateSlider),
    );
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener("resize", updateSlider);
      observer.disconnect();
    };
  }, [isYearly]);

  useEffect(() => {
    const monthlyElements = document.querySelectorAll(
      "[data-price-tag-monthly]",
    );
    const yearlyElements = document.querySelectorAll("[data-price-tag-yearly]");

    if (isYearly) {
      // Remove active from monthly, add to yearly
      monthlyElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.remove("active");
          el.classList.add("inactive");
        }, index * 150);
      });
      yearlyElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("active");
          el.classList.remove("inactive");
        }, index * 150);
      });
    } else {
      // Add active to monthly, remove from yearly
      monthlyElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("active");
          el.classList.remove("inactive");
        }, index * 150);
      });
      yearlyElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.remove("active");
          el.classList.add("inactive");
        }, index * 150);
      });
    }
  }, [isYearly]);

  return (
    enable && (
      <section className="text-left">
        {isHome ? (
          <div className="main-container"><div className="container">
            <div className="container-padding-y container-padding-x">
              <div className="text-center mb-14">{badge && <div className="bg-gradient-primary p-px inline-block rounded-full mb-2"><div className="bg-gradient-black-grid px-4 py-1.5 rounded-full"><span className="gradient-text-primary">{badge}</span></div></div>}<h2 className="text-h2 font-medium lg:w-2/5 mx-auto">{title}</h2></div>

              <div className="flex flex-col gap-y-14">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "0px", amount: 0.05 }}
                  variants={fadeInUpVariants}
                  ref={toggleRef}
                  className="relative bg-lighter border border-border/30 px-1.5 py-1.25 rounded-full inline-flex w-max mx-auto gap-2"
                  role="tablist"
                  aria-label="Pricing toggle"
                >
                  {/* sliding background (positioned/sized by JS to match active tab) */}
                  <span
                    ref={sliderRef}
                    aria-hidden
                    style={{ width: 0, transform: "translateX(0px)" }}
                    className={`absolute top-1/2 -translate-y-1/2 left-0 h-[84%] rounded-full bg-gradient-button transition-all duration-300 pointer-events-none`}
                  />

                  <motion.button
                    role="tab"
                    aria-selected={!isYearly}
                    className={`px-6 py-2.5 rounded-full relative z-10 cursor-pointer text-text `}
                    onClick={() => setIsYearly(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Monthly
                  </motion.button>
                  <motion.button
                    role="tab"
                    aria-selected={isYearly}
                    className={`px-6 py-2 rounded-full relative z-10 cursor-pointer text-light`}
                    onClick={() => setIsYearly(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Yearly{" "}
                    <span
                      className={`${!isYearly ? "gradient-text-primary" : ""}`}
                    >
                      ({offer_yearly})
                    </span>
                  </motion.button>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "0px", amount: 0.05 }}
                  variants={staggerContainerVariants}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {pricing_plans.map((plan, index) => (
                    <motion.div key={index} variants={staggerItemVariants}>
                      <motion.div
                        initial="initial"
                        whileInView="visible"
                        viewport={{ once: true, margin: "0px", amount: 0.05 }}
                        whileHover="hover"
                        variants={cardVariants}
                        className="bg-card/70 border border-border/6 rounded-3xl p-2.5"
                      >
                        <div className="bg-card border border-border/6 rounded-3xl p-7.5">
                          <div className="size-14 bg-gradient-dark border border-border/6 rounded-2xl flex justify-center items-center relative overflow-hidden mb-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16.875 4.5H16.875C17.5712 4.5 18.2389 4.77656 18.7312 5.26884C19.2234 5.76113 19.5 6.4288 19.5 7.12499V7.125C19.5 7.82119 19.2234 8.48887 18.7312 8.98116C18.2389 9.47344 17.5712 9.75 16.875 9.75H14.25V7.125C14.25 6.42881 14.5266 5.76113 15.0188 5.26884C15.5111 4.77656 16.1788 4.5 16.875 4.5V4.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M9.75 9.75H7.125C6.42881 9.75 5.76113 9.47344 5.26884 8.98116C4.77656 8.48887 4.5 7.82119 4.5 7.125V7.12499C4.5 6.4288 4.77656 5.76112 5.26884 5.26884C5.76112 4.77656 6.4288 4.5 7.12499 4.5H7.125C7.82119 4.5 8.48887 4.77656 8.98116 5.26884C9.47344 5.76113 9.75 6.42881 9.75 7.125V9.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M14.25 14.25H16.875C17.5712 14.25 18.2389 14.5266 18.7312 15.0188C19.2234 15.5111 19.5 16.1788 19.5 16.875V16.875C19.5 17.5712 19.2234 18.2389 18.7312 18.7312C18.2389 19.2234 17.5712 19.5 16.875 19.5H16.875C16.1788 19.5 15.5111 19.2234 15.0188 18.7312C14.5266 18.2389 14.25 17.5712 14.25 16.875V14.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M7.125 19.5H7.12499C6.4288 19.5 5.76112 19.2234 5.26884 18.7312C4.77656 18.2389 4.5 17.5712 4.5 16.875V16.875C4.5 16.1788 4.77656 15.5111 5.26884 15.0188C5.76113 14.5266 6.42881 14.25 7.125 14.25H9.75V16.875C9.75 17.5712 9.47344 18.2389 8.98116 18.7312C8.48887 19.2234 7.82119 19.5 7.125 19.5V19.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M14.25 9.75H9.75V14.25H14.25V9.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <svg className="absolute bottom-0 left-1/2 -translate-x-1/2" width="56" height="38" viewBox="0 0 56 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g opacity="0.3" filter="url(#filter0_f_40_2892)"><circle cx="28" cy="40" r="20" fill="url(#paint0_linear_40_2892)" /></g>
                              <defs>
                                <filter id="filter0_f_40_2892" x="-12" y="0" width="80" height="80" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_40_2892" /></filter>
                                <linearGradient id="paint0_linear_40_2892" x1="8" y1="40" x2="48" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#9A4DFE" /><stop offset="1" stopColor="#E87CFF" /></linearGradient>
                              </defs>
                            </svg>
                          </div>
                          <h3 className="text-h5 font-medium mb-2.5">{plan.name}</h3>
                          <p className="text-gray mb-3">{plan.content}</p>
                          <div className="flex items-baseline relative">
                            <h3 className="text-h2 price-tag active font-normal text-text" data-price-tag-monthly>
                              <span className="text-text-light">{plan.price?.monthly?.prefix}</span>
                              {plan.price?.monthly?.number}
                              <span className="text-base text-text-light">{plan.price?.monthly?.suffix}</span>
                            </h3>
                            <h3 className="text-h2 price-tag inactive font-normal text-text" data-price-tag-yearly style={{ opacity: 0 }}>
                              <span className="text-text-light">{plan.price?.yearly?.prefix}</span>
                              {plan.price?.yearly?.number}
                              <span className="text-base text-text-light">{plan.price?.yearly?.suffix}</span>
                            </h3>
                          </div>
                        </div>
                        <div className="p-7.5">
                          <ul className="flex flex-col gap-y-3 list-disc list-inside">
                            {plan.features?.map((feature, index) => (
                              <li key={index} className={`${feature.include ? "text-text" : "text-text-light"}`}>
                                {feature.value}
                              </li>
                            ))}
                          </ul>
                          {plan.button?.enable && (
                            <a href={plan.button.link} className={`btn ${plan.highlighted ? "btn-primary" : "bg-gradient-dark"} w-full mt-7.5 text-center font-medium py-3.5 text-text border border-border/6`}>
                              {plan.button.label}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div></div>
        ) : (
          <div className="flex flex-col gap-y-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px", amount: 0.05 }}
              variants={fadeInUpVariants}
              ref={toggleRef}
              className="relative bg-lighter border border-border/30 px-1.5 py-1.25 rounded-full inline-flex w-max mx-auto gap-2 mt-8"
              role="tablist"
              aria-label="Pricing toggle"
            >
              {/* sliding background (positioned/sized by JS to match active tab) */}
              <span
                ref={sliderRef}
                aria-hidden
                style={{ width: 0, transform: "translateX(0px)" }}
                className={`absolute top-1/2 -translate-y-1/2 left-0 h-[84%] rounded-full bg-gradient-button transition-all duration-300 pointer-events-none`}
              />

              <motion.button
                role="tab"
                aria-selected={!isYearly}
                className={`px-6 py-2.5 rounded-full relative z-10 cursor-pointer text-text `}
                onClick={() => setIsYearly(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Monthly
              </motion.button>
              <motion.button
                role="tab"
                aria-selected={isYearly}
                className={`px-6 py-2 rounded-full relative z-10 cursor-pointer text-light`}
                onClick={() => setIsYearly(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Yearly{" "}
                <span className={`${!isYearly ? "gradient-text-primary" : ""}`}>
                  ({offer_yearly})
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px", amount: 0.05 }}
              variants={staggerContainerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {pricing_plans.map((plan, index) => (
                <motion.div key={index} variants={staggerItemVariants}>
                  <motion.div
                    initial="initial"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px", amount: 0.05 }}
                    whileHover="hover"
                    variants={cardVariants}
                    className="bg-card/70 border border-border/6 rounded-3xl p-2.5"
                  >
                    <div className="bg-card border border-border/6 rounded-3xl p-7.5">
                      <div className="size-14 bg-gradient-dark border border-border/6 rounded-2xl flex justify-center items-center relative overflow-hidden mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.875 4.5H16.875C17.5712 4.5 18.2389 4.77656 18.7312 5.26884C19.2234 5.76113 19.5 6.4288 19.5 7.12499V7.125C19.5 7.82119 19.2234 8.48887 18.7312 8.98116C18.2389 9.47344 17.5712 9.75 16.875 9.75H14.25V7.125C14.25 6.42881 14.5266 5.76113 15.0188 5.26884C15.5111 4.77656 16.1788 4.5 16.875 4.5V4.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75 9.75H7.125C6.42881 9.75 5.76113 9.47344 5.26884 8.98116C4.77656 8.48887 4.5 7.82119 4.5 7.125V7.12499C4.5 6.4288 4.77656 5.76112 5.26884 5.26884C5.76112 4.77656 6.4288 4.5 7.12499 4.5H7.125C7.82119 4.5 8.48887 4.77656 8.98116 5.26884C9.47344 5.76113 9.75 6.42881 9.75 7.125V9.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.25 14.25H16.875C17.5712 14.25 18.2389 14.5266 18.7312 15.0188C19.2234 15.5111 19.5 16.1788 19.5 16.875V16.875C19.5 17.5712 19.2234 18.2389 18.7312 18.7312C18.2389 19.2234 17.5712 19.5 16.875 19.5H16.875C16.1788 19.5 15.5111 19.2234 15.0188 18.7312C14.5266 18.2389 14.25 17.5712 14.25 16.875V14.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7.125 19.5H7.12499C6.4288 19.5 5.76112 19.2234 5.26884 18.7312C4.77656 18.2389 4.5 17.5712 4.5 16.875V16.875C4.5 16.1788 4.77656 15.5111 5.26884 15.0188C5.76113 14.5266 6.42881 14.25 7.125 14.25H9.75V16.875C9.75 17.5712 9.47344 18.2389 8.98116 18.7312C8.48887 19.2234 7.82119 19.5 7.125 19.5V19.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.25 9.75H9.75V14.25H14.25V9.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg className="absolute bottom-0 left-1/2 -translate-x-1/2" width="56" height="38" viewBox="0 0 56 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g opacity="0.3" filter="url(#filter0_f_40_2892)"><circle cx="28" cy="40" r="20" fill="url(#paint0_linear_40_2892)" /></g>
                          <defs>
                            <filter id="filter0_f_40_2892" x="-12" y="0" width="80" height="80" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_40_2892" /></filter>
                            <linearGradient id="paint0_linear_40_2892" x1="8" y1="40" x2="48" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#9A4DFE" /><stop offset="1" stopColor="#E87CFF" /></linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <h3 className="text-h5 font-medium mb-2.5">{plan.name}</h3>
                      <p className="text-gray mb-3">{plan.content}</p>
                      <div className="flex items-baseline relative">
                        <h3 className="text-h2 price-tag active font-normal text-text" data-price-tag-monthly>
                          <span className="text-text-light">{plan.price?.monthly?.prefix}</span>
                          {plan.price?.monthly?.number}
                          <span className="text-base text-text-light">{plan.price?.monthly?.suffix}</span>
                        </h3>
                        <h3 className="text-h2 price-tag inactive font-normal text-text" data-price-tag-yearly style={{ opacity: 0 }}>
                          <span className="text-text-light">{plan.price?.yearly?.prefix}</span>
                          {plan.price?.yearly?.number}
                          <span className="text-base text-text-light">{plan.price?.yearly?.suffix}</span>
                        </h3>
                      </div>
                    </div>
                    <div className="p-7.5">
                      <ul className="flex flex-col gap-y-3 list-disc list-inside">
                        {plan.features?.map((feature, index) => (
                          <li key={index} className={`${feature.include ? "text-text" : "text-text-light"}`}>
                            {feature.value}
                          </li>
                        ))}
                      </ul>
                      {plan.button?.enable && (
                        <a href={plan.button.link} className={`btn ${plan.highlighted ? "btn-primary" : "bg-gradient-dark"} w-full mt-7.5 text-center font-medium py-3.5 text-text border border-border/6`}>
                          {plan.button.label}
                        </a>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </section>
    )
  );
};

export default Pricing;
