import usPresidents from "../decks/json/us-presidents.json";
import usStateCapitals from "../decks/json/us-state-capitals.json";
import worldCapitals from "../decks/json/world-capitals.json";
import worldFlags from "../decks/json/world-flags.json";
import { normalize } from "../utils/utils";
import { getAllAnswers, type Fact } from "./fact";

export interface Deck {
  id: string;
  displayName: string;
  questionLabel?: string;
  answerLabel: string;
  answerTemplate: string;
  facts: Fact[];
  allAnswers: Set<string>;
}

export interface DeckCategory {
  id: string;
  displayName: string;
  decks: Deck[];
}

function createDeck(
  id: string,
  deckData: Omit<Deck, "id" | "allAnswers">,
): Deck {
  const allAnswers = new Set(
    deckData.facts.flatMap((fact) => getAllAnswers(fact)),
  );

  return {
    id: id,
    allAnswers: allAnswers,
    ...deckData,
  };
}

export const DECKS: DeckCategory[] = [
  {
    id: "geography",
    displayName: "Geography",
    decks: [
      createDeck("world-capitals", worldCapitals),
      createDeck("world-flags", worldFlags),
      createDeck("us-state-capitals", usStateCapitals),
    ],
  },
  {
    id: "history",
    displayName: "History",
    decks: [createDeck("us-presidents", usPresidents)],
  },
];

export const DECKS_BY_ID: Record<string, Deck> = Object.fromEntries(
  DECKS.flatMap((category) => category.decks).map((deck) => [deck.id, deck]),
);

export function getQuestionImageUrl(fact: Fact, deck: Deck) {
  return `${deck.id}/${fact.questionImage}`;
}

export function isAnyAnswer(deck: Deck, answer: string) {
  return deck.allAnswers.has(normalize(answer));
}
