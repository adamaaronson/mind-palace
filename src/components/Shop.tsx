import { useState } from "react";
import {
  getPrice,
  getShopItem,
  SHOP_ITEMS,
  type Inventory,
  type ShopItem,
} from "../types/shop";
import ShopItemCard from "./ShopItemCard";

interface ShopProps {
  displayNuggets: number;
  setNuggets: React.Dispatch<React.SetStateAction<number>>;
  inventory: Inventory;
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
  setEquippedBlock: React.Dispatch<React.SetStateAction<ShopItem | undefined>>;
}

export default function Shop(props: ShopProps) {
  const {
    displayNuggets,
    setNuggets,
    inventory,
    setInventory,
    setEquippedBlock,
  } = props;
  const [, setScrolls] = useState<Record<string, HTMLDivElement>>({});

  const purchaseItem = (itemId: string) => {
    const item = getShopItem(itemId);
    if (!item) {
      return;
    }

    const previousItemPrice = getPrice(item, inventory[itemId] ?? 0);
    if (displayNuggets < previousItemPrice) {
      return;
    }
    setNuggets((nuggets) => nuggets - previousItemPrice);
    setInventory((inventory) => ({
      ...inventory,
      [itemId]: inventory[itemId] + 1,
    }));

    if (itemId === "any-answers") {
      // Upgrading "nuggets per any answer" also increases "nuggets per correct answer" by 1
      setInventory((inventory) => ({
        ...inventory,
        "correct-answers": inventory["correct-answers"] + 1,
      }));
    }

    if (item.categoryId === "blocks") {
      setEquippedBlock(item);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {SHOP_ITEMS.map((itemCategory) => (
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
                <ShopItemCard
                  item={item}
                  level={inventory[item.id]}
                  isUpgrade={itemCategory.id === "upgrades"}
                  canPurchase={
                    getPrice(item, inventory[item.id]) <= displayNuggets
                  }
                  onPurchase={() => purchaseItem(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
