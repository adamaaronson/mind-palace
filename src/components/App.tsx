import React, { useEffect, useRef, useState } from "react";
import { type MemoryQueue, type Card, reshuffle, isNew } from "../types/memory";
import { shuffle } from "lodash";
import deck from "../decks/json/world_capitals.json";
import { isCorrect } from "../types/knowledge";
import type { NuggetParticleProps } from "./NuggetParticle";
import NuggetParticle from "./NuggetParticle";
import LinkOrText from "./LinkOrText";
import { type Upgrade, UPGRADES } from "../types/upgrade";
import { formatNumber } from "../utils/utils";

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
  const [previousNuggetCount, setPreviousNuggetCount] = useState(0);
  const [nuggetParticles, setNuggetParticles] = useState<NuggetParticleProps[]>(
    []
  );

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

  useEffect(() => {
    // update nugget particles
    if (displayNuggets < previousNuggetCount) {
      setPreviousNuggetCount(displayNuggets);
      return;
    }
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

    for (let i = 0; i < nuggetsEarned; i++) {
      const nuggetTimestamp = now + i / nuggetsEarned;
      const xDistance = (0.5 - Math.random()) * fountSize;
      const yDistance = (-Math.random() * fountSize) / 2;
      const width =
        (Math.random() * 30 + 10) * (fountSize / DEFAULT_FOUNT_WIDTH);

      const nuggetParticleProps = {
        timestamp: nuggetTimestamp,
        xDistance: xDistance,
        yDistance: yDistance,
        width: width,
      };

      setNuggetParticles((nuggetParticles) => [
        ...nuggetParticles.filter(({ timestamp }) => now - timestamp < 2000),
        nuggetParticleProps,
      ]);
      setNuggetParticleTimestamp(nuggetTimestamp);
      setPreviousNuggetCount(displayNuggets);
    }
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
    <div className="flex flex-col h-full">
      <div className="bg-light h-4 border-b-2 border-border flex-none"></div>
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
        <div className="flex-auto h-full flex flex-col items-center overflow-hidden">
          <div className="p-4 px-8 mb-4 border-b-2 border-border w-full">
            <h1 className="text-5xl font-bold text-text-dark font-classical text-center tracking-widest">
              Mind Palace
            </h1>
          </div>
          <div className="grow m-4 text-text-dark font-theme max-w-[1200px] w-full">
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
                              fount
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
                <div className="grow"></div>
                <div className="mb-4 text-center mt-8 md:mt-0 text-shadow-background text-shadow-[0px_0px_10px_#efd795]">
                  <div className="font-bold text-4xl">
                    {formatNumber(displayNuggets)}{" "}
                    <span className="text-text-light font-normal">
                      {" "}
                      nugget{displayNuggets === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="font-bold">
                    {formatNumber(nuggetsPerSecond)}{" "}
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
