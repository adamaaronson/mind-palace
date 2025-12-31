export const FOUNT_STREAK = 6; // number of correct answers in a row needed to create a fount
export const REFRESH_TIME = 42; // milliseconds to render a new animation frame
export const MAX_NUGGETS_AT_ONCE = 20; // most nuggets to render all at the same time

export const WRONG_MESSAGES = [
  "Keep that in mind!",
  "Remember this!",
  "Good to know!",
  "You learned something!",
  "Now you know!",
];

export const FOUNT_MESSAGES = ["You know it!", "Nice work!", "Good memory!"];

export const GRID_WIDTH = 11;
export const GRID_DEPTH = 11;
export const GRID_HEIGHT = 11;

export const getBlockHeight = (blockWidth: number) => (blockWidth / 36) * 40;
export const getBlockTopHeight = (blockWidth: number) => (blockWidth / 36) * 18;
export const getBlockSideHeight = (blockWidth: number) =>
  (blockWidth / 36) * 22;
