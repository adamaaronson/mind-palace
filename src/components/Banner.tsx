interface BannerProps {
  children: React.ReactNode;
  boring?: boolean;
  bad?: boolean;
}

export default function Banner(props: BannerProps) {
  const { children, boring = false, bad = false } = props;
  return (
    <div className="font-bold p-1 text-sm text-center relative px-5">
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        className="absolute left-0 top-0 w-full h-full z-1 overflow-visible"
      >
        <polygon
          className={`stroke-2 ${
            boring ? "fill-light" : bad ? "fill-red" : "fill-gold-light"
          }`}
          points="0,0 100,0 96,30 100,60 0,60 4,30"
        />
        <polygon className="fill-[#ffffff33]" points="0,0 100,0 96,30 4,30" />
        <polygon
          className={`stroke-2 fill-none ${
            boring ? "stroke-taupe" : bad ? "stroke-red" : "stroke-gold"
          }`}
          points="0,0 100,0 96,30 100,60 0,60 4,30"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="z-1 relative">{children}</div>
    </div>
  );
}
