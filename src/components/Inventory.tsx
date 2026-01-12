import { memo } from "react";
import { type ShopItem } from "../types/shop";
import ItemCard from "./ItemCard";
import LinkButton from "./LinkButton";

interface InventoryProps {
  inventory: ShopItem[];
  goToShop: () => void;
  equippedBlock?: ShopItem;
  equipBlock: (item: ShopItem) => void;
}

function Inventory(props: InventoryProps) {
  const { inventory, goToShop, equippedBlock, equipBlock } = props;

  return (
    <div className="w-full">
      <h3 className="text-text-dark font-bold text-xl -mt-2 mb-2 ml-3">
        Inventory
      </h3>
      <div className="border-standard rounded-2xl bg-light-light p-4 overflow-hidden">
        {inventory.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto min-w-0">
            {inventory.map((block) => (
              <ItemCard
                key={block.id}
                item={block}
                isSmall={true}
                onClick={() => equipBlock(block)}
                isEquipped={block.id === equippedBlock?.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-light text-center">
            You don't have any blocks! Buy some in the{" "}
            <span className="whitespace-nowrap">
              <LinkButton className="2xl:hidden" onClick={goToShop}>
                shop
              </LinkButton>
              <span className="hidden 2xl:inline">shop</span>.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(Inventory);
