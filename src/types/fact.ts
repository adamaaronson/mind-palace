import { normalize } from "../utils/utils";
import levenshtein from "damerau-levenshtein";

interface Answer {
  canonicalForm: string;
  alternateForms?: string[];
  link?: string;
  isName?: boolean;
  familyName?: string;
}

export interface Fact {
  id: number;
  question: string;
  questionLink?: string;
  questionSubtitle?: string;
  questionImage?: string;
  answers: Answer[];
  answerTemplate?: string;
}

export function getFamilyName(answer: Answer) {
  return (
    answer.familyName ??
    answer.canonicalForm.split(" ")[answer.canonicalForm.split(" ").length - 1]
  );
}

export function getAnswerEditDistance(fact: Fact, answer: string) {
  const normalizedCorrectAnswers = ([] as string[])
    .concat(
      ...fact.answers.map((answer) => [
        answer.canonicalForm,
        ...(answer.alternateForms ?? []),
        ...(answer.isName ? [getFamilyName(answer)] : []),
      ]),
    )
    .map((correctAnswer) => normalize(correctAnswer));

  const normalizedAnswer = normalize(answer);

  return Math.min(
    ...normalizedCorrectAnswers.map(
      (normalizedCorrectAnswer) =>
        levenshtein(normalizedCorrectAnswer, normalizedAnswer).steps,
    ),
  );
}
