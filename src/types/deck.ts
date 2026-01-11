import usStateCapitals from "../decks/json/us-state-capitals.json";
import worldCapitals from "../decks/json/world-capitals.json";
import type { Fact } from "./fact";

export interface Deck {
  id: string;
  displayName: string;
  questionLabel: string;
  answerLabel: string;
  facts: Fact[];
}

export interface DeckCategory {
  id: string;
  displayName: string;
  decks: Deck[];
}

export const DECKS: DeckCategory[] = [
  {
    id: "geography",
    displayName: "Geography",
    decks: [
      { id: "world-capitals", ...worldCapitals },
      { id: "us-state-capitals", ...usStateCapitals },
    ],
  },
];

export const DECKS_BY_ID: Record<string, Deck> = Object.fromEntries(
  DECKS.flatMap((category) => category.decks).map((deck) => [deck.id, deck])
);
