import usStateCapitals from "../decks/json/us_state_capitals.json";
import worldCapitals from "../decks/json/world_capitals.json";
import type { Fact } from "./fact";

export interface Deck {
  id: number;
  title: string;
  questionLabel: string;
  answerLabel: string;
  facts: Fact[];
}

export const DECKS: Record<string, Deck[]> = {
  Geography: [
    { id: 0, ...worldCapitals },
    { id: 1, ...usStateCapitals },
  ],
};

export const DECKS_BY_ID: Record<number, Deck> = Object.fromEntries(
  Object.values(DECKS).flatMap((categoryDecks) =>
    categoryDecks.map((deck) => [deck.id, deck])
  )
);
