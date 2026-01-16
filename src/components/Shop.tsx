import { useState } from "react";
import {
  getShopItem,
  type ShopItem,
  type ShopItemCategory,
} from "../types/shop";
import ItemCard from "./ItemCard";

interface ShopProps {
  displayNuggets: number;
  setNuggets: React.Dispatch<React.SetStateAction<number>>;
  shopItems: ShopItemCategory[];
  setShopItems: React.Dispatch<React.SetStateAction<ShopItemCategory[]>>;
}

export default function Shop(props: ShopProps) {
  const { displayNuggets, setNuggets, shopItems, setShopItems } = props;
  const [, setScrolls] = useState<Record<string, HTMLDivElement>>({});

  const purchaseItem = (itemCategoryId: string, itemId: string) => {
    const item = getShopItem(shopItems, itemCategoryId, itemId);
    if (!item) {
      return;
    }

    const previousItemPrice = item.price;
    if (displayNuggets < item.price) {
      return;
    }
    setNuggets((nuggets) => nuggets - previousItemPrice);
    setShopItems((shopItems) =>
      shopItems.map((category) =>
        category.id === itemCategoryId
          ? {
              ...category,
              items: category.items.map((item: ShopItem) =>
                item.id === itemId
                  ? {
                      ...item,
                      price: Math.floor(item.price * 1.5),
                      level: item.level + 1,
                    }
                  : item
              ),
            }
          : category
      )
    );

    if (itemCategoryId === "upgrades" && itemId === "any-answers") {
      // Upgrading "nuggets per any answer" also increases "nuggets per correct answer" by 1
      setShopItems((shopItems) =>
        shopItems.map((category) =>
          category.id === "upgrades"
            ? {
                ...category,
                items: category.items.map((item: ShopItem) =>
                  item.id === "correct-answers"
                    ? {
                        ...item,
                        price: Math.floor(item.price * 1.5),
                        level: item.level + 1,
                      }
                    : item
                ),
              }
            : category
        )
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {shopItems.map((itemCategory) => (
        <div
          className="border-standard rounded-2xl bg-light-light p-4 pt-2 flex flex-col gap-2 min-w-0"
          key={itemCategory.id}
        >
          <div className="text-xl font-bold">{itemCategory.displayName}</div>
          <div
            className="flex gap-2 overflow-x-auto min-w-0"
            onScroll={(e) =>
              setScrolls((scrolls) => ({
                ...scrolls,
                [itemCategory.id]: e.target as HTMLDivElement,
              }))
            }
          >
            {itemCategory.items.map((item) => (
              <div className="flex flex-col gap-1" key={item.id}>
                <ItemCard
                  item={item}
                  isUpgrade={itemCategory.id === "upgrades"}
                  canPurchase={displayNuggets < item.price}
                  onPurchase={() => purchaseItem(itemCategory.id, item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
