import type { Deck } from "../types/knowledge";
import { type CardQueue } from "../types/memory";

interface DeckInfoProps {
  deck: Deck;
  cardQueue: CardQueue;
  onClickDeckSelector: () => void;
}

export default function DeckInfo(props: DeckInfoProps) {
  const { deck, cardQueue, onClickDeckSelector } = props;
  const numItems = deck.facts.length;
  const numSeen = cardQueue.cards.filter((card) => card.seen).length;
  const numKnown = cardQueue.cards.filter((card) => card.known).length;
  return (
    <div className="flex justify-between">
      <div className="flex flex-row items-start gap-2">
        <button
          className="text-2xl button-standard button-boring p-1.5!"
          onClick={onClickDeckSelector}
        >
          <img
            className="block w-[0.8em] align-baseline"
            src="hamburger.svg"
          ></img>
        </button>
        <h3 className="text-2xl font-bold">
          {deck.title}
          <div className="h-1.5 w-30 bg-taupe mt-1 ml-px">
            <div
              className="bg-text-dark h-full"
              style={{
                width: `${(numKnown / numItems) * 120}px`,
              }}
            ></div>
          </div>
        </h3>
      </div>

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
