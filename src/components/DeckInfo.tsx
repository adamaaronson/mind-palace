import type { Deck } from "../types/deck";
import { type CardQueue } from "../types/memory";

interface DeckInfoProps {
  deck: Deck;
  cardQueue: CardQueue;
  showDeckSelector?: boolean;
  isSmall?: boolean;
  onClickDeckSelector?: () => void;
}

export default function DeckInfo(props: DeckInfoProps) {
  const {
    deck,
    cardQueue,
    showDeckSelector = false,
    isSmall = false,
    onClickDeckSelector,
  } = props;
  const numItems = deck.facts.length;
  const numSeen = cardQueue.cards.filter((card) => card.seen).length;
  const numKnown = cardQueue.cards.filter((card) => card.known).length;
  return (
    <div className="flex justify-between flex-wrap gap-y-2">
      <div className="flex flex-row items-start gap-2">
        {showDeckSelector && (
          <button
            className="text-2xl button-boring p-1.5!"
            onClick={onClickDeckSelector}
          >
            <img
              className="block w-[0.8em] align-baseline"
              src="hamburger.svg"
            ></img>
          </button>
        )}
        <h3 className={`text-2xl font-bold ${isSmall ? "text-lg!" : ""}`}>
          <div>{deck.displayName}</div>
          <div
            className={`h-2 w-40 bg-taupe mt-1 ml-px ${isSmall ? "w-30!" : ""}`}
          >
            <div
              className="bg-text-dark h-full"
              style={{
                width: `${(numKnown / numItems) * 100}%`,
              }}
            ></div>
          </div>
        </h3>
      </div>

      <div className="text-text-light text-right leading-tight text-xs sm:text-sm font-normal">
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
