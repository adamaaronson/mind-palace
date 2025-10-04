import { useEffect, useState } from "react";

export interface NuggetParticleProps {
  timestamp: number;
  xDistance: number;
  yDistance: number;
  width: number;
}

const DURATION = 1000;

export default function NuggetParticle(props: NuggetParticleProps) {
  const { timestamp, xDistance, yDistance, width } = props;
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setAnimationFrame] = useState(0);

  const now = Date.now();
  const percentage = (now - timestamp) / DURATION;

  const x = xDistance * percentage - width / 2;
  const y = -4 * yDistance * percentage * (percentage - 1);
  const opacity = 1.5 - percentage;

  const animate = (animationFrame: number) => {
    setAnimationFrame(animationFrame);
    setIsAnimating(false);

    const now = Date.now();

    if (now - timestamp < DURATION * 2) {
      requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      requestAnimationFrame(animate);
    }
  }, []);

  return (
    <img
      src="nugget.svg"
      className="absolute left-1/2 -z-10"
      style={{
        translate: `${x}px ${y}px`,
        width: `${width}px`,
        opacity: opacity,
      }}
      key={timestamp}
    ></img>
  );
}
