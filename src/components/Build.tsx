import { memo, useCallback, useState } from "react";

import Inventory from "./Inventory";
import {
  ERASER,
  getShopItemCategory,
  type ShopItem,
  type ShopItemCategory,
} from "../types/shop";
import Palace from "./Palace";

interface BuildProps {
  isVisible: boolean;
  shopItems: ShopItemCategory[];
  goToShop: () => void;
  equippedBlock: ShopItem | undefined;
  setEquippedBlock: React.Dispatch<React.SetStateAction<ShopItem | undefined>>;
}

function Build(props: BuildProps) {
  const { isVisible, shopItems, goToShop, equippedBlock, setEquippedBlock } =
    props;
  const [usedBlocks, setUsedBlocks] = useState<Record<string, number>>({});

  const equipBlock = useCallback((block: ShopItem) => {
    setEquippedBlock(block);
  }, []);

  const equipEraser = useCallback(() => {
    setEquippedBlock(ERASER);
  }, []);

  const inventory = getShopItemCategory(shopItems, "blocks")!
    .items.map((item) => ({
      ...item,
      level: item.level - (usedBlocks[item.id] || 0),
    }))
    .filter((item) => item.level > 0);
  const noMoreEquippedBlock =
    equippedBlock &&
    equippedBlock.id !== ERASER.id &&
    inventory.find((item) => item.id === equippedBlock.id) == undefined;

  if (equippedBlock && noMoreEquippedBlock) {
    setEquippedBlock(undefined);
  }
  if ((!equippedBlock || noMoreEquippedBlock) && inventory.length >= 1) {
    equipBlock(inventory[0]);
  }

  return (
    <div>
      <Palace
        isVisible={isVisible}
        equippedBlock={equippedBlock}
        setUsedBlocks={setUsedBlocks}
      />
      <Inventory
        inventory={inventory}
        goToShop={goToShop}
        equipBlock={equipBlock}
        equipEraser={equipEraser}
        equippedBlock={equippedBlock}
      />
    </div>
  );
}

export default memo(Build);
