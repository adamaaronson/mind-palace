import { DECKS, type Deck } from "../types/deck";
import type { CardQueue } from "../types/memory";
import DeckInfo from "./DeckInfo";
import { Gilt } from "./Gilt";
import { Modal } from "./Modal";

interface DeckSelectorProps {
  cardQueues: Record<string, CardQueue>;
  onSelectDeck: (deck: Deck) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeckSelector(props: DeckSelectorProps) {
  const { cardQueues, onSelectDeck, isOpen, onClose } = props;
  return (
    <Modal
      title="Select a Topic"
      isOpen={isOpen}
      onClose={onClose}
      className="w-100"
    >
      <div className="flex flex-col gap-4">
        {DECKS.map((deckCategory) => (
          <div
            className="flex flex-col gap-2 rounded-2xl bg-light-light border-standard p-4 pt-2"
            key={deckCategory.id}
          >
            <div className="font-bold text-xl">{deckCategory.displayName}</div>
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
    </Modal>
  );
}
