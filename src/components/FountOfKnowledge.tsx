import { memo, useEffect, useState } from "react";
import { formatNumber } from "../utils/utils";
import type { NuggetParticleProps } from "./NuggetParticle";
import NuggetParticle from "./NuggetParticle";

interface FountOfKnowledgeProps {
  displayNuggets: number;
  nuggetsPerSecond: number;
  nuggetParticles: NuggetParticleProps[];
}

function FountOfKnowledge(props: FountOfKnowledgeProps) {
  const { displayNuggets, nuggetsPerSecond, nuggetParticles } = props;
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setAnimationFrame] = useState(0);
  const [fountImg, setFountImg] = useState<HTMLImageElement | null>(null);

  const fountWidth = fountImg?.clientWidth;

  const animate = (animationFrame: number) => {
    setAnimationFrame(animationFrame);
    requestAnimationFrame(animate);
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
    <div
      className="grow flex flex-col justify-end"
      style={{ contain: "paint" }}
    >
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
      <div>
        {fountWidth &&
          nuggetParticles.map((nuggetParticleProps) => (
            <NuggetParticle
              {...nuggetParticleProps}
              xDistance={nuggetParticleProps.xDistance * fountWidth}
              yDistance={nuggetParticleProps.yDistance * fountWidth}
              width={nuggetParticleProps.width * fountWidth}
              key={nuggetParticleProps.id}
            ></NuggetParticle>
          ))}
        <div className="relative">
          <img
            className="relative w-3/4 m-auto"
            ref={setFountImg}
            src="fount-of-knowledge.svg"
          ></img>
          {fountWidth && (
            <div
              className="-z-1 opacity-40 bg-radial rounded-full from-0% to-40% from-text-light absolute -translate-y-1/2"
              style={{
                width: "100%",
                height: fountWidth / 3,
                top: "100%",
                left: 0,
              }}
            />
          )}
        </div>
        <div className="z-1 font-classical font-bold tracking-widest px-2 mt-4 text-sm w-fit rounded-md bg-light border-standard m-auto">
          <span className="text-text-light">•</span> Fount of Knowledge{" "}
          <span className="text-text-light">•</span>
        </div>
      </div>
    </div>
  );
}

export default memo(FountOfKnowledge);
