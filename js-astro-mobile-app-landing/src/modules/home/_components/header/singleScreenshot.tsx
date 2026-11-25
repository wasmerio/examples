import { motion, transform, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface Props {
  index: number;
  totalCount: number;
  scrollYProgress: MotionValue<number>;
  src: string;
}

function SingleScreenshot({ scrollYProgress, index, totalCount, src }: Props) {
  const x = useTransform(scrollYProgress, (y) => {
    if (index > 0 && index % 2 === 0) {
      const i = totalCount - index;
      const transformer = transform(
        [(i - 1) / totalCount, i / totalCount],
        [0, 1]
      );
      return -transformer(y) * 100 + "%";
    }
    return 0;
  });
  const y = useTransform(scrollYProgress, (y) => {
    if (index % 2 === 1) {
      const i = totalCount - index;
      const transformer = transform(
        [(i - 1) / totalCount, i / totalCount],
        [0, 1]
      );
      return -transformer(y) * 100 + "%";
    }
    return 0;
  });
  return (
    <motion.img
      src={src}
      alt={`screenshot ${index}`}
      style={{ translateX: x, translateY: y, scale: 1 }}
      className="absolute overflow-hidden w-full h-full"
    />
  );
}

export default SingleScreenshot;
