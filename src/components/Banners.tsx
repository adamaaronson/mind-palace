import { memo } from "react";
import { CORRECT_MESSAGES, WRONG_MESSAGES } from "../utils/constants";
import { randomChoice } from "../utils/utils";
import Banner from "./Banner";
import { AnimatePresence, motion } from "motion/react";

interface BannersProps {
  nuggetsEarned: number;
  wasCorrect: boolean;
  earnedFount: boolean;
  lostFount: boolean;
  answerTimestamp: number;
}

function Banners(props: BannersProps) {
  const { nuggetsEarned, wasCorrect, earnedFount, lostFount, answerTimestamp } =
    props;
  const isVisible = nuggetsEarned !== 0 || earnedFount || lostFount;
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={answerTimestamp}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 5 }}
          className="absolute w-full top-full left-0 z-10"
        >
          <div className="flex gap-2 flex-col mt-2.5">
            {nuggetsEarned !== 0 && (
              <Banner boring>
                +{nuggetsEarned}{" "}
                <span className="text-text-light font-normal">
                  nugget{nuggetsEarned === 1 ? "" : "s"}!{" "}
                  {randomChoice(wasCorrect ? CORRECT_MESSAGES : WRONG_MESSAGES)}
                </span>
              </Banner>
            )}
            {earnedFount && (
              <Banner>
                +1{" "}
                <span className="font-normal text-gold-dark">
                  nugget per second! You know it!
                </span>
              </Banner>
            )}
            {lostFount && (
              <Banner bad>
                <span className="text-white">–1 </span>
                <span className=" text-white font-normal">
                  nugget per second! You forgot!
                </span>
              </Banner>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(Banners);
