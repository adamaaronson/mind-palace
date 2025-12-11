import React, { useEffect, useState } from "react";
import { type MemoryQueue, type Card, reshuffle, isNew } from "../types/memory";
import { shuffle } from "lodash";
import deck from "../decks/json/world_capitals.json";
import { isCorrect } from "../types/knowledge";
import Footer from "./Footer";
import Header from "./Header";
import FountOfKnowledge from "./FountOfKnowledge";
import { FOUNT_STREAK, REFRESH_TIME } from "../utils/constants";
import Column from "./Column";
import AnswerCard from "./AnswerCard";
import QuestionCard from "./QuestionCard";
import Shop from "./Shop";
import { UPGRADES } from "../types/upgrade";

export default function App() {
  const [memoryQueue] = useState<MemoryQueue>(() => ({
    cards: shuffle(deck.cards),
    alreadyStudiedIndex: deck.cards.length,
    randomness: 5,
  }));
  const [card, setCard] = useState(memoryQueue.cards[0]);

  const [wasCorrect, setWasCorrect] = useState(false);
  const [earnedFount, setEarnedFount] = useState(false);
  const [lostFount, setLostFount] = useState(false);
  const [previousCard, setPreviousCard] = useState<Card | null>(null);
  const [nuggets, setNuggets] = useState(0);
  const [nuggetsPerSecond, setNuggetsPerSecond] = useState(0);
  const [nuggetsEarned, setNuggetsEarned] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  const displayNuggets = Math.round(nuggets);
  const nuggetsPerCorrectAnswer = UPGRADES.CORRECT_ANSWERS.level;
  const nuggetsPerWrongAnswer = UPGRADES.ANY_ANSWERS.level;

  const numItems = deck.cards.length;
  const numSeen = memoryQueue.cards.filter((card) => !isNew(card)).length;
  const numKnown = memoryQueue.cards.filter((card) => card.known).length;

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

  const submitGuess = (guess: string) => {
    const wasCorrect = isCorrect(card, guess);
    const earnedFount =
      wasCorrect &&
      !card.known &&
      (isNew(card) || card.streak === FOUNT_STREAK - 1);
    const lostFount = !wasCorrect && !!card.known;
    const nuggetsEarned = wasCorrect
      ? nuggetsPerCorrectAnswer
      : nuggetsPerWrongAnswer;

    if (earnedFount) {
      setNuggets((nuggets) => nuggets + nuggetsPerCorrectAnswer);
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond + 1);
      card.known = true;
    } else if (lostFount) {
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond - 1);
      card.known = false;
    } else {
      setNuggets((nuggets) => nuggets + nuggetsEarned);
      if (!wasCorrect) {
        card.known = false;
      }
    }

    setWasCorrect(wasCorrect);
    setEarnedFount(earnedFount);
    setNuggetsEarned(nuggetsEarned);
    setLostFount(lostFount);
    setPreviousCard(card);

    reshuffle(memoryQueue, wasCorrect);
    setCard(memoryQueue.cards[0]);
  };

  return (
    <div className="relative flex flex-col h-full font-theme">
      <div className="fixed h-full w-full bg-background -z-30"></div>
      <div className="fixed h-full w-full bg-[url(/damask.png)] bg-size-[400px] md:bg-size-[600px] opacity-10 -z-20"></div>
      <Header />
      <div className="flex flex-row w-full grow-1">
        <Column />
        <div className="flex-auto mt-4 pb-4 h-full flex flex-col items-center overflow-hidden relative">
          <div className="grow m-4 mt-0 text-text-dark max-w-[1200px] w-full">
            <div className="flex justify-stretch h-full flex-col md:flex-row">
              <div className="flex-1 flex flex-col h-full relative">
                <div className="px-8 py-4 bg-light mx-4 border-2 border-border">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-2xl font-bold">
                      <img
                        className="inline-block w-[0.8em] align-baseline mr-1"
                        src="hamburger.svg"
                      ></img>{" "}
                      {deck.title}
                      <div className="h-[6px] w-[120px] bg-border ml-[1.25em] mt-1">
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
                        <span className="font-bold text-text-dark">
                          {numItems}
                        </span>{" "}
                        items
                      </p>
                      <p>
                        <span className="font-bold text-text-dark">
                          {numSeen}
                        </span>{" "}
                        seen
                      </p>
                      <p>
                        <span className="font-bold text-text-dark">
                          {numKnown}
                        </span>{" "}
                        known
                      </p>
                    </div>
                  </div>

                  <QuestionCard
                    deck={deck}
                    card={card}
                    submitGuess={submitGuess}
                  />
                  {previousCard && (
                    <AnswerCard
                      deck={deck}
                      previousCard={previousCard}
                      wasCorrect={wasCorrect}
                      nuggetsEarned={nuggetsEarned}
                      earnedFount={earnedFount}
                      lostFount={lostFount}
                    />
                  )}
                </div>
                <FountOfKnowledge
                  displayNuggets={displayNuggets}
                  nuggetsPerSecond={nuggetsPerSecond}
                />
              </div>
              <div className="flex-1 shrink min-w-0 mt-8 md:mt-0">
                <Shop displayNuggets={displayNuggets} setNuggets={setNuggets} />
                <div className="p-4 pl-8 mb-4 bg-light mx-4 border-2 border-border">
                  <h3 className="text-2xl font-bold mb-2">Build</h3>
                  <p className=" text-text-light">
                    Here you'll be able to use your nuggets to buy blocks to
                    build your Mind Palace. Think Webkinz Clubhouse but for{" "}
                    <span className="italic">knowledge</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
        <Column />
      </div>
      <div className="bg-light h-4 border-t-2 border-border flex-none"></div>
    </div>
  );
}
