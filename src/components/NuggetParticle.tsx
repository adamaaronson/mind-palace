import { useEffect, useState } from "react";
import { NUGGET_PARTICLE_DURATION_MS } from "../utils/constants";

export interface NuggetParticleProps {
  timestamp: number;
  xDistance: number;
  yDistance: number;
  width: number;
}

export default function NuggetParticle(props: NuggetParticleProps) {
  const { timestamp, xDistance, yDistance, width } = props;
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setAnimationFrame] = useState(0);

  const now = Date.now();
  const percentage = (now - timestamp) / NUGGET_PARTICLE_DURATION_MS;

  const x = xDistance * percentage - width / 2;
  const y = -4 * yDistance * percentage * (percentage - 1);
  const opacity = 1.5 - percentage;

  const animate = (animationFrame: number) => {
    setAnimationFrame(animationFrame);
    setIsAnimating(false);

    const now = Date.now();

    if (now - timestamp < NUGGET_PARTICLE_DURATION_MS * 2) {
      requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    let animationFrameId;
    if (!isAnimating) {
      setIsAnimating(true);
      animationFrameId = requestAnimationFrame(animate);
    }
    if (animationFrameId) {
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
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
