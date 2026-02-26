import { PRICE_MULTIPLIER } from "../utils/constants";

export interface ShopItem {
  id: string;
  categoryId?: string;
  displayName: string;
  image: string;
  basePrice?: number;
  baseLevel?: number;
}

interface ShopItemCategory {
  id: string;
  displayName: string;
  items: ShopItem[];
}

export type Inventory = Record<string, number>;

function createShopItemCategory(
  id: string,
  displayName: string,
  items: Omit<ShopItem, "categoryId">[],
): ShopItemCategory {
  return {
    id,
    displayName,
    items: items.map((item) => ({ ...item, categoryId: id })),
  };
}

export const SHOP_ITEMS: ShopItemCategory[] = [
  createShopItemCategory("upgrades", "Upgrades", [
    {
      id: "correct-answers",
      displayName: "Nuggets for a correct answer",
      image: "check.svg",
      basePrice: 500,
      baseLevel: 1,
    },
    {
      id: "any-answers",
      displayName: "Nuggets for any answer",
      image: "check-and-x.svg",
      basePrice: 1000,
      baseLevel: 1,
    },
  ]),
  createShopItemCategory("blocks", "Blocks", [
    {
      id: "wood",
      displayName: "Block",
      image: "block.svg",
      basePrice: 5,
    },
    {
      id: "marble",
      displayName: "Marble",
      image: "block-marble.svg",
      basePrice: 5,
    },
  ]),
];

export const ERASER: ShopItem = {
  id: "eraser",
  displayName: "Eraser",
  image: "eraser.svg",
};

export const FLOOR: ShopItem = {
  id: "floor",
  displayName: "Floor",
  image: "block-floor.svg",
};

export const WALL_LEFT: ShopItem = {
  id: "wall-left",
  displayName: "Left wall",
  image: "block-wall-left.svg",
};

export const WALL_RIGHT: ShopItem = {
  id: "wall-right",
  displayName: "Right wall",
  image: "block-wall-right.svg",
};

export function createInventory(): Inventory {
  return Object.fromEntries(
    SHOP_ITEMS.flatMap((shopItemCategory) =>
      shopItemCategory.items.map((shopItem) => [
        shopItem.id,
        shopItem.baseLevel ?? 0,
      ]),
    ),
  );
}

export function updateInventory(previousInventory: Inventory): Inventory {
  return Object.fromEntries(
    SHOP_ITEMS.flatMap((shopItemCategory) =>
      shopItemCategory.items.map((shopItem) => [
        shopItem.id,
        previousInventory[shopItem.id] ?? shopItem.baseLevel ?? 0,
      ]),
    ),
  );
}

const shopItemsById = Object.fromEntries(
  SHOP_ITEMS.flatMap((shopItemCategory) => shopItemCategory.items).map(
    (item) => [item.id, item],
  ),
);

export function getShopItem(itemId: string) {
  return shopItemsById[itemId];
}

export function getPrice(item: ShopItem, level: number) {
  return Math.floor(
    (item.basePrice ?? 0) * PRICE_MULTIPLIER ** (level - (item.baseLevel ?? 0)),
  );
}
