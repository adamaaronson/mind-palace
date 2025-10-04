import { normalize } from "../utils/utils";

export interface Deck {
  title: string;
  questionLabel: string;
  answerLabel: string;
  cards: Fact[];
}

export interface Fact {
  id: number;
  question: string;
  questionLink?: string;
  questionSubtitle?: string;
  answers: {
    canonicalForm: string;
    alternateForms?: string[];
    link?: string;
  }[];
  isName?: boolean;
  familyName?: string;
  alternateAnswers?: string[];
}

export function isCorrect(fact: Fact, answer: string) {
  const normalizedCorrectAnswers = ([] as string[])
    .concat(
      ...fact.answers.map((answer) => [
        answer.canonicalForm,
        ...(answer.alternateForms ?? []),
      ])
    )
    .map((correctAnswer) => normalize(correctAnswer));
  return normalizedCorrectAnswers.includes(normalize(answer));
}
