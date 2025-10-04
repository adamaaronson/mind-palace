import { useEffect, useRef, useState } from "react";
import { type MemoryQueue, type Card, reshuffle, isNew } from "../types/memory";
import { shuffle } from "lodash";
import deck from "../decks/json/world_capitals.json";
import { isCorrect } from "../types/knowledge";
import type { NuggetParticleProps } from "./NuggetParticle";
import NuggetParticle from "./NuggetParticle";

const FOUNT_STREAK = 6;
const REFRESH_TIME = 42;

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
    cards: shuffle(deck.cards),
    alreadyStudiedIndex: deck.cards.length,
    randomness: 5,
  }));
  const [card, setCard] = useState(memoryQueue.cards[0]);
  const [guess, setGuess] = useState("");
  const fountRef = useRef<HTMLImageElement | null>(null);

  const [wasCorrect, setWasCorrect] = useState(false);
  const [earnedFount, setEarnedFount] = useState(false);
  const [lostFount, setLostFount] = useState(false);
  const [previousCard, setPreviousCard] = useState<Card | null>(null);
  const [nuggets, setNuggets] = useState(0);
  const [nuggetsPerSecond, setNuggetsPerSecond] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [nuggetParticleTimestamp, setNuggetParticleTimestamp] = useState(0);
  const [nuggetParticles, setNuggetParticles] = useState<NuggetParticleProps[]>(
    []
  );

  const displayNuggets = Math.round(nuggets);

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

  useEffect(() => {
    // update nugget particles
    if (displayNuggets === 0) {
      return;
    }
    const now = Date.now();
    if (now - nuggetParticleTimestamp < REFRESH_TIME) {
      // don't make nugget particles too quickly
      return;
    }
    const DEFAULT_FOUNT_WIDTH = 423;

    const fountSize = fountRef?.current?.clientWidth ?? DEFAULT_FOUNT_WIDTH;
    const xDistance = (0.5 - Math.random()) * fountSize;
    const yDistance = (-Math.random() * fountSize) / 2;
    const width = (Math.random() * 30 + 10) * (fountSize / DEFAULT_FOUNT_WIDTH);

    const nuggetParticleProps = {
      timestamp: now,
      xDistance: xDistance,
      yDistance: yDistance,
      width: width,
    };

    setNuggetParticles((nuggetParticles) => [
      ...nuggetParticles.filter(({ timestamp }) => now - timestamp < 2000),
      nuggetParticleProps,
    ]);
    setNuggetParticleTimestamp(now);
  }, [displayNuggets]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const wasCorrect = isCorrect(card, guess);
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-light h-4 border-b-2 border-border flex-none"></div>
      <div className="flex flex-row w-full grow-1">
        <div className="flex-none flex">
          <div className="border-r-2 border-border w-[8px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
        </div>
        <div className="flex-auto h-full flex flex-col items-center">
          <div className="p-4 px-8 mb-4 border-b-2 border-border w-full">
            <h1 className="text-5xl font-bold text-text-dark font-classical text-center tracking-widest">
              Mind Palace
            </h1>
          </div>
          <div className="grow m-4 text-text-dark font-theme max-w-[1200px] w-full">
            <div className="flex justify-stretch h-full flex-col md:flex-row">
              <div className="flex-1 flex flex-col h-full relative">
                <div className="px-8 py-4 bg-light mx-4 border-2 border-border">
                  <h3 className="text-2xl font-bold mb-2">
                    <img
                      className="inline-block w-[0.8em] align-baseline mr-1"
                      src="hamburger.svg"
                    ></img>{" "}
                    {deck.title}
                  </h3>
                  <div className="relative p-4 rounded-2xl bg-light-light text-center border-2 border-border">
                    <div className="absolute -ml-4 text-sm left-full translate-x-[-100%] font-normal bg-white rounded-sm border-2 border-border px-2">
                      {getCardLabel(card)}
                    </div>
                    <div className="text-text-light">
                      Name the{" "}
                      <span className="font-bold text-text-dark">
                        {deck.answerLabel}
                      </span>{" "}
                      of:
                    </div>
                    <div className="font-bold text-2xl leading-tight">
                      {card.question}
                    </div>
                    <div className="font-bold mb-4">
                      ({card.questionSubtitle ?? deck.questionLabel})
                    </div>

                    <form
                      className="relative w-fit mx-auto"
                      onSubmit={(event) => handleSubmit(event)}
                    >
                      <input
                        value={guess}
                        onChange={(event) => setGuess(event.target.value)}
                        className="bg-white p-1 mr-2 border-border border-2 px-2 min-w-0"
                        placeholder={`Type the ${deck.answerLabel}`}
                      />
                      <button
                        type="submit"
                        className="cursor-pointer bg-gold-light border-gold border-2 rounded-md p-1 px-4 hover:bg-gold font-bold transition-colors"
                      >
                        Enter
                      </button>
                    </form>
                    {previousCard && (
                      <div className="mt-3">
                        <span
                          className={
                            wasCorrect ? "text-green-600" : "text-red-600"
                          }
                        >
                          {wasCorrect ? "✅" : "❌"} The {deck.answerLabel} of{" "}
                          <span className="font-bold">
                            {previousCard.question}
                          </span>{" "}
                          is {}
                          <span className="font-bold">
                            {previousCard.answers
                              .map((answer) => answer.canonicalForm)
                              .join(" / ")}
                          </span>
                          !
                        </span>
                        {lostFount && (
                          <div className="text-amber-950 font-bold text-sm">
                            –1{" "}
                            <span className="font-normal text-text-light">
                              fount
                            </span>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-amber-950 font-bold">+1</span>{" "}
                          <span className="text-text-light">
                            {earnedFount
                              ? "nugget per second! You know it!"
                              : "nugget!"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grow"></div>
                <div className="mb-4 text-center mt-8 md:mt-0">
                  <div className="font-bold text-4xl">
                    {displayNuggets}{" "}
                    <span className="text-text-light font-normal">
                      {" "}
                      nugget{displayNuggets === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="font-bold">
                    {nuggetsPerSecond}{" "}
                    <span className="text-text-light font-normal">
                      {" "}
                      per second
                    </span>
                  </div>
                </div>
                <div className="justify-self-end">
                  {nuggetParticles.map((nuggetParticleProps) => (
                    <NuggetParticle
                      {...nuggetParticleProps}
                      key={nuggetParticleProps.timestamp}
                    ></NuggetParticle>
                  ))}
                  <div>
                    <img
                      className="relative w-3/4 m-auto"
                      ref={fountRef}
                      src="fount-of-knowledge.svg"
                    ></img>
                  </div>
                  <div className="font-classical font-bold tracking-widest px-2 mt-4 text-sm w-fit rounded-md bg-light border-2 border-border m-auto">
                    <span className="text-text-light">•</span> Fount of
                    Knowledge <span className="text-text-light">•</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 mt-8 md:mt-0">
                <div className="p-4 pl-8 mb-4 bg-light mx-4 border-2 border-border">
                  <h3 className="text-2xl font-bold mb-2">Shop</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none flex">
          <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
          <div className="border-l-2 border-border w-[8px] h-full"></div>
        </div>
      </div>
      <div className="bg-light h-4 border-t-2 border-border flex-none"></div>
    </div>
  );
}
