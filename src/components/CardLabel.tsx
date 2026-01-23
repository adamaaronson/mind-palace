import type { Card } from "../types/memory";
import { KNOWLEDGE_STREAK } from "../utils/constants";
import { Gilt } from "./Gilt";

const getCardLabel = (card: Card, wasCorrect: boolean | undefined) => {
  if (!card.seen) {
    return "new";
  }
  if (card.known) {
    return "review";
  }

  const newCardStreak = card.streak + (wasCorrect ? 1 : 0);

  return `${newCardStreak}/${KNOWLEDGE_STREAK}`;
};

interface CardLabelProps {
  card: Card;
  wasCorrect?: boolean;
}

export default function CardLabel(props: CardLabelProps) {
  const { card, wasCorrect } = props;
  const cardLabel = getCardLabel(card, wasCorrect);
  const isGilded =
    (card.known && wasCorrect === undefined) ||
    (wasCorrect && (!card.seen || card.streak >= KNOWLEDGE_STREAK - 1));

  return (
    <div className="-mt-4.5 -mr-4.5 text-right leading-0 mb-1">
      <div
        className={`inline-block text-xs pl-2 pr-3 border-standard rounded-bl-sm text-text-light relative overflow-hidden ${isGilded ? "bg-gold-light" : ""}`}
      >
        {isGilded && <Gilt />}
        <span className="relative">{cardLabel}</span>
      </div>
    </div>
  );
}
