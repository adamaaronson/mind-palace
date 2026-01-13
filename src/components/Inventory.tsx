import { memo } from "react";
import { ERASER, type ShopItem } from "../types/shop";
import ItemCard from "./ItemCard";
import LinkButton from "./LinkButton";

interface InventoryProps {
  inventory: ShopItem[];
  goToShop: () => void;
  equippedBlock?: ShopItem;
  equipBlock: (item: ShopItem) => void;
  equipEraser: () => void;
}

function Inventory(props: InventoryProps) {
  const { inventory, goToShop, equippedBlock, equipBlock, equipEraser } = props;

  return (
    <div className="w-full">
      <h3 className="text-text-dark font-bold text-xl -mt-2 mb-2 ml-3">
        Inventory
      </h3>
      <div className="border-standard rounded-2xl bg-light-light p-4 overflow-hidden flex items-center justify-between">
        <div className="shrink min-w-0">
          {inventory.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto min-w-0">
              {inventory.map((block) => (
                <ItemCard
                  key={block.id}
                  item={block}
                  isSmall={true}
                  onClick={() => equipBlock(block)}
                  isEquipped={equippedBlock?.id === block.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-text-light text-center p-2">
              You need blocks to build your palace! Buy some in the{" "}
              <span className="whitespace-nowrap">
                <LinkButton className="2xl:hidden" onClick={goToShop}>
                  shop
                </LinkButton>
                <span className="hidden 2xl:inline">shop</span>.
              </span>
            </p>
          )}
        </div>
        <div className="border-l-standard pl-2 ml-2">
          <ItemCard
            item={ERASER}
            isSmall={true}
            onClick={equipEraser}
            isEquipped={equippedBlock?.id == ERASER.id}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Inventory);
