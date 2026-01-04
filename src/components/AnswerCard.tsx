import React from "react";
import type { Deck } from "../types/knowledge";
import Link from "./Link";
import type { Card } from "../types/memory";

interface AnswerCardProps {
  deck: Deck;
  previousCard: Card;
  wasCorrect: boolean;
}

function AnswerCard(props: AnswerCardProps) {
  const { deck, previousCard, wasCorrect } = props;

  const previousFact = previousCard.fact;

  return (
    <div>
      <div className="relative p-4 rounded-2xl bg-light-light text-center border-standard">
        <div className="text-text-light text-xl">
          <div className="leading-tight pb-0.5">
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
      </div>
    </div>
  );
}

export default React.memo(AnswerCard);
