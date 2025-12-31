import type { Deck } from "../types/knowledge";
import { isNew, type MemoryQueue } from "../types/memory";

interface DeckInfoProps {
  deck: Deck;
  memoryQueue: MemoryQueue;
}

export default function DeckInfo(props: DeckInfoProps) {
  const { deck, memoryQueue } = props;

  const numItems = deck.cards.length;
  const numSeen = memoryQueue.cards.filter((card) => !isNew(card)).length;
  const numKnown = memoryQueue.cards.filter((card) => card.known).length;
  return (
    <div className="flex justify-between mb-4">
      <h3 className="text-2xl font-bold">
        <img
          className="inline-block w-[0.8em] align-baseline mr-1"
          src="hamburger.svg"
        ></img>{" "}
        {deck.title}
        <div className="h-1.5 w-30 bg-taupe ml-[1.25em] mt-1">
          <div
            className="bg-text-dark h-full"
            style={{
              width: `${(numKnown / numItems) * 120}px`,
            }}
          ></div>
        </div>
      </h3>

      <div className="text-text-light text-right leading-tight text-sm">
        <p>
          <span className="font-bold text-text-dark">{numItems}</span> items
        </p>
        <p>
          <span className="font-bold text-text-dark">{numSeen}</span> seen
        </p>
        <p>
          <span className="font-bold text-text-dark">{numKnown}</span> known
        </p>
      </div>
    </div>
  );
}
