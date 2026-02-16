import { DECK_COLUMNS, DECKS, type Deck } from "../types/deck";
import type { CardQueueIndex } from "../types/card";
import DeckInfo from "./DeckInfo";
import { Gilt } from "./Gilt";
import { Modal } from "./Modal";

interface DeckSelectorProps {
  cardQueues: CardQueueIndex;
  onSelectDeck: (deck: Deck) => void;
  isOpen: boolean;
}

export default function DeckSelector(props: DeckSelectorProps) {
  const { cardQueues, onSelectDeck, isOpen } = props;
  return (
    <Modal title="Select a Topic" isOpen={isOpen} className="w-100 lg:w-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DECK_COLUMNS.map(([columnStart, columnEnd]) => (
          <div className="flex flex-col gap-4" key={columnStart}>
            {DECKS.slice(columnStart, columnEnd).map((deckCategory) => (
              <div
                className="flex flex-col gap-2 rounded-2xl bg-light-light border-standard p-4 pt-2"
                key={deckCategory.id}
              >
                <div className="font-bold text-xl">
                  {deckCategory.displayName}
                </div>
                {deckCategory.decks.map((deck) => {
                  const cardQueue = cardQueues[deck.id];
                  const isGold =
                    cardQueue.cards.filter((card) => card.known).length ===
                    cardQueue.cards.length;
                  return (
                    <button
                      className={`inline-block p-0! overflow-hidden font-bold text-lg text-left relative ${
                        isGold
                          ? "button-standard button-big"
                          : "button-boring button-big"
                      }`}
                      onClick={() => onSelectDeck(deck)}
                      key={deck.id}
                    >
                      {isGold && <Gilt />}
                      <div className="p-2 px-4 relative">
                        <DeckInfo
                          deck={deck}
                          cardQueue={cardQueue}
                          isSmall={true}
                          onClickDeckSelector={() => {}}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
