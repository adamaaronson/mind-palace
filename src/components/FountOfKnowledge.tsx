import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../utils/utils";
import type { NuggetParticleProps } from "./NuggetParticle";
import NuggetParticle from "./NuggetParticle";
import { REFRESH_TIME } from "../utils/constants";

interface FountOfKnowledgeProps {
  displayNuggets: number;
  nuggetsPerSecond: number;
}

export default function FountOfKnowledge(props: FountOfKnowledgeProps) {
  const { displayNuggets, nuggetsPerSecond } = props;

  const [nuggetParticleTimestamp, setNuggetParticleTimestamp] = useState(0);
  const [previousNuggetCount, setPreviousNuggetCount] = useState(0);
  const [nuggetParticles, setNuggetParticles] = useState<NuggetParticleProps[]>(
    []
  );

  const fountRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const nuggetsEarned = displayNuggets - previousNuggetCount;
    if (nuggetsEarned <= 0) {
      setPreviousNuggetCount(displayNuggets);
      return;
    }
    if (displayNuggets === 0) {
      return;
    }
    const now = Date.now();
    if (now - nuggetParticleTimestamp < REFRESH_TIME) {
      // don't make nugget particles too quickly
      return;
    }
    const DEFAULT_FOUNT_WIDTH = 423;
    const fountSize = fountRef?.current?.clientWidth ?? DEFAULT_FOUNT_WIDTH;

    for (let i = 0; i < nuggetsEarned; i++) {
      const nuggetTimestamp = now + i / nuggetsEarned;
      const xDistance = (0.5 - Math.random()) * fountSize;
      const yDistance = (-Math.random() * fountSize) / 2;
      const width =
        (Math.random() * 30 + 10) * (fountSize / DEFAULT_FOUNT_WIDTH);

      const nuggetParticleProps = {
        timestamp: nuggetTimestamp,
        xDistance: xDistance,
        yDistance: yDistance,
        width: width,
      };

      setNuggetParticles((nuggetParticles) => [
        ...nuggetParticles.filter(({ timestamp }) => now - timestamp < 2000),
        nuggetParticleProps,
      ]);
      setNuggetParticleTimestamp(nuggetTimestamp);
      setPreviousNuggetCount(displayNuggets);
    }
  }, [displayNuggets]);

  return (
    <div className="grow flex flex-col justify-end">
      <div className="mb-4 text-center mt-8 md:mt-4 text-shadow-background text-shadow-[0px_0px_10px_#efd795]">
        <div className="font-bold text-4xl">
          {formatNumber(displayNuggets)}{" "}
          <span className="text-text-light font-normal">
            {" "}
            nugget{displayNuggets === 1 ? "" : "s"}
          </span>
        </div>
        <div className="font-bold">
          {formatNumber(nuggetsPerSecond)}{" "}
          <span className="text-text-light font-normal"> per second</span>
        </div>
      </div>
      <div className="justify-self-end">
        {nuggetParticles.map((nuggetParticleProps) => (
          <NuggetParticle
            {...nuggetParticleProps}
            key={nuggetParticleProps.timestamp}
          ></NuggetParticle>
        ))}
        <div>
          <img
            className="relative w-3/4 m-auto"
            ref={fountRef}
            src="fount-of-knowledge.svg"
          ></img>
        </div>
        <div className="font-classical font-bold tracking-widest px-2 mt-4 text-sm w-fit rounded-md bg-light border-2 border-border m-auto">
          <span className="text-text-light">•</span> Fount of Knowledge{" "}
          <span className="text-text-light">•</span>
        </div>
      </div>
    </div>
  );
}
