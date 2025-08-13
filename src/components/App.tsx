import { useEffect, useState } from "react";
import { type MemoryQueue, type Card, reshuffle, isNew } from "../types/memory";
import { shuffle } from "lodash";
import { normalize } from "../utils/utils";
import { US_STATE_CAPITALS } from "../data/USStateCapitals";

const FOUNT_STREAK = 6;
const REFRESH_TIME = 49;

const getCardLabel = (card: Card) => {
  if (isNew(card)) {
    return "new";
  }
  if (card.known) {
    return "review";
  }

  return `${Math.min(card.streak ?? 0, FOUNT_STREAK)}/${FOUNT_STREAK}`;
};

export default function App() {
  const [memoryQueue] = useState<MemoryQueue>(() => ({
    cards: shuffle(US_STATE_CAPITALS),
    alreadyStudiedIndex: US_STATE_CAPITALS.length,
    randomness: 5,
  }));
  const [card, setCard] = useState(memoryQueue.cards[0]);
  const [guess, setGuess] = useState("");

  const [wasCorrect, setWasCorrect] = useState(false);
  const [earnedFount, setEarnedFount] = useState(false);
  const [lostFount, setLostFount] = useState(false);
  const [previousCard, setPreviousCard] = useState<Card | null>(null);
  const [nuggets, setNuggets] = useState(0);
  const [nuggetsPerSecond, setNuggetsPerSecond] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    if (nuggets === 0 && nuggetsPerSecond === 0) {
      return;
    }

    const now = Date.now();
    if (timestamp) {
      setNuggets(
        (nuggets) => nuggets + (nuggetsPerSecond * (now - timestamp)) / 1000
      );
    }

    setTimeout(() => setTimestamp(now), REFRESH_TIME);
  }, [timestamp, nuggetsPerSecond]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(memoryQueue.cards);

    const wasCorrect = normalize(guess) === normalize(card.answer);
    const earnedFount =
      wasCorrect &&
      !card.known &&
      (isNew(card) || card.streak === FOUNT_STREAK - 1);
    const lostFount = !wasCorrect && !!card.known;

    if (earnedFount) {
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond + 1);
      card.known = true;
    } else if (lostFount) {
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond - 1);
      card.known = false;
    } else {
      setNuggets((nuggets) => nuggets + 1);
      if (!wasCorrect) {
        card.known = false;
      }
    }

    setWasCorrect(wasCorrect);
    setEarnedFount(earnedFount);
    setLostFount(lostFount);
    setPreviousCard(card);

    reshuffle(memoryQueue, wasCorrect);
    setCard(memoryQueue.cards[0]);
    setGuess("");
  };

  return (
    <div className="m-4 text-amber-950 font-serif max-w-[600px] mx-auto">
      <div className="p-4 mb-4 rounded-2xl bg-amber-100 mx-4 text-center">
        <h1 className="text-3xl font-bold">🏠 Mind Palace</h1>
      </div>
      <div className="p-4 mb-4 rounded-2xl bg-amber-100 mx-4 text-center">
        <div className="opacity-60">Nuggets</div>
        <div className="font-bold text-4xl mb-2">{Math.floor(nuggets)}</div>
        <div className="opacity-60">Fount of knowledge</div>
        <div className="font-bold text-sm">{nuggetsPerSecond} per second</div>
      </div>
      <div className="p-4 mb-4 rounded-2xl bg-amber-100 mx-4 text-center">
        <div>
          Name the{" "}
          <span className="font-bold">{card.category.answerLabel}</span> of:
        </div>
        <div className="font-bold text-2xl mb-2">
          {card.question}{" "}
          <span className="font-normal text-base opacity-60">
            ({getCardLabel(card)})
          </span>
        </div>

        <form onSubmit={(event) => handleSubmit(event)}>
          <input
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            className="bg-white p-1 mr-2"
            placeholder={`Type the ${card.category.answerLabel}`}
          />
          <button
            type="submit"
            className="cursor-pointer bg-amber-300 p-1 px-2 mr-2"
          >
            Enter
          </button>
        </form>
        {previousCard && (
          <div className="mt-3">
            <span className={wasCorrect ? "text-green-600" : "text-red-600"}>
              {wasCorrect ? "✅" : "❌"} The {previousCard.category.answerLabel}{" "}
              of <span className="font-bold">{previousCard.question}</span> is{" "}
              <span className="font-bold">{previousCard.answer}</span>!
            </span>
            {lostFount && (
              <div className="text-amber-950 font-bold text-sm">
                –1 <span className="font-normal opacity-60">fount</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-amber-950 font-bold">+1</span>{" "}
              <span className="opacity-60">
                {earnedFount ? "fount! You know it!" : "nugget!"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
