import { type Fact } from "./knowledge";
import { randrange } from "../utils/utils";

const PHI = (1 + Math.sqrt(5)) / 2;

export interface Card extends Fact {
  interval?: number;
  streak?: number;
  known?: boolean;
}

export interface MemoryQueue {
  cards: Card[];
  alreadyStudiedIndex: number;
  randomness: number;
}

export function isNew(card: Card) {
  return card.interval === undefined;
}

export function reinsertFirstCard(queue: MemoryQueue, interval: number) {
  if (interval > queue.cards.length) {
    throw Error("Tried to move MemoryQueue item back too many spots.");
  } else if (queue.cards.length === 0) {
    throw Error("Tried to move an item in an empty MemoryQueue.");
  }

  const [firstCard] = queue.cards;
  queue.cards.splice(interval, 0, firstCard); // add item in nth position
  queue.cards.shift(); // remove first item
}

export function decrementAlreadyStudiedIndex(queue: MemoryQueue) {
  queue.alreadyStudiedIndex =
    ((((queue.alreadyStudiedIndex - 2) % queue.cards.length) +
      queue.cards.length) %
      queue.cards.length) +
    1;
}

export function reshuffle(queue: MemoryQueue, isCorrect: boolean) {
  const [firstCard] = queue.cards;

  firstCard.streak = isCorrect ? (firstCard.streak ?? 0) + 1 : 0;

  const randomnessCutoff = queue.cards.length - queue.randomness + 1;

  if (isCorrect) {
    if (firstCard.interval && firstCard.interval < randomnessCutoff) {
      // update first card's interval first, to check if it's gonna be too big
      firstCard.interval = Math.round(firstCard.interval * PHI);
    }

    if (firstCard.interval && firstCard.interval < randomnessCutoff) {
      // question has been answered wrong before:
      // insert based on the fact's previous interval times phi
      reinsertFirstCard(queue, firstCard.interval);

      if (firstCard.interval >= queue.alreadyStudiedIndex + 1) {
        decrementAlreadyStudiedIndex(queue);
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
      const interval = randrange(adjustedStart, queue.cards.length + 1);

      if (interval >= queue.alreadyStudiedIndex) {
        decrementAlreadyStudiedIndex(queue);
      }

      firstCard.interval = interval;

      reinsertFirstCard(queue, interval);
    }
  } else {
    firstCard.interval = 1;
    reinsertFirstCard(queue, 1);
  }
}
