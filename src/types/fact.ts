import { normalize } from "../utils/utils";
import levenshtein from "damerau-levenshtein";

interface Answer {
  canonicalForm: string;
  alternateForms?: string[];
  link?: string;
  isName?: boolean;
  familyName?: string;
  isItalic?: boolean;
}

export interface Fact {
  id: number;
  question?: string;
  questionLink?: string;
  questionSubtitle?: string;
  questionImage?: string;
  questionIsItalic?: boolean;
  answers: Answer[];
  closeAnswers?: string[];
  answerTemplate?: string;
}

export function getFamilyName(answer: Answer) {
  return (
    answer.familyName ??
    answer.canonicalForm.split(" ")[answer.canonicalForm.split(" ").length - 1]
  );
}

export function getAllAnswers(fact: Fact) {
  return fact.answers
    .flatMap((answer) => [
      answer.canonicalForm,
      ...(answer.alternateForms ?? []),
      ...(answer.isName ? [getFamilyName(answer)] : []),
    ])
    .map((correctAnswer) => normalize(correctAnswer));
}

export function getAnswerEditDistance(fact: Fact, answer: string) {
  const normalizedCorrectAnswers = getAllAnswers(fact);
  const normalizedAnswer = normalize(answer);

  return Math.min(
    ...normalizedCorrectAnswers.map(
      (normalizedCorrectAnswer) =>
        levenshtein(normalizedCorrectAnswer, normalizedAnswer).steps,
    ),
  );
}

export function isCloseAnswer(fact: Fact, answer: string) {
  if (!fact.closeAnswers) {
    return false;
  }
  const normalizedCloseAnswers = fact.closeAnswers.map((answer) =>
    normalize(answer),
  );
  const normalizedAnswer = normalize(answer);

  return normalizedCloseAnswers.includes(normalizedAnswer);
}
