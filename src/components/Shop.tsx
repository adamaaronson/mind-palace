import {
  getShopItem,
  type ShopItem,
  type ShopItemCategory,
} from "../types/shop";
import { formatNumber } from "../utils/utils";
import ItemCard from "./ItemCard";

interface ShopProps {
  displayNuggets: number;
  setNuggets: React.Dispatch<React.SetStateAction<number>>;
  shopItems: ShopItemCategory[];
  setShopItems: React.Dispatch<React.SetStateAction<ShopItemCategory[]>>;
}

export default function Shop(props: ShopProps) {
  const { displayNuggets, setNuggets, shopItems, setShopItems } = props;

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
          <div className="flex gap-2 overflow-x-auto min-w-0">
            {itemCategory.items.map((item) => (
              <div className="flex flex-col gap-1" key={item.id}>
                <ItemCard
                  item={item}
                  isUpgrade={itemCategory.id === "upgrades"}
                />
                <button
                  type="submit"
                  className="button-standard py-0! px-2! text-sm"
                  disabled={displayNuggets < item.price}
                  onClick={() => purchaseItem(itemCategory.id, item.id)}
                >
                  <img
                    src="nugget.svg"
                    className="inline-block h-[1em] align-baseline -mb-0.5"
                  ></img>{" "}
                  {formatNumber(item.price)}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
