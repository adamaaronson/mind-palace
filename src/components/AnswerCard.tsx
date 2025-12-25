import React from "react";
import type { Deck } from "../types/knowledge";
import LinkOrText from "./LinkOrText";
import type { Card } from "../types/memory";
import { FOUNT_MESSAGES, WRONG_MESSAGES } from "../utils/constants";
import { randomChoice } from "../utils/utils";

interface AnswerCardProps {
  deck: Deck;
  previousCard: Card;
  wasCorrect: boolean;
  nuggetsEarned: number;
  earnedFount: boolean;
  lostFount: boolean;
}

function AnswerCard(props: AnswerCardProps) {
  const {
    deck,
    previousCard,
    wasCorrect,
    nuggetsEarned,
    earnedFount,
    lostFount,
  } = props;

  return (
    <div className="relative p-4 mt-4 rounded-2xl bg-light-light text-center border-2 border-border">
      <div className="text-text-light text-xl">
        <div className="leading-tight pb-0.5">
          <img
            className="inline-block align-baseline mb-[-0.1em] mr-1 w-[1em]"
            src={wasCorrect ? "check.svg" : "x.svg"}
          ></img>{" "}
          The {deck.answerLabel} of{" "}
          <LinkOrText
            link={previousCard.questionLink}
            text={previousCard.question}
            wikipedia
          />{" "}
          is{" "}
          {previousCard.answers.map((answer, index) => (
            <React.Fragment key={index}>
              <LinkOrText
                link={answer.link}
                text={answer.canonicalForm}
                wikipedia
              />
              {index < previousCard.answers.length - 1 && <span> / </span>}
            </React.Fragment>
          ))}
        </div>
        {lostFount && (
          <div className="text-amber-950 font-bold">
            –1{" "}
            <span className="font-normal text-text-light">
              nugget per second
            </span>
          </div>
        )}
        <div className="text-sm">
          <p>
            <span className="text-amber-950 font-bold">+{nuggetsEarned}</span>{" "}
            <span className="text-text-light">
              nugget{nuggetsEarned === 1 ? "" : "s"}!
              {wasCorrect ? "" : " " + randomChoice(WRONG_MESSAGES)}
            </span>
          </p>
          {earnedFount && (
            <p>
              <span className="text-amber-950 font-bold">+1</span>{" "}
              <span className="text-text-light">
                nugget per second! {randomChoice(FOUNT_MESSAGES)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(AnswerCard);
