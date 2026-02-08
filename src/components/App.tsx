import { useCallback, useEffect, useReducer, useState } from "react";
import {
  type CardQueue,
  type Card,
  answerFirstCard,
  createCardQueue,
} from "../types/memory";
import {
  type Deck,
  DECKS_BY_ID,
  getQuestionImageUrl,
  isAnyAnswer,
} from "../types/deck";
import { getAnswerEditDistance, isCloseAnswer } from "../types/fact";
import Footer from "./Footer";
import Header from "./Header";
import FountOfKnowledge from "./FountOfKnowledge";
import { REFRESH_TIME } from "../utils/constants";
import Column from "./Column";
import AnswerCard from "./AnswerCard";
import QuestionCard, { type AnswerStatus } from "./QuestionCard";
import Shop from "./Shop";
import { getShopItem, SHOP_ITEMS, type ShopItem } from "../types/shop";
import Build from "./Build";
import DeckInfo from "./DeckInfo";
import Tabs from "./Tabs";
import { nuggetParticleReducer } from "./NuggetParticleReducer";
import DeckSelector from "./DeckSelector";
import { preload } from "react-dom";
import Damask from "./Damask";

export default function App() {
  const [deckId, setDeckId] = useState("world-capitals");
  const [cardQueues, setCardQueues] = useState<Record<string, CardQueue>>(() =>
    Object.fromEntries(
      Object.entries(DECKS_BY_ID).map(([id, deck]) => [
        id,
        createCardQueue(deck),
      ]),
    ),
  );

  const [wasCorrect, setWasCorrect] = useState(true);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(null);
  const [earnedFount, setEarnedFount] = useState(false);
  const [lostFount, setLostFount] = useState(false);
  const [previousCard, setPreviousCard] = useState<Card | null>(null);
  const [nuggets, setNuggets] = useState(0);
  const [nuggetsPerSecond, setNuggetsPerSecond] = useState(0);
  const [nuggetsEarned, setNuggetsEarned] = useState(0);

  const [previousTimestamp, setPreviousTimestamp] = useState(-1);
  const [timestamp, setTimestamp] = useState(0);
  const [answerTimestamp, setAnswerTimestamp] = useState(0);

  const [tabIndex, setTabIndex] = useState(0);
  const [showingDeckSelector, setShowingDeckSelector] = useState(true);

  const [shopItems, setShopItems] = useState(() => SHOP_ITEMS);
  const [equippedBlock, setEquippedBlock] = useState<ShopItem | undefined>(
    undefined,
  );

  const [{ nuggetParticles }, dispatchNuggetParticles] = useReducer(
    nuggetParticleReducer,
    {
      previousNuggetTimestamp: 0,
      nuggetParticles: [],
    },
  );

  const cardQueue = cardQueues[deckId];
  const deck = DECKS_BY_ID[deckId];

  const displayNuggets = Math.floor(nuggets);
  const nuggetsPerWrongAnswer = getShopItem(
    shopItems,
    "upgrades",
    "any-answers",
  )!.level;
  const nuggetsPerCorrectAnswer = getShopItem(
    shopItems,
    "upgrades",
    "correct-answers",
  )!.level;
  const card = cardQueue.cards[0];

  if (
    timestamp !== previousTimestamp &&
    !(nuggets === 0 && nuggetsPerSecond === 0)
  ) {
    const now = Date.now();
    if (timestamp) {
      const nuggetsCreated = (nuggetsPerSecond * (now - timestamp)) / 1000;
      setNuggets((nuggets) => nuggets + nuggetsCreated);

      const newDisplayNuggets = Math.floor(nuggets + nuggetsCreated);
      if (newDisplayNuggets > displayNuggets) {
        dispatchNuggetParticles({
          type: "automatic",
          nuggetsPerSecond: nuggetsPerSecond,
          nuggetCount: newDisplayNuggets - displayNuggets,
        });
      }
    }

    setPreviousTimestamp(timestamp);
    setTimeout(() => setTimestamp(now), REFRESH_TIME);
  }

  const preloadQuestionImages = (cardQueue: CardQueue, num: number) => {
    cardQueue.cards.slice(0, num).forEach((card) => {
      const image = card.fact.questionImage;
      if (image) {
        preload(getQuestionImageUrl(card.fact, DECKS_BY_ID[cardQueue.deckId]), {
          as: "image",
        });
      }
    });
  };

  useEffect(() => {
    if (showingDeckSelector) {
      // Wait for animation to complete before preloading
      const timer = setTimeout(() => {
        Object.values(cardQueues).forEach((cardQueue) =>
          preloadQuestionImages(cardQueue, 2),
        );
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showingDeckSelector]);

  const selectDeck = (deck: Deck) => {
    setDeckId(deck.id);
    setPreviousCard(null);
    setWasCorrect(true);
    setEarnedFount(false);
    setLostFount(false);
    setShowingDeckSelector(false);
    preloadQuestionImages(cardQueue, 2);
  };

  const submitGuess = (guess: string) => {
    const answerEditDistance = getAnswerEditDistance(card.fact, guess);

    if (answerEditDistance === 1 && !isAnyAnswer(deck, guess)) {
      setAnswerStatus("typo");
      return false;
    } else if (isCloseAnswer(card.fact, guess)) {
      setAnswerStatus("close");
      return false;
    } else {
      setAnswerStatus(null);
    }

    const wasCorrect = answerEditDistance === 0;
    const { answeredCard, cardQueue: newCardQueue } = answerFirstCard(
      cardQueue,
      wasCorrect,
    );

    const earnedFount = wasCorrect && !card.known && answeredCard.known;
    const lostFount = !wasCorrect && card.known;

    const nuggetsEarned = wasCorrect
      ? nuggetsPerCorrectAnswer
      : nuggetsPerWrongAnswer;

    setNuggets((nuggets) => nuggets + nuggetsEarned);
    dispatchNuggetParticles({
      type: "manual",
      nuggetCount: nuggetsEarned,
    });

    if (earnedFount) {
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond + 1);
    } else if (lostFount) {
      setNuggetsPerSecond((nuggetsPerSecond) => nuggetsPerSecond - 1);
    }

    setWasCorrect(wasCorrect);
    setEarnedFount(earnedFount);
    setNuggetsEarned(nuggetsEarned);
    setLostFount(lostFount);
    setAnswerTimestamp(timestamp);

    setPreviousCard(card);
    setCardQueues((cardQueues) => ({
      ...cardQueues,
      [deckId]: newCardQueue,
    }));

    preloadQuestionImages(newCardQueue, 2);
    return true;
  };

  const goToShop = useCallback(() => {
    setTabIndex(1);
  }, [setTabIndex]);

  return (
    <div
      className={`relative flex flex-col h-full font-theme text-text-dark ${
        showingDeckSelector ? "overflow-hidden" : ""
      }`}
    >
      <div className="fixed h-full w-full bg-background -z-30"></div>
      <Damask />
      <Header />

      <div
        className={`flex flex-row w-full grow relative ${showingDeckSelector ? "h-full overflow-y-hidden" : ""}`}
      >
        <DeckSelector
          cardQueues={cardQueues}
          onSelectDeck={(deck) => selectDeck(deck)}
          isOpen={showingDeckSelector}
        />
        <Column />
        <div className="flex-auto mt-2 md:mt-4 pb-4 h-full flex flex-col justify-center items-center overflow-hidden relative">
          <div className="flex m-4 mt-0 justify-center w-full h-full flex-col md:flex-row">
            <div className="md:flex-1 flex flex-col md:h-full relative md:max-w-150">
              <div className="p-4 sm:px-8 bg-light mx-3 border-standard flex flex-col gap-4 relative">
                <DeckInfo
                  deck={deck}
                  cardQueue={cardQueue}
                  showDeckSelector
                  onClickDeckSelector={() => setShowingDeckSelector(true)}
                />
                <QuestionCard
                  key={deck.id}
                  deck={deck}
                  card={card}
                  submitGuess={submitGuess}
                  wasCorrect={wasCorrect}
                  answerStatus={answerStatus}
                />
                {previousCard && (
                  <AnswerCard
                    deck={deck}
                    previousCard={previousCard}
                    wasCorrect={wasCorrect}
                    earnedFount={earnedFount}
                    lostFount={lostFount}
                  />
                )}
              </div>
              <FountOfKnowledge
                displayNuggets={displayNuggets}
                nuggetsPerSecond={nuggetsPerSecond}
                nuggetParticles={nuggetParticles}
                earnedFount={earnedFount}
                lostFount={lostFount}
                nuggetsEarned={nuggetsEarned}
                answerTimestamp={answerTimestamp}
              />
            </div>
            <div className="md:flex-1 md:max-w-150 2xl:max-w-350 2xl:flex-2 mt-8 md:mt-0 min-w-0">
              <Tabs
                labels={["Build", "Shop"]}
                widths={[3, 2]}
                activeIndex={tabIndex}
                setActiveIndex={setTabIndex}
              >
                <Build
                  shopItems={shopItems}
                  goToShop={goToShop}
                  isVisible={tabIndex === 0}
                  equippedBlock={equippedBlock}
                  setEquippedBlock={setEquippedBlock}
                />
                <Shop
                  displayNuggets={displayNuggets}
                  setNuggets={setNuggets}
                  shopItems={shopItems}
                  setShopItems={setShopItems}
                  setEquippedBlock={setEquippedBlock}
                />
              </Tabs>
            </div>
          </div>
        </div>
        <Column />
      </div>
      <Footer />
    </div>
  );
}
