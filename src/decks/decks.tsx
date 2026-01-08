import usStateCapitals from "./json/us_state_capitals.json";
import worldCapitals from "./json/world_capitals.json";
import type { Deck } from "../types/knowledge";

const decks: Deck[] = [
  { id: 0, ...worldCapitals },
  { id: 1, ...usStateCapitals },
];

export default decks;
