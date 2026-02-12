import { type Deck } from "./deck";
import { type Fact } from "./fact";
import { shuffle } from "lodash";
import { KNOWLEDGE_STREAK } from "../utils/constants";

const PHI = (1 + Math.sqrt(5)) / 2;

export interface Card {
  fact: Fact;
  interval: number;
  streak: number;
  seen: boolean;
  known: boolean;
}

export interface CardQueue {
  cards: Card[];
  deckId: string;
}

export function shouldMakeKnown(card: Card) {
  return !card.seen || card.streak === KNOWLEDGE_STREAK;
}

export function createCardQueue(deck: Deck): CardQueue {
  return {
    cards: shuffle(deck.facts).map((fact) => ({
      fact: fact,
      interval: 1,
      streak: 0,
      seen: false,
      known: false,
    })),
    deckId: deck.id,
  };
}

export function replaceFirstCard(
  queue: CardQueue,
  newFirstCard: Card,
): CardQueue {
  const interval = newFirstCard.interval;

  if (interval > queue.cards.length) {
    throw Error("Tried to move CardQueue item back too many spots.");
  } else if (queue.cards.length === 0) {
    throw Error("Tried to move an item in an empty CardQueue.");
  }

  return {
    ...queue,
    cards: [
      ...queue.cards.slice(0, interval),
      newFirstCard,
      ...queue.cards.slice(interval),
    ].slice(1), // remove previous copy of first item
  };
}

export function answerFirstCard(
  queue: CardQueue,
  isCorrect: boolean,
): { answeredCard: Card; cardQueue: CardQueue } {
  const newCard: Card = { ...queue.cards[0] };
  const maxInterval = queue.cards.length;

  if (isCorrect) {
    if (newCard.seen) {
      newCard.interval = Math.min(
        maxInterval,
        Math.round(newCard.interval * PHI),
      );
    } else {
      newCard.interval = maxInterval;
    }

    newCard.streak += 1;

    if (shouldMakeKnown(newCard)) {
      newCard.known = true;
    }
  } else {
    // question was answered wrong, reset interval
    newCard.interval = 1;
    newCard.streak = 0;
    newCard.known = false;
  }

  newCard.seen = true;

  return {
    answeredCard: newCard,
    cardQueue: replaceFirstCard(queue, newCard),
  };
}
