import { NUGGET_PARTICLE_DURATION_MS } from "../utils/constants";

export interface NuggetParticleProps {
  id: string;
  timestamp: number;
  xDistance: number;
  yDistance: number;
  width: number;
}

export default function NuggetParticle(props: NuggetParticleProps) {
  const { timestamp, xDistance, yDistance, width } = props;

  const now = Date.now();
  const percentage = (now - timestamp) / NUGGET_PARTICLE_DURATION_MS;

  const x = xDistance * percentage - width / 2;
  const y = -4 * yDistance * percentage * (percentage - 1);
  const opacity = 1.5 - percentage;

  return (
    <img
      src="nugget.svg"
      className="absolute left-1/2 -z-10"
      style={{
        translate: `${x}px ${y}px`,
        width: `${width}px`,
        opacity: opacity,
      }}
    ></img>
  );
}
