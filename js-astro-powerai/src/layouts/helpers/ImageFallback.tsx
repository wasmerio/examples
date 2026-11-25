import { useEffect, useState } from "react";

const ImageFallback = (props: any) => {
  const { src, fallback, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      {...rest}
      src={imgSrc}
      onError={() => {
        if (fallback) setImgSrc(fallback);
      }}
    />
  );
};

export default ImageFallback;
