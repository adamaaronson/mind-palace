import { memo, useCallback, useState } from "react";

import Inventory from "./Inventory";
import {
  getShopItemCategory,
  type ShopItem,
  type ShopItemCategory,
} from "../types/shop";
import Palace from "./Palace";

interface BuildProps {
  isVisible: boolean;
  shopItems: ShopItemCategory[];
  goToShop: () => void;
}

function Build(props: BuildProps) {
  const { isVisible, shopItems, goToShop } = props;
  const [equippedBlock, setEquippedBlock] = useState<ShopItem | undefined>(
    undefined
  );
  const [usedBlocks, setUsedBlocks] = useState<Record<string, number>>({});

  const equipBlock = useCallback((block: ShopItem) => {
    setEquippedBlock(block);
  }, []);

  const inventory = getShopItemCategory(shopItems, "blocks")!
    .items.map((item) => ({
      ...item,
      level: item.level - (usedBlocks[item.id] || 0),
    }))
    .filter((item) => item.level > 0);
  const noMoreEquippedBlock =
    equippedBlock &&
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
        equippedBlock={equippedBlock}
      />
    </div>
  );
}

export default memo(Build);
