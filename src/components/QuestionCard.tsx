import { memo, useState } from "react";
import { getQuestionImageUrl, type Deck } from "../types/deck";
import { type Card } from "../types/card";
import CardLabel from "./CardLabel";

interface QuestionCardProps {
  deck: Deck;
  card: Card;
  submitGuess: (guess: string) => boolean;
  wasCorrect: boolean;
  answerStatus: AnswerStatus;
}

const ANSWER_STATUS_MESSAGES = {
  typo: "Close! Check your spelling...",
  close: "Good guess! Try again...",
} as const;

export type AnswerStatus = keyof typeof ANSWER_STATUS_MESSAGES | null;

function QuestionCard(props: QuestionCardProps) {
  const { deck, card, submitGuess, answerStatus, wasCorrect } = props;
  const [guess, setGuess] = useState("");

  const noGuess = guess === "";
  const shouldShowIDontKnow = noGuess && wasCorrect;
  const fact = deck.facts[card.factId];

  return (
    <div className="relative">
      <div className="relative p-4 rounded-2xl bg-light-light border-standard text-center md:min-w-80 contain-paint">
        {!fact.questionImage && (
          <div className="text-text-light mb-1">
            Name the {deck.answerLabel}:
          </div>
        )}
        {fact.question && (
          <>
            <div className="font-bold text-2xl leading-[1em]">
              {fact.question}
            </div>
            <div className="font-bold mb-5 leading-tight">
              ({fact.questionSubtitle ?? deck.questionLabel})
            </div>
          </>
        )}
        {fact.questionImage && (
          <img
            src={getQuestionImageUrl(fact, deck)}
            className="block w-full max-h-40 min-h-0 object-contain mb-4 m-auto will-change-contents"
          />
        )}

        <form
          className="relative w-fit mx-auto flex flex-row flex-wrap items-center justify-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (submitGuess(guess)) {
              setGuess("");
            }
          }}
        >
          <input
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            className="bg-white p-1 border-standard px-2 w-50 xs:w-60"
            placeholder={`Type the ${deck.answerLabel}`}
          />
          <button
            type="submit"
            className={`px-0! w-30 ${
              shouldShowIDontKnow ? "button-boring" : "button-standard"
            }`}
            disabled={!wasCorrect && !guess}
          >
            {shouldShowIDontKnow ? "I don't know" : "Enter"}
          </button>
        </form>
        {answerStatus && (
          <div className="text-text-light text-sm mt-2">
            {ANSWER_STATUS_MESSAGES[answerStatus]}
          </div>
        )}
      </div>
      <CardLabel card={card} />
    </div>
  );
}

export default memo(QuestionCard);
