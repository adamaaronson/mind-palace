import { normalize } from "../utils/utils";
import levenshtein from "damerau-levenshtein";

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

export function getAnswerEditDistance(fact: Fact, answer: string) {
  const normalizedCorrectAnswers = ([] as string[])
    .concat(
      ...fact.answers.map((answer) => [
        answer.canonicalForm,
        ...(answer.alternateForms ?? []),
      ])
    )
    .map((correctAnswer) => normalize(correctAnswer));

  const normalizedAnswer = normalize(answer);

  return Math.min(
    ...normalizedCorrectAnswers.map(
      (normalizedCorrectAnswer) =>
        levenshtein(normalizedCorrectAnswer, normalizedAnswer).steps
    )
  );
}
