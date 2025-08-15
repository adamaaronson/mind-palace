import { normalize } from "../utils/utils";

export interface Category {
  questionLabel: string;
  answerLabel: string;
}

export interface Fact {
  question: string;
  answer: string;
  category: Category;
  isName?: boolean;
  familyName?: string;
  alternateAnswers?: string[];
}

export function toFactArray(
  category: Category,
  facts: Omit<Fact, "category">[]
): Fact[] {
  return facts.map((fact) => ({ ...fact, category: category }));
}

export function isCorrect(fact: Fact, answer: string) {
  const normalizedCorrectAnswers = [
    fact.answer,
    ...(fact.alternateAnswers ?? []),
  ].map((correctAnswer) => normalize(correctAnswer));
  console.log(normalizedCorrectAnswers);
  console.log(normalize(answer));
  return normalizedCorrectAnswers.includes(normalize(answer));
}
