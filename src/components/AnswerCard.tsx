import React, { memo } from "react";
import { getQuestionImageUrl, type Deck } from "../types/deck";
import Link from "./Link";
import type { Card } from "../types/card";
import CardLabel from "./CardLabel";

interface AnswerCardProps {
  deck: Deck;
  previousCard: Card;
  wasCorrect: boolean;
  earnedFount: boolean;
  lostFount: boolean;
}

function AnswerCard(props: AnswerCardProps) {
  const { deck, previousCard, wasCorrect, earnedFount, lostFount } = props;

  const previousFact = deck.facts[previousCard.factId];

  return (
    <div className="relative">
      <div className="relative p-4 rounded-2xl bg-light-light text-center border-standard overflow-hidden">
        <div className="text-text-light text-lg">
          <div className="leading-tight">
            <img
              className="inline-block align-baseline mb-[-0.1em] mr-1 w-[1em]"
              src={wasCorrect ? "check.svg" : "x.svg"}
            ></img>{" "}
            {(previousFact.answerTemplate ?? deck.answerTemplate)
              .split(" ")
              .map((token, index) => {
                switch (token) {
                  case "<question>":
                    return (
                      <Link
                        key={index}
                        href={previousFact.questionLink}
                        isItalic={previousFact.questionIsItalic}
                        isWikipedia
                      >
                        {previousFact.question ?? ""}
                      </Link>
                    );
                  case "<answer>":
                    return previousFact.answers.map((answer, answerIndex) => (
                      <React.Fragment key={`${index},${answerIndex}`}>
                        <Link
                          href={answer.link}
                          isItalic={answer.isItalic}
                          isWikipedia
                        >
                          {answer.canonicalForm}
                        </Link>
                        {answerIndex < previousFact.answers.length - 1 && (
                          <span> / </span>
                        )}
                      </React.Fragment>
                    ));
                  case "<questionImage>":
                    return (
                      <img
                        className="h-[1em] inline px-0.5 align-top mt-px"
                        src={getQuestionImageUrl(previousFact, deck)}
                      ></img>
                    );
                  default:
                    return <React.Fragment key={index}>{token}</React.Fragment>;
                }
              })
              .map((token, index) => (
                <React.Fragment key={index}>{token} </React.Fragment>
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
      <CardLabel card={previousCard} wasCorrect={wasCorrect} />
    </div>
  );
}

export default memo(AnswerCard);
