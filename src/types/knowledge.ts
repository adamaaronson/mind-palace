import { normalize } from "../utils/utils";

export interface Category {
  questionLabel: string;
  answerLabel: string;
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
  category: Category;
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
