import { useReducer, useState } from "react";
import {
  type CardQueue,
  type Card,
  answerFirstCard,
  createCardQueue,
} from "../types/memory";
import deck from "../decks/json/world_capitals.json";
import { getAnswerEditDistance } from "../types/knowledge";
import Footer from "./Footer";
import Header from "./Header";
import FountOfKnowledge from "./FountOfKnowledge";
import { REFRESH_TIME } from "../utils/constants";
import Column from "./Column";
import AnswerCard from "./AnswerCard";
import QuestionCard from "./QuestionCard";
import Shop from "./Shop";
import { UPGRADES } from "../types/upgrade";
import Build from "./Build";
import DeckInfo from "./DeckInfo";
import Tabs from "./Tabs";
import { nuggetParticleReducer } from "./NuggetParticleReducer";

export default function App() {
  const [cardQueue, setCardQueue] = useState<CardQueue>(() =>
    createCardQueue(deck)
  );
  const [wasCorrect, setWasCorrect] = useState(true);
  const [hadTypo, setHadTypo] = useState(false);
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

  const [{ nuggetParticles }, dispatchNuggetParticles] = useReducer(
    nuggetParticleReducer,
    {
      previousNuggetTimestamp: 0,
      nuggetParticles: [],
    }
  );

  const displayNuggets = Math.floor(nuggets);
  const nuggetsPerCorrectAnswer = UPGRADES.CORRECT_ANSWERS.level;
  const nuggetsPerWrongAnswer = UPGRADES.ANY_ANSWERS.level;
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

  const submitGuess = (guess: string) => {
    const answerEditDistance = getAnswerEditDistance(card.fact, guess);

    if (answerEditDistance === 1) {
      setHadTypo(true);
      return false;
    } else {
      setHadTypo(false);
    }

    const wasCorrect = answerEditDistance === 0;
    const { answeredCard, cardQueue: newCardQueue } = answerFirstCard(
      cardQueue,
      wasCorrect
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

    setPreviousCard(answeredCard);
    setCardQueue(newCardQueue);
    return true;
  };

  return (
    <div className="relative flex flex-col h-full font-theme text-text-dark">
      <div className="fixed h-full w-full bg-background -z-30"></div>
      <div className="fixed h-full w-full bg-[url(/damask.png)] bg-size-[400px] md:bg-size-[600px] opacity-10 -z-20"></div>
      <Header />
      <div className="flex flex-row w-full grow">
        <Column />
        <div className="flex-auto mt-4 pb-4 h-full flex flex-col justify-center items-center overflow-hidden relative">
          <div className="flex m-4 mt-0 justify-center w-full h-full flex-col md:flex-row">
            <div className="md:flex-1 flex flex-col md:h-full relative md:max-w-150">
              <div className="px-8 py-4 bg-light mx-3 border-standard flex flex-col gap-4 relative">
                <DeckInfo deck={deck} cardQueue={cardQueue} />
                <QuestionCard
                  deck={deck}
                  card={card}
                  submitGuess={submitGuess}
                  wasCorrect={wasCorrect}
                  hadTypo={hadTypo}
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
            <div className="md:flex-1 md:max-w-150 2xl:max-w-300 2xl:flex-2 mt-8 md:mt-0 min-w-0">
              <Tabs
                labels={["Build", "Shop"]}
                widths={[3, 2]}
                activeIndex={tabIndex}
                setActiveIndex={setTabIndex}
              >
                <Build inventory={[]} goToShop={() => setTabIndex(1)} />
                <Shop displayNuggets={displayNuggets} setNuggets={setNuggets} />
              </Tabs>
            </div>
          </div>
          <Footer />
        </div>
        <Column />
      </div>
      <div className="bg-light h-4 border-t-standard flex-none"></div>
    </div>
  );
}
