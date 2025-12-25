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
  submitGuess: (guess: string) => void;
}

export default function QuestionCard(props: QuestionCardProps) {
  const { deck, card, submitGuess } = props;
  const [guess, setGuess] = useState("");

  return (
    <div className="relative p-4 rounded-2xl bg-light-light text-center border-2 border-border">
      <div className="absolute -ml-4 text-sm left-full -translate-x-full font-normal rounded-sm border-2 border-border px-2">
        {getCardLabel(card)}
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
        className="relative w-fit mx-auto flex flex-col items-center gap-2 md:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          submitGuess(guess);
          setGuess("");
        }}
      >
        <input
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          className="bg-white p-1 border-border border-2 px-2"
          placeholder={`Type the ${deck.answerLabel}`}
        />
        <button
          type="submit"
          className="cursor-pointer bg-gold-light border-gold border-2 rounded-md inset-shadow-glossy
        p-1 px-4 hover:bg-gold font-bold transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
