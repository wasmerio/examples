
import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { fadeInUpVariants } from "@/lib/animations";

export interface CounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  startDelay?: number;
}

const Counter: React.FC<CounterProps> = ({
  target,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "counter",
  startDelay = 0,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    let observer: IntersectionObserver | null = null;

    const animateCount = (
      element: HTMLElement,
      start: number,
      end: number,
      duration: number,
      prefix: string,
      suffix: string,
    ) => {
      prefix = prefix || "";
      suffix = suffix || "";
      startTime = null;

      function step(timestamp: number) {
        if (!startTime) {
          startTime = timestamp;
        }
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = prefix + value + suffix;
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        }
      }
      frame = requestAnimationFrame(step);
    };

    const startAnimation = () => {
      if (spanRef.current) {
        setTimeout(() => {
          animateCount(spanRef.current!, 0, target, duration, prefix, suffix);
        }, startDelay);
      }
    };

    if (spanRef.current) {
      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimation();
              observer?.disconnect();
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      );
      observer.observe(spanRef.current);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [target, duration, prefix, suffix, startDelay]);

  return (
    <motion.span
      ref={spanRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px", amount: 0.05 }}
      variants={fadeInUpVariants}
      className={className}
      data-target={target}
      data-duration={duration}
      data-prefix={prefix}
      data-suffix={suffix}
      data-delay={startDelay}
    >
      {prefix}0{suffix}
    </motion.span>
  );
};

export default Counter;
