export const KNOWLEDGE_STREAK = 6; // number of correct answers in a row needed to prove knowledge
export const PHI = (1 + Math.sqrt(5)) / 2;

export const REFRESH_TIME = 42; // milliseconds to render a new animation frame
export const AUTOSAVE_SECONDS = 10; // seconds between autosaves
export const MAX_NUGGETS_AT_ONCE = 20; // most nuggets to render all at the same time

export const GRID_WIDTH = 11;
export const GRID_DEPTH = 11;
export const GRID_HEIGHT = 11;

export const DEFAULT_FOUNT_WIDTH = 423;
export const NUGGET_PARTICLE_DURATION_MS = 1000;

export const BLOCK_WIDTH_TO_HEIGHT = 40 / 36;
export const BLOCK_WIDTH_TO_TOP_HEIGHT = 18 / 36;
export const BLOCK_WIDTH_TO_SIDE_HEIGHT = 22 / 36;

export const BLOCK_WIDTH = 100 / ((GRID_WIDTH + GRID_DEPTH) / 2); // cqw of palace
export const BLOCK_HEIGHT = BLOCK_WIDTH * BLOCK_WIDTH_TO_HEIGHT;
export const BLOCK_TOP_HEIGHT = BLOCK_WIDTH * BLOCK_WIDTH_TO_TOP_HEIGHT;
export const BLOCK_SIDE_HEIGHT = BLOCK_WIDTH * BLOCK_WIDTH_TO_SIDE_HEIGHT;

export const ORIGIN_X = BLOCK_WIDTH * (GRID_DEPTH / 2 - 1 / 2);
export const ORIGIN_Y = GRID_HEIGHT * BLOCK_SIDE_HEIGHT;
export const PALACE_SHADOW_HEIGHT = BLOCK_SIDE_HEIGHT * GRID_WIDTH * 1.1;

export const PRICE_MULTIPLIER = 1.2;
export const STOP_WORDS = ["a", "an", "and", "the"];
