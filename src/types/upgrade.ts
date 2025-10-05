export interface Upgrade {
  price: number;
  image: string;
  level: number;
}

export const UPGRADES: Record<string, Upgrade> = {
  CORRECT_ANSWERS: {
    price: 500,
    image: "check.svg",
    level: 1,
  },
  ANY_ANSWERS: {
    price: 1000,
    image: "check-and-x.svg",
    level: 1,
  },
};
