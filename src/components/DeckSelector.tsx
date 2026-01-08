import type { Deck } from "../types/knowledge";
import type { CardQueue } from "../types/memory";
import DeckInfo from "./DeckInfo";
import { Modal } from "./Modal";

interface DeckSelectorProps {
  decks: Record<string, Deck[]>;
  cardQueue: CardQueue;
  onSelectDeck: (deck: Deck) => void;
  onClose: () => void;
}

export default function DeckSelector(props: DeckSelectorProps) {
  const { decks, cardQueue, onSelectDeck, onClose } = props;
  return (
    <Modal title="Select a Deck" onClose={onClose} className="w-100">
      <div className="flex flex-col gap-2 rounded-2xl bg-light-light border-standard p-4 pt-2">
        {Object.entries(decks).map(([category, categoryDecks]) => (
          <div className="flex flex-col gap-2" key={category}>
            <div className="font-bold text-xl">{category}</div>
            {categoryDecks.map((deck) => (
              <button
                className="inline-block button-boring p-2 px-4 font-bold text-lg text-left"
                onClick={() => onSelectDeck(deck)}
              >
                <DeckInfo
                  deck={deck}
                  cardQueue={cardQueue}
                  small
                  onClickDeckSelector={() => {}}
                />
              </button>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
