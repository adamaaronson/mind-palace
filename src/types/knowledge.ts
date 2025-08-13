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
}

export function toFactArray(
  category: Category,
  facts: Omit<Fact, "category">[]
): Fact[] {
  return facts.map((fact) => ({ ...fact, category: category }));
}
