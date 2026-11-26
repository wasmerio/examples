import React, { useEffect, useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { siteConfig } from '@/site.config';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'autorelaxed' | 'vertical' | 'rectangle' | 'horizontal';
  layoutKey?: string;
  layout?: string;
  className?: string;
  style?: React.CSSProperties;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const AdUnit: React.FC<AdUnitProps> = ({
  slot,
  format = 'auto',
  layoutKey,
  layout,
  className,
  style = { display: 'block' },
  fullWidthResponsive,
}) => {
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const pushAd = (retries = 0) => {
      if (pushedRef.current || retries > 3) return;

      const container = containerRef.current;
      if (!container) return;

      // Strict visibility check
      const rect = container.getBoundingClientRect();
      const style = window.getComputedStyle(container);
      if (rect.width === 0 || rect.height === 0 || style.display === 'none' || style.visibility === 'hidden') {
         // Container not visible yet, retry later without incrementing retries heavily
         setTimeout(() => pushAd(retries), 500);
         return;
      }

      try {
        // Double check window.adsbygoogle existence safely
        const w = window as any;
        if (w.adsbygoogle) {
          w.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch (err: any) {
        setHasError(true);
        
        // Don't retry if it's a slot size error (structural issue)
        if (err?.message?.includes('No slot size')) {
           // Component hidden or too small, skipping push (expected for responsive ads)
           return;
        }

        // Only log warning if not already pushed (to avoid spam)
        if (!pushedRef.current) {
          console.warn('AdSense push warning:', err);
          setTimeout(() => pushAd(retries + 1), 2000);
        }
      }
    };

    const checkAndPush = () => {
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        pushAd();
        return true;
      }
      return false;
    };

    // Delay ad push to ensure container is rendered with proper width
    const timer = setTimeout(() => {
      if (!checkAndPush()) {
        const retryTimer = setInterval(() => {
          if (checkAndPush()) {
            clearInterval(retryTimer);
          }
        }, 1000);
        return () => clearInterval(retryTimer);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot]);

  if (!siteConfig.adsense.enabled) return null;

  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={cn(
        "w-full max-w-full flex justify-center items-center relative overflow-hidden",
        "bg-secondary/50 rounded-xl",
        "transition-colors duration-200",
        className
      )}
    >
      {/* Placeholder text hidden via CSS when ad loads */}
      <div 
        className="absolute inset-0 flex items-center justify-center py-8 ad-placeholder-text"
      >
        <span className="text-muted-foreground/50 text-sm font-medium">
          {hasError ? "Ad unavailable" : "Advertisement"}
        </span>
      </div>
      <ins
        className="adsbygoogle w-full relative z-10"
        style={{ ...style, maxWidth: '100%' }}
        data-ad-client={siteConfig.adsense.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout-key={layoutKey}
        data-ad-layout={layout}
        data-full-width-responsive={fullWidthResponsive}
        suppressHydrationWarning={true}
      />
    </motion.div>
  );
};
