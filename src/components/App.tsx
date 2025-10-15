import React, { useEffect, useRef, useState } from "react";
import { type MemoryQueue, type Card, reshuffle, isNew } from "../types/memory";
import { shuffle } from "lodash";
import deck from "../decks/json/world_capitals.json";
import { isCorrect } from "../types/knowledge";
import type { NuggetParticleProps } from "./NuggetParticle";
import NuggetParticle from "./NuggetParticle";
import LinkOrText from "./LinkOrText";
import { UPGRADES } from "../types/upgrade";
import { formatNumber } from "../utils/utils";
import Footer from "./Footer";
import Header from "./Header";
import FountOfKnowledge from "./FountOfKnowledge";
import { FOUNT_STREAK, REFRESH_TIME } from "../utils/constants";

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

  const [wasCorrect, setWasCorrect] = useState(false);
  const [earnedFount, setEarnedFount] = useState(false);
  const [lostFount, setLostFount] = useState(false);
  const [previousCard, setPreviousCard] = useState<Card | null>(null);
  const [nuggets, setNuggets] = useState(0);
  const [nuggetsPerSecond, setNuggetsPerSecond] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  const displayNuggets = Math.round(nuggets);
  const nuggetsPerCorrectAnswer = UPGRADES.CORRECT_ANSWERS.level;
  const nuggetsPerWrongAnswer = UPGRADES.ANY_ANSWERS.level;

  const nuggetsEarned = wasCorrect
    ? nuggetsPerCorrectAnswer
    : nuggetsPerWrongAnswer;

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const wasCorrect = isCorrect(card, guess);
    const earnedFount =
      wasCorrect &&
      !card.known &&
      (isNew(card) || card.streak === FOUNT_STREAK - 1);
    const lostFount = !wasCorrect && !!card.known;

    if (earnedFount) {
      setNuggets((nuggets) => nuggets + nuggetsPerCorrectAnswer);
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond + 1);
      card.known = true;
    } else if (lostFount) {
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond - 1);
      card.known = false;
    } else {
      setNuggets(
        (nuggets) =>
          nuggets +
          (wasCorrect ? nuggetsPerCorrectAnswer : nuggetsPerWrongAnswer)
      );
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

  const purchaseUpgrade = (upgradeName: string) => {
    const upgrade = UPGRADES[upgradeName];
    const previousUpgradePrice = upgrade.price;
    if (displayNuggets < upgrade.price) {
      return;
    }
    setNuggets((nuggets) => nuggets - previousUpgradePrice);

    upgrade.price = Math.floor(upgrade.price * 1.5);
    upgrade.level += 1;
    if (upgradeName === "ANY_ANSWERS") {
      UPGRADES.CORRECT_ANSWERS.level += 1;
    }
  };

  return (
    <div className="relative flex flex-col h-full font-theme">
      <div className="fixed h-full w-full bg-[url(/damask.png)] bg-size-[400px] md:bg-size-[600px] opacity-10 -z-20"></div>
      <div className="bg-light h-4 border-b-2 border-border flex-none hidden md:block"></div>
      <div className="flex flex-row w-full grow-1">
        <div className="flex-none md:flex hidden">
          <div className="border-r-2 border-border w-[8px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
          <div className="bg-light border-r-2 border-border w-[6px] h-full"></div>
        </div>
        <div className="flex-auto h-full flex flex-col items-center overflow-hidden relative">
          <Header />
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

                  <div className="relative p-4 rounded-2xl bg-light-light text-center border-2 border-border">
                    <div className="absolute -ml-4 text-sm left-full translate-x-[-100%] font-normal rounded-sm border-2 border-border px-2">
                      {getCardLabel(card)}
                    </div>
                    <div className="text-text-light">
                      Name the{" "}
                      <span className="font-bold text-text-dark">
                        {deck.answerLabel}
                      </span>{" "}
                      of:
                    </div>
                    <div className="font-bold text-2xl leading-[1em] mt-1">
                      {card.question}
                    </div>
                    <div className="font-bold mb-4 leading-tight">
                      ({card.questionSubtitle ?? deck.questionLabel})
                    </div>

                    <form
                      className="relative w-fit mx-auto flex flex-col items-center gap-2 md:flex-row"
                      onSubmit={(event) => handleSubmit(event)}
                    >
                      <input
                        value={guess}
                        onChange={(event) => setGuess(event.target.value)}
                        className="bg-white p-1 border-border border-2 px-2"
                        placeholder={`Type the ${deck.answerLabel}`}
                      />
                      <button
                        type="submit"
                        className="cursor-pointer bg-gold-light border-gold border-2 rounded-md
                        p-1 px-4 hover:bg-gold font-bold transition-colors"
                      >
                        Enter
                      </button>
                    </form>
                  </div>
                  {previousCard && (
                    <div className="relative p-4 mt-4 rounded-2xl bg-light-light text-center border-2 border-border">
                      <div className="text-text-light text-xl">
                        <div className="leading-tight pb-0.5">
                          <img
                            className="inline-block align-baseline mb-[-0.1em] mr-1 w-[1em]"
                            src={wasCorrect ? "check.svg" : "x.svg"}
                          ></img>{" "}
                          The {deck.answerLabel} of{" "}
                          <LinkOrText
                            link={previousCard.questionLink}
                            text={previousCard.question}
                          />{" "}
                          is{" "}
                          {previousCard.answers.map((answer, index) => (
                            <React.Fragment key={index}>
                              <LinkOrText
                                link={answer.link}
                                text={answer.canonicalForm}
                              />
                              {index < previousCard.answers.length - 1 && (
                                <span> / </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        {lostFount && (
                          <div className="text-amber-950 font-bold">
                            –1{" "}
                            <span className="font-normal text-text-light">
                              nugget per second
                            </span>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-amber-950 font-bold">
                            +{nuggetsEarned}
                          </span>{" "}
                          <span className="text-text-light">
                            {earnedFount
                              ? "nugget per second! You know it!"
                              : `nugget${nuggetsEarned === 1 ? "" : "s"}!`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <FountOfKnowledge
                  displayNuggets={displayNuggets}
                  nuggetsPerSecond={nuggetsPerSecond}
                  nuggetsEarned={nuggetsEarned}
                />
              </div>
              <div className="flex-1 mt-8 md:mt-0">
                <div className="p-4 px-8 mb-4 bg-light mx-4 border-2 border-border">
                  <h3 className="text-2xl font-bold mb-2">Shop</h3>
                  <div className="border-2 border-border rounded-2xl bg-light-light p-4 flex gap-2">
                    {Object.entries(UPGRADES).map(([name, upgrade]) => (
                      <div className="flex flex-col gap-1" key={name}>
                        <div
                          className="relative bg-white border-border border-2 rounded-md h-20 w-20 p-2 flex justify-center align-center"
                          key={name}
                        >
                          <div className="absolute font-bold left-full top-0 -translate-x-full -ml-1">
                            +{upgrade.level}
                          </div>
                          <img src={upgrade.image} width="80%"></img>
                        </div>
                        <button
                          type="submit"
                          className={`bg-gold-light border-gold border-2 rounded-md px-2 font-bold transition-colors text-sm ${
                            displayNuggets >= upgrade.price
                              ? "opacity-100 cursor-pointer hover:bg-gold"
                              : "opacity-50"
                          }`}
                          disabled={displayNuggets < upgrade.price}
                          onClick={() => purchaseUpgrade(name)}
                        >
                          <img
                            src="nugget.svg"
                            className="inline-block h-[1em] align-baseline -mb-0.5"
                          ></img>{" "}
                          {formatNumber(upgrade.price)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
        <div className="flex-none md:flex hidden">
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
