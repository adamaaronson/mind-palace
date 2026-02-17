import { memo, useCallback, useEffect, useMemo, useState } from "react";

import BuildInventory from "./BuildInventory";
import {
  ERASER,
  getShopItem,
  type Inventory,
  type ShopItem,
} from "../types/shop";
import Palace from "./Palace";

interface BuildProps {
  isVisible: boolean;
  inventory: Inventory;
  goToShop: () => void;
  equippedBlock: ShopItem | undefined;
  setEquippedBlock: React.Dispatch<React.SetStateAction<ShopItem | undefined>>;
}

function Build(props: BuildProps) {
  const { inventory, goToShop, equippedBlock, setEquippedBlock } = props;
  const [usedBlocks, setUsedBlocks] = useState<Inventory>({});

  const equipBlock = useCallback((block: ShopItem) => {
    setEquippedBlock(block);
  }, []);

  const equipEraser = useCallback(() => {
    setEquippedBlock(ERASER);
  }, []);

  const unusedInventory = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(inventory)
          .filter(([itemId]) => getShopItem(itemId)!.categoryId === "blocks")
          .map(([itemId, level]) => {
            const unusedItem: [string, number] = [
              itemId,
              level - (usedBlocks[itemId] || 0),
            ];
            return unusedItem;
          })
          .filter(([, level]) => level > 0),
      ),
    [inventory, usedBlocks],
  );

  useEffect(() => {
    const noMoreEquippedBlock =
      equippedBlock &&
      equippedBlock.id !== ERASER.id &&
      !unusedInventory[equippedBlock.id];

    if (equippedBlock && noMoreEquippedBlock) {
      setEquippedBlock(undefined);
    }

    if (
      (!equippedBlock || noMoreEquippedBlock) &&
      Object.keys(unusedInventory).length >= 1
    ) {
      setEquippedBlock(getShopItem(Object.keys(unusedInventory)[0])!);
    }
  }, [equippedBlock, unusedInventory, setEquippedBlock]);

  return (
    <div>
      <Palace equippedBlock={equippedBlock} setUsedBlocks={setUsedBlocks} />
      <BuildInventory
        inventory={unusedInventory}
        goToShop={goToShop}
        equipBlock={equipBlock}
        equipEraser={equipEraser}
        equippedBlock={equippedBlock}
      />
    </div>
  );
}

export default memo(Build);
