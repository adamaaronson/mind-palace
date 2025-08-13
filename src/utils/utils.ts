export function randrange(start: number, end: number) {
  return start + Math.floor(Math.random() * (end - start));
}

export function normalize(text: string) {
  return text
    .toLowerCase() // convert to lowercase
    .replace(/\s/g, "") // remove spaces
    .normalize("NFD") // normalize unicode characters
    .replace(/\p{Diacritic}/gu, ""); // remove diacritics
}
