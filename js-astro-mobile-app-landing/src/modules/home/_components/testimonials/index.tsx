import { Swiper, SwiperSlide } from "swiper/react";

import AnimatedText from "../../../../components/animatedText";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ConfigContext } from "../../../../utils/configContext";
import { Autoplay } from "swiper/modules";

function Testimonials() {
  const {
    home: { testimonials },
  } = useContext(ConfigContext)!;
  if (!testimonials) return null;

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-12">
      <div className="mb-6 max-w-none flex flex-col items-center prose prose-lg text-center">
        <h1 className="mb-0">
          <AnimatedText text={testimonials.title} />
        </h1>
        <motion.p
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 0.7 }}
          viewport={{ once: true }}
          className="text-xl max-w-lg"
        >
          {testimonials.subtitle}
        </motion.p>
      </div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
      >
        <Swiper
          loop
          autoplay
          modules={[Autoplay]}
          spaceBetween={32}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          slidesPerView={1}
        >
          {testimonials.cards.map(({ name, comment }, index) => (
            <SwiperSlide className="!h-[22rem] my-2" key={index}>
              <div className="h-full card shadow bg-primary">
                <div className="p-6 card-body">
                  <div className="flex mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="h-6 w-6 mask mask-star-2 bg-primary-content"
                        />
                      ))}
                  </div>
                  <p className="text-primary-content/90">{comment}</p>
                  <h2 className="card-title text-primary-content">{name}</h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}

export default Testimonials;
