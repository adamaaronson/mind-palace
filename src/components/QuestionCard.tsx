import { useState } from "react";
import type { Deck } from "../types/knowledge";
import { isNew, type Card } from "../types/memory";
import { FOUNT_STREAK } from "../utils/constants";

const getCardLabel = (card: Card) => {
  if (isNew(card)) {
    return "new";
  }
  if (card.known) {
    return "review";
  }

  return `${Math.min(card.streak ?? 0, FOUNT_STREAK)}/${FOUNT_STREAK}`;
};

interface QuestionCardProps {
  deck: Deck;
  card: Card;
  submitGuess: (guess: string) => boolean;
  hadTypo: boolean;
  wasCorrect: boolean;
}

export default function QuestionCard(props: QuestionCardProps) {
  const { deck, card, submitGuess, hadTypo, wasCorrect } = props;
  const [guess, setGuess] = useState("");

  const noGuess = guess === "";
  const shouldShowIDontKnow = noGuess && wasCorrect;

  return (
    <div className="relative p-4 rounded-2xl bg-light-light border-standard text-center">
      <div className="block text-right mb-1 lg:mb-0 lg:absolute lg:-ml-4 text-sm left-full lg:-translate-x-full font-normal">
        <span className="rounded-sm border-standard px-2">
          {getCardLabel(card)}
        </span>
      </div>
      <div className="text-text-light">
        Name the{" "}
        <span className="font-bold text-text-dark">{deck.answerLabel}</span> of:
      </div>
      <div className="font-bold text-2xl leading-[1em] mt-1">
        {card.question}
      </div>
      <div className="font-bold mb-4 leading-tight">
        ({card.questionSubtitle ?? deck.questionLabel})
      </div>

      <form
        className="relative w-fit mx-auto flex flex-col flex-wrap items-center justify-center gap-2 md:flex-row"
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
          className="bg-white p-1 border-standard px-2"
          placeholder={`Type the ${deck.answerLabel}`}
        />
        <div className="flex flex-row gap-2">
          <button
            type="submit"
            className={`button-standard ${
              shouldShowIDontKnow ? "button-boring" : ""
            }`}
            disabled={!wasCorrect && !guess}
          >
            {shouldShowIDontKnow ? "I don't know" : "Enter"}
          </button>
        </div>
      </form>
      {hadTypo && (
        <div className="text-text-light text-sm mt-2">
          Close! Check your spelling...
        </div>
      )}
    </div>
  );
}
