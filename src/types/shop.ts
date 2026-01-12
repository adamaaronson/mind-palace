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
        displayName: "Nuggets per correct answer",
        price: 500,
        image: "check.svg",
        level: 1,
      },
      {
        id: "any-answers",
        displayName: "Nuggets per any answer",
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
        price: 0,
        image: "block.svg",
        level: 0,
      },
      {
        id: "block-marble",
        displayName: "Marble",
        price: 0,
        image: "block-marble.svg",
        level: 0,
      },
    ],
  },
];

export const getShopItem = (
  shopItems: ShopItemCategory[],
  itemCategoryId: string,
  itemId: string
) => {
  const category = shopItems.find((item) => item.id === itemCategoryId);
  return category?.items.find((item) => item.id === itemId);
};

export const getShopItemCategory = (
  shopItems: ShopItemCategory[],
  itemCategoryId: string
) => {
  return shopItems.find((item) => item.id === itemCategoryId);
};
