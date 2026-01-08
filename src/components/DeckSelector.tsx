import type { Deck } from "../types/knowledge";
import { Modal } from "./Modal";

interface DeckSelectorProps {
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onClose: () => void;
}

export default function DeckSelector(props: DeckSelectorProps) {
  const { decks, onSelectDeck, onClose } = props;
  return (
    <Modal title="Select a Deck" onClose={onClose} className="w-100">
      <div className="flex flex-col items-start gap-2 rounded-2xl bg-light-light border-standard p-4 pt-2">
        <div className="font-bold text-lg">Geography</div>
        {decks.map((deck) => (
          <div className="flex flex-row gap-4 items-center" key={deck.id}>
            <button
              className="inline-block button-boring font-bold text-lg text-left"
              onClick={() => onSelectDeck(deck)}
            >
              {deck.title}
            </button>
            <span className="text-text-light text-sm">
              <span className="font-bold text-text-dark">
                {deck.facts.length}
              </span>{" "}
              items
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
