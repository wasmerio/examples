import { useRef } from "react";
import { MotionConfig } from "motion/react";
import { KiteStyles } from "./ui";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { InvoiceDemo } from "./InvoiceDemo";
import { Currency } from "./Currency";
import { TaxPot } from "./TaxPot";
import { PhoneTour } from "./PhoneTour";
import { StickerWall } from "./StickerWall";
import { Pricing } from "./Pricing";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { KiteString } from "./KiteString";
import { OnepasteBanner } from "./OnepasteBanner";

export default function Kite() {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="kt-root relative min-h-screen overflow-x-clip">
        <KiteStyles />
        <Nav />
        <main>
          <Hero />
          <InvoiceDemo />
          <Currency />
          <TaxPot />
          <PhoneTour />
          <StickerWall />
          <Pricing />
          <Faq />
        </main>
        <Footer />
        <KiteString rootRef={rootRef} />
        <OnepasteBanner />
      </div>
    </MotionConfig>
  );
}
