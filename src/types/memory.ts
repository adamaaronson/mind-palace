import { type Deck, type Fact } from "./fact";
import { randomRange } from "../utils/utils";
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
  alreadyStudiedIndex: number;
  randomness: number;
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
    alreadyStudiedIndex: deck.facts.length,
    randomness: 5,
  };
}

export function replaceFirstCard(
  queue: CardQueue,
  newFirstCard: Card
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

export function decrementAlreadyStudiedIndex(queue: CardQueue): CardQueue {
  return {
    ...queue,
    alreadyStudiedIndex:
      ((((queue.alreadyStudiedIndex - 2) % queue.cards.length) +
        queue.cards.length) %
        queue.cards.length) +
      1,
  };
}

export function answerFirstCard(
  queue: CardQueue,
  isCorrect: boolean
): { answeredCard: Card; cardQueue: CardQueue } {
  const newCard: Card = { ...queue.cards[0] };

  newCard.streak = isCorrect ? newCard.streak + 1 : 0;

  const randomnessCutoff = queue.cards.length - queue.randomness + 1;

  if (isCorrect) {
    if (newCard.seen && newCard.interval < randomnessCutoff) {
      // update first card's interval, if it's not already too big
      newCard.interval = Math.round(newCard.interval * PHI);
    }

    if (newCard.seen && newCard.interval < randomnessCutoff) {
      // question has been answered wrong before
      // and will be inserted before the cutoff
      if (newCard.interval >= queue.alreadyStudiedIndex + 1) {
        queue = decrementAlreadyStudiedIndex(queue);
      }
    } else {
      // question has never been answered wrong before
      // or has been answered right enough times to appear perfect:
      // insert into the last <randomness> spots,
      // but no sooner than the alreadyStudiedIndex
      const adjustedStart = Math.max(
        randomnessCutoff,
        queue.alreadyStudiedIndex
      );
      newCard.interval = randomRange(adjustedStart, queue.cards.length + 1);

      if (newCard.interval >= queue.alreadyStudiedIndex) {
        queue = decrementAlreadyStudiedIndex(queue);
      }
    }

    if (shouldMakeKnown(newCard)) {
      newCard.known = true;
    }
  } else {
    // question was answered wrong, reset interval
    newCard.interval = 1;
    newCard.known = false;
  }

  newCard.seen = true;

  return {
    answeredCard: newCard,
    cardQueue: replaceFirstCard(queue, newCard),
  };
}
