import { useState } from "react";
import { getQuestionImageUrl, type Deck } from "../types/deck";
import { type Card } from "../types/memory";
import CardLabel from "./CardLabel";

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
  const fact = card.fact;

  return (
    <div className="relative p-4 rounded-2xl bg-light-light border-standard text-center md:min-w-80 overflow-hidden">
      <CardLabel card={card} />
      <div className="text-text-light mb-1">Name the {deck.answerLabel}:</div>
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
          key={card.fact.id}
          src={getQuestionImageUrl(fact, deck)}
          className="block max-h-24 mb-4 m-auto"
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
          className="bg-white p-1 border-standard px-2 w-54"
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
