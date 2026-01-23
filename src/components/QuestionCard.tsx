import { useState } from "react";
import type { Deck } from "../types/deck";
import { type Card } from "../types/memory";
import { KNOWLEDGE_STREAK } from "../utils/constants";

const getCardLabel = (card: Card) => {
  if (!card.seen) {
    return "new";
  }
  if (card.known) {
    return "review";
  }

  return `${Math.min(card.streak ?? 0, KNOWLEDGE_STREAK)}/${KNOWLEDGE_STREAK}`;
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
    <div className="relative p-4 rounded-2xl bg-light-light border-standard text-center md:min-w-80">
      <div className="absolute -ml-4 text-sm left-full -translate-x-full font-normal">
        <span className="rounded-sm border-standard px-2">
          {getCardLabel(card)}
        </span>
      </div>
      <div className="text-text-light">Name the {deck.answerLabel}:</div>
      <div className="font-bold text-2xl leading-[1em] mt-1">
        {card.fact.question}
      </div>
      <div className="font-bold mb-4 leading-tight">
        ({card.fact.questionSubtitle ?? deck.questionLabel})
      </div>
      {/* {card.fact.questionImage && (
        <img
          key={card.fact.id}
          src={card.fact.questionImage}
          className="block max-w-1/2 mb-4 m-auto"
        />
      )} */}

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
          className="bg-white p-1 border-standard px-2"
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
      {hadTypo && (
        <div className="text-text-light text-sm mt-2">
          Close! Check your spelling...
        </div>
      )}
    </div>
  );
}
