import bestPictures from "../decks/json/best-pictures.json";
import usPresidents from "../decks/json/us-presidents.json";
import usStateCapitals from "../decks/json/us-state-capitals.json";
import worldCapitals from "../decks/json/world-capitals.json";
import worldCountries from "../decks/json/world-countries.json";
import worldFlags from "../decks/json/world-flags.json";
import { normalize } from "../utils/utils";
import { getAllAnswers, type Fact } from "./fact";

export interface Deck {
  id: string;
  facts: Record<number, Fact>;
  allAnswers: Set<string>;
  displayName: string;
  questionLabel?: string;
  answerLabel: string;
  answerTemplate: string;
}

export interface DeckCategory {
  id: string;
  displayName: string;
  decks: Deck[];
}

function createDeck(
  facts: Fact[],
  deckData: Omit<Deck, "facts" | "allAnswers">,
): Deck {
  const factsById = Object.fromEntries(facts.map((fact) => [fact.id, fact]));
  const allAnswers = new Set(facts.flatMap((fact) => getAllAnswers(fact)));

  return {
    facts: factsById,
    allAnswers: allAnswers,
    ...deckData,
  };
}

export const DECKS: DeckCategory[] = [
  {
    id: "geography",
    displayName: "Geography",
    decks: [
      createDeck(worldCapitals, {
        id: "world-capitals",
        displayName: "World Capitals",
        questionLabel: "country",
        answerLabel: "capital",
        answerTemplate: "The capital of <question> is <answer>",
      }),
      createDeck(worldCountries, {
        id: "world-countries",
        displayName: "World Countries",
        answerLabel: "country",
        answerTemplate: "The country was <answer>",
      }),
      createDeck(worldFlags, {
        id: "world-flags",
        displayName: "World Flags",
        answerLabel: "country",
        answerTemplate: "<questionImage> is the flag of <answer>",
      }),
      createDeck(usStateCapitals, {
        id: "us-state-capitals",
        displayName: "U.S. State Capitals",
        questionLabel: "U.S. state",
        answerLabel: "capital",
        answerTemplate: "The capital of <question> is <answer>",
      }),
    ],
  },
  {
    id: "history",
    displayName: "History",
    decks: [
      createDeck(usPresidents, {
        id: "us-presidents",
        displayName: "U.S. Presidents",
        answerLabel: "president",
        answerTemplate: "The <question> president was <answer>",
      }),
    ],
  },
  {
    id: "arts",
    displayName: "Arts",
    decks: [
      createDeck(bestPictures, {
        id: "best-pictures",
        displayName: "Best Pictures",
        answerLabel: "Best Picture winner",
        answerTemplate: "The <question> Best Picture winner was <answer>",
      }),
    ],
  },
];

export const DECK_COLUMNS: [number, number | undefined][] = [
  [0, 1],
  [1, undefined],
];

export const decksById: Record<string, Deck> = Object.fromEntries(
  DECKS.flatMap((category) => category.decks).map((deck) => [deck.id, deck]),
);

export function getQuestionImageUrl(fact: Fact, deck: Deck) {
  return `${deck.id}/${fact.questionImage}`;
}

export function isAnyAnswer(deck: Deck, answer: string) {
  return deck.allAnswers.has(normalize(answer));
}
