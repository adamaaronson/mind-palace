import type { Deck } from "../types/deck";
import { type CardQueue } from "../types/card";

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
  const numItems = cardQueue.cards.length;
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
        <div className="flex flex-col justify-center h-full gap-1 pb-2">
          <div
            className={`text-lg xs:text-2xl font-bold ${isSmall ? "text-sm xs:text-lg" : ""}`}
          >
            {deck.displayName}
          </div>
          <div
            className={`h-2 w-30 xs:w-40 bg-taupe ml-px ${isSmall ? "xs:w-30" : ""}`}
          >
            <div
              className="bg-text-dark h-full"
              style={{
                width: `${(numKnown / numItems) * 100}%`,
              }}
            ></div>
          </div>
        </div>
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
