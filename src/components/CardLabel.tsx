import type { Card } from "../types/card";
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
    // already gilded
    (card.known && (wasCorrect === undefined || wasCorrect)) ||
    // newly gilded
    (wasCorrect && (!card.seen || card.streak >= KNOWLEDGE_STREAK - 1));

  return (
    <div className="top-0 left-full -translate-x-full -ml-4 -translate-y-[calc(50%-1px)] leading-0 absolute">
      <div
        className={`inline-block text-xs px-2 border-standard rounded-sm text-text-light relative overflow-hidden ${isGilded ? "bg-gold-light" : "bg-light-light"}`}
      >
        {isGilded && <Gilt />}
        <span className="relative">{cardLabel}</span>
      </div>
    </div>
  );
}
