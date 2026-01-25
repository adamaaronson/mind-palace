export interface ShopItem {
  id: string;
  displayName: string;
  price: number;
  image: string;
  level: number;
}

export interface ShopItemCategory {
  id: string;
  displayName: string;
  items: ShopItem[];
}

export const SHOP_ITEMS: ShopItemCategory[] = [
  {
    id: "upgrades",
    displayName: "Upgrades",
    items: [
      {
        id: "correct-answers",
        displayName: "Nuggets for a correct answer",
        price: 500,
        image: "check.svg",
        level: 1,
      },
      {
        id: "any-answers",
        displayName: "Nuggets for any answer",
        price: 1000,
        image: "check-and-x.svg",
        level: 1,
      },
    ],
  },
  {
    id: "blocks",
    displayName: "Blocks",
    items: [
      {
        id: "block",
        displayName: "Block",
        price: 5,
        image: "block.svg",
        level: 0,
      },
      {
        id: "block-marble",
        displayName: "Marble",
        price: 5,
        image: "block-marble.svg",
        level: 0,
      },
    ],
  },
];

export const ERASER: ShopItem = {
  id: "eraser",
  displayName: "Eraser",
  price: 0,
  image: "eraser.svg",
  level: 0,
};

export const FLOOR: ShopItem = {
  id: "floor",
  displayName: "Floor",
  price: 0,
  image: "block-floor.svg",
  level: 0,
};

export const WALL_LEFT: ShopItem = {
  id: "wall-left",
  displayName: "Left wall",
  price: 0,
  image: "block-wall-left.svg",
  level: 0,
};

export const WALL_RIGHT: ShopItem = {
  id: "wall-right",
  displayName: "Right wall",
  price: 0,
  image: "block-wall-right.svg",
  level: 0,
};

export const getShopItem = (
  shopItems: ShopItemCategory[],
  itemCategoryId: string,
  itemId: string,
) => {
  const category = shopItems.find((item) => item.id === itemCategoryId);
  return category?.items.find((item) => item.id === itemId);
};

export const getShopItemCategory = (
  shopItems: ShopItemCategory[],
  itemCategoryId: string,
) => {
  return shopItems.find((item) => item.id === itemCategoryId);
};
