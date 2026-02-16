export const KNOWLEDGE_STREAK = 6; // number of correct answers in a row needed to prove knowledge
export const PHI = (1 + Math.sqrt(5)) / 2;

export const REFRESH_TIME = 42; // milliseconds to render a new animation frame
export const MAX_NUGGETS_AT_ONCE = 20; // most nuggets to render all at the same time

export const GRID_WIDTH = 11;
export const GRID_DEPTH = 11;
export const GRID_HEIGHT = 11;

export const DEFAULT_FOUNT_WIDTH = 423;
export const NUGGET_PARTICLE_DURATION_MS = 1000;

export const getBlockHeight = (blockWidth: number) => (blockWidth / 36) * 40;
export const getBlockTopHeight = (blockWidth: number) => (blockWidth / 36) * 18;
export const getBlockSideHeight = (blockWidth: number) =>
  (blockWidth / 36) * 22;

export const PRICE_MULTIPLIER = 1.2;
export const STOP_WORDS = ["a", "an", "and", "the"];
