interface Props {
  src: string;
}

function IphoneFrame({ src }: Props) {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute top-2 bottom-2 left-2.5">
        <img
          src={src}
          alt="screenshot"
          className="rounded-2xl h-full"
        />
      </div>
      <img
        src="/misc/iphone-frame.webp"
        alt="iphone-frame"
        className="relative z-10 h-full"
      />
    </div>
  );
}

export default IphoneFrame;
