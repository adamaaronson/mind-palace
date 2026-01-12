import { memo, useCallback, useEffect, useState } from "react";
import Block, { type BlockProps } from "./Block";
import {
  getBlockSideHeight,
  getBlockTopHeight,
  GRID_DEPTH,
  GRID_HEIGHT,
  GRID_WIDTH,
} from "../utils/constants";
import Inventory from "./Inventory";
import {
  getShopItemCategory,
  type ShopItem,
  type ShopItemCategory,
} from "../types/shop";

const getShadowHeight = (blockWidth: number) =>
  getBlockSideHeight(blockWidth) * GRID_WIDTH * 1.1;

const getOriginX = (blockWidth: number) =>
  (GRID_DEPTH / 2) * blockWidth - blockWidth / 2;
const getOriginY = (blockWidth: number) =>
  GRID_HEIGHT * getBlockSideHeight(blockWidth);

const palaceWidthToBlockWidth = (palaceWidth: number) =>
  palaceWidth / ((GRID_WIDTH + GRID_DEPTH) / 2);

// project 3-dimensional coordinates onto isometric view
// x: to the right and down a bit
// y: up
// z: to the left and down a bit
export function getIsometricProjection(
  x: number,
  y: number,
  z: number,
  blockWidth: number
) {
  return {
    x: getOriginX(blockWidth) + (x - z) * (blockWidth / 2),
    y:
      getOriginY(blockWidth) +
      (x + z) * (getBlockTopHeight(blockWidth) / 2) -
      y * getBlockSideHeight(blockWidth),
  };
}

interface BuildProps {
  shopItems: ShopItemCategory[];
  goToShop: () => void;
}

function Build(props: BuildProps) {
  const { shopItems, goToShop } = props;
  const [blocks, setBlocks] = useState<Omit<BlockProps, "width">[]>([]);
  const [equippedBlock, setEquippedBlock] = useState<ShopItem | undefined>(
    undefined
  );

  // Maps block ID to number of times used
  const [usedBlocks, setUsedBlocks] = useState<Record<string, number>>({});

  const [blockWidth, setBlockWidth] = useState(0);
  const [palaceRef, setPalaceRef] = useState<HTMLDivElement | null>(null);

  const resizeBlock = (palaceWidth: number) => {
    setBlockWidth(palaceWidthToBlockWidth(palaceWidth));
  };

  const resizePalace = useCallback(() => {
    const palaceWidth = palaceRef?.clientWidth;
    if (palaceWidth) {
      resizeBlock(palaceWidth);
    }
  }, [palaceRef]);

  if (
    palaceRef &&
    palaceRef.checkVisibility() &&
    (blockWidth < palaceWidthToBlockWidth(palaceRef.clientWidth) * 0.99 ||
      blockWidth > palaceWidthToBlockWidth(palaceRef.clientWidth) * 1.01)
  ) {
    resizePalace();
  }

  useEffect(() => {
    window.addEventListener("resize", resizePalace);
    return () => window.removeEventListener("resize", resizePalace);
  }, [palaceRef]);

  const addBlock = (
    equippedBlock: ShopItem,
    coordinates: { x: number; y: number; z: number }
  ) => {
    setBlocks((blocks) => [
      ...blocks,
      {
        coordinates: coordinates,
        block: equippedBlock,
        addBlock: addBlock,
      },
    ]);
    setUsedBlocks((usedBlocks) => ({
      ...usedBlocks,
      [equippedBlock.id]: (usedBlocks[equippedBlock.id] || 0) + 1,
    }));
  };

  const floor: Omit<BlockProps, "width">[] = Array.from({ length: GRID_WIDTH })
    .map((_, width) =>
      Array.from({ length: GRID_DEPTH }).map((_, depth) => ({
        coordinates: { x: width, y: 0, z: depth },
        block: "block-floor.svg",
        onlyTop: true,
        erasable: false,
        addBlock: addBlock,
      }))
    )
    .flat(1);

  const leftWall: Omit<BlockProps, "width">[] = Array.from({
    length: GRID_DEPTH,
  })
    .map((_, depth) =>
      Array.from({ length: GRID_HEIGHT }).map((_, height) => ({
        coordinates: { x: -1, y: height + 1, z: depth },
        block: "block-wall-right.svg",
        onlyRight: true,
        erasable: false,
        addBlock: addBlock,
        opacity: 0.4,
      }))
    )
    .flat(1);

  const rightWall: Omit<BlockProps, "width">[] = Array.from({
    length: GRID_WIDTH,
  })
    .map((_, width) =>
      Array.from({ length: GRID_HEIGHT }).map((_, height) => ({
        coordinates: { x: width, y: height + 1, z: -1 },
        block: "block-wall-left.svg",
        onlyLeft: true,
        erasable: false,
        addBlock: addBlock,
        opacity: 0.4,
      }))
    )
    .flat(1);

  const allBlocks = [...floor, ...leftWall, ...rightWall, ...blocks];

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
      <div
        ref={setPalaceRef}
        className="relative w-full m-auto my-2 pointer-events-none"
        style={{
          contain: "paint",
          height:
            getBlockSideHeight(blockWidth) * GRID_HEIGHT +
            getBlockTopHeight(blockWidth) * Math.max(GRID_WIDTH, GRID_DEPTH) +
            getShadowHeight(blockWidth) * 0.5, // shadow space
          marginBottom: -getShadowHeight(blockWidth) * 0.5, // shadow space
        }}
      >
        {allBlocks.map((blockProps) => (
          <Block
            {...blockProps}
            equippedBlock={equippedBlock}
            width={blockWidth}
            key={`${blockProps.coordinates.x},${blockProps.coordinates.y},${blockProps.coordinates.z}`}
          />
        ))}
        <div
          className="z-0 opacity-60 rounded-full bg-radial from-0% to-50% from-text-light absolute -translate-x-1/2 pointer-events-none"
          style={{
            width: blockWidth * GRID_WIDTH * 1.2,
            height: getShadowHeight(blockWidth),
            left: getOriginX(blockWidth) + blockWidth / 2,
            top: getOriginY(blockWidth),
          }}
        />
      </div>
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
