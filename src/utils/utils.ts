import numeral from "numeral";
import {
  BLOCK_SIDE_HEIGHT,
  BLOCK_TOP_HEIGHT,
  BLOCK_WIDTH,
  ORIGIN_X,
  ORIGIN_Y,
  STOP_WORDS,
} from "./constants";
import type { Coordinates } from "../types/coordinates";

export function randomRange(start: number, end: number) {
  return start + Math.floor(Math.random() * (end - start));
}

export function randomChoice<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function normalize(text: string) {
  return text
    .toLowerCase() // convert to lowercase
    .split(" ")
    .filter((x) => !STOP_WORDS.includes(x)) // remove stop words
    .join(" ")
    .replace(/[\p{P}\s]/gu, "") // remove punctuation and spaces
    .normalize("NFD") // normalize unicode characters
    .replace(/\p{Diacritic}/gu, ""); // remove diacritics
}

export function formatNumber(num: number) {
  return numeral(num).format("0,0");
}

export function formatNumberShort(num: number) {
  if (num >= 1_000_000) {
    return numeral(num.toPrecision(3)).format("0[.][00]a").toUpperCase();
  } else {
    return formatNumber(num);
  }
}

// adapted from https://stackoverflow.com/a/32851198
export function toRomanNumerals(num: number) {
  const lookup = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };

  let roman = "";
  let i: keyof typeof lookup;

  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

// project 3-dimensional coordinates onto isometric view
// x: to the right and down a bit
// y: up
// z: to the left and down a bit
export function getIsometricProjection(coordinates: Coordinates) {
  const { x, y, z } = coordinates;
  return {
    x: ORIGIN_X + (x - z) * (BLOCK_WIDTH / 2),
    y: ORIGIN_Y + (x + z) * (BLOCK_TOP_HEIGHT / 2) - y * BLOCK_SIDE_HEIGHT,
  };
}

export function cqw(value: number) {
  return `${value}cqw`;
}
