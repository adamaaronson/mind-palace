import { memo, useCallback, useEffect, useMemo } from "react";

import BuildInventory from "./BuildInventory";
import {
  ERASER,
  getShopItem,
  type Inventory,
  type ShopItem,
} from "../types/shop";
import Palace from "./Palace";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { BlockData } from "./Block";
import { isEqual } from "lodash";
import type { Coordinates } from "../types/coordinates";

interface BuildProps {
  isVisible: boolean;
  inventory: Inventory;
  goToShop: () => void;
  equippedBlock: ShopItem | undefined;
  setEquippedBlock: React.Dispatch<React.SetStateAction<ShopItem | undefined>>;
}

function Build(props: BuildProps) {
  const { inventory, goToShop, equippedBlock, setEquippedBlock } = props;
  const [palaceBlocks, setPalaceBlocks] = useLocalStorage<BlockData[]>(
    "palace-blocks",
    [],
  );

  const equipBlock = useCallback((block: ShopItem) => {
    setEquippedBlock(block);
  }, []);

  const equipEraser = useCallback(() => {
    setEquippedBlock(ERASER);
  }, []);

  const unusedBlocks: Inventory = useMemo(() => {
    const counts = Object.fromEntries(
      Object.entries(inventory).filter(
        ([blockId]) => getShopItem(blockId).categoryId === "blocks",
      ),
    );

    palaceBlocks.forEach(({ blockId }) => (counts[blockId] -= 1));

    return Object.fromEntries(
      Object.entries(counts).filter(([, count]) => count > 0),
    );
  }, [inventory, palaceBlocks]);

  useEffect(() => {
    const noMoreEquippedBlock =
      equippedBlock &&
      equippedBlock.id !== ERASER.id &&
      !unusedBlocks[equippedBlock.id];

    if (equippedBlock && noMoreEquippedBlock) {
      setEquippedBlock(undefined);
    }

    if (
      (!equippedBlock || noMoreEquippedBlock) &&
      Object.keys(unusedBlocks).length >= 1
    ) {
      setEquippedBlock(getShopItem(Object.keys(unusedBlocks)[0])!);
    }
  }, [equippedBlock, unusedBlocks, setEquippedBlock]);

  const addBlock = (coordinates: Coordinates) => {
    if (!equippedBlock) {
      return;
    }
    setPalaceBlocks((palaceBlocks) => [
      ...palaceBlocks,
      {
        coordinates: coordinates,
        blockId: equippedBlock.id,
      },
    ]);
  };

  const removeBlock = (coordinates: Coordinates) => {
    const blockToRemove = palaceBlocks.find((block) =>
      isEqual(coordinates, block.coordinates),
    );
    if (!blockToRemove) {
      return;
    }

    setPalaceBlocks((palaceBlocks) =>
      palaceBlocks.filter((block) => !isEqual(coordinates, block.coordinates)),
    );
  };

  return (
    <div>
      <Palace
        equippedBlock={equippedBlock}
        blocks={palaceBlocks}
        addBlock={addBlock}
        removeBlock={removeBlock}
      />
      <BuildInventory
        inventory={unusedBlocks}
        goToShop={goToShop}
        equipBlock={equipBlock}
        equipEraser={equipEraser}
        equippedBlock={equippedBlock}
      />
    </div>
  );
}

export default memo(Build);
