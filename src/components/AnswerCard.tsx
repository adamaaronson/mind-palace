import React from "react";
import type { Deck } from "../types/knowledge";
import Link from "./Link";
import type { Card } from "../types/memory";

interface AnswerCardProps {
  deck: Deck;
  previousCard: Card;
  wasCorrect: boolean;
  earnedFount: boolean;
  lostFount: boolean;
}

function AnswerCard(props: AnswerCardProps) {
  const { deck, previousCard, wasCorrect, earnedFount, lostFount } = props;

  const previousFact = previousCard.fact;

  return (
    <div>
      <div className="relative p-4 rounded-2xl bg-light-light text-center border-standard">
        <div className="text-text-light text-lg">
          <div className="leading-tight">
            <img
              className="inline-block align-baseline mb-[-0.1em] mr-1 w-[1em]"
              src={wasCorrect ? "check.svg" : "x.svg"}
            ></img>{" "}
            The {deck.answerLabel} of{" "}
            <Link href={previousFact.questionLink} wikipedia>
              {previousFact.question}
            </Link>{" "}
            is{" "}
            {previousFact.answers.map((answer, index) => (
              <React.Fragment key={index}>
                <Link href={answer.link} wikipedia>
                  {answer.canonicalForm}
                </Link>
                {index < previousFact.answers.length - 1 && <span> / </span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="text-sm mt-0.5">
          {earnedFount && (
            <p>
              <span className="text-amber-950 font-bold">+1</span>{" "}
              <span className="text-text-light">
                nugget per second! You know it!
              </span>
            </p>
          )}
          {lostFount && (
            <p>
              <span className="text-amber-950 font-bold">–1</span>{" "}
              <span className="text-text-light">
                nugget per second! You forgot!
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(AnswerCard);
