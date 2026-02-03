import { memo, useState } from "react";
import { ERASER, type ShopItem } from "../types/shop";
import ShopItemCard from "./ShopItemCard";
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
  const [, setScroll] = useState(0);

  return (
    <div className="w-full">
      <div className="border-standard rounded-2xl bg-light-light p-4 flex items-center justify-between mt-8">
        {inventory.length > 0 ? (
          <div
            className="shrink flex gap-2 overflow-x-auto min-w-0"
            onScroll={(e) => setScroll((e.target as HTMLDivElement).scrollLeft)}
          >
            {inventory.map((block) => (
              <ShopItemCard
                key={block.id}
                item={block}
                isSmall={true}
                onClick={() => equipBlock(block)}
                isEquipped={equippedBlock?.id === block.id}
              />
            ))}
          </div>
        ) : (
          <p className="grow text-sm text-text-light text-center p-2">
            <span className="hidden md:inline lg:hidden">
              Buy blocks in the
            </span>
            <span className="inline md:hidden lg:inline">
              You need blocks to build your palace.{" "}
              <span className="hidden xl:inline">
                <br />
              </span>
              Buy some in the
            </span>{" "}
            <span className="whitespace-nowrap">
              <LinkButton className="2xl:hidden" onClick={goToShop}>
                shop
              </LinkButton>
              <span className="hidden 2xl:inline">shop</span>!
            </span>
          </p>
        )}
        <div className="border-l-standard pl-4 ml-4">
          <ShopItemCard
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
