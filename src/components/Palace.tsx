import { memo, useCallback, useEffect, useState } from "react";
import {
  getBlockSideHeight,
  getBlockTopHeight,
  GRID_DEPTH,
  GRID_HEIGHT,
  GRID_WIDTH,
} from "../utils/constants";
import { ERASER, type ShopItem } from "../types/shop";
import type { BlockProps } from "./Block";
import Block from "./Block";
import PalaceWalls from "./PalaceWalls";
import { approximatelyEqual } from "../utils/utils";
import { isEqual } from "lodash";

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

interface PalaceProps {
  isVisible: boolean;
  equippedBlock?: ShopItem;
  setUsedBlocks: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

function Palace(props: PalaceProps) {
  const { isVisible, equippedBlock, setUsedBlocks } = props;
  const [blocks, setBlocks] = useState<Omit<BlockProps, "width">[]>([]);

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

  useEffect(() => {
    if (palaceRef) {
      resizePalace();
    }
  }, [palaceRef, resizePalace, isVisible]);

  useEffect(() => {
    window.addEventListener("resize", resizePalace);
    return () => window.removeEventListener("resize", resizePalace);
  }, [resizePalace]);

  if (
    palaceRef &&
    palaceRef.checkVisibility() &&
    blockWidth > 0 &&
    !approximatelyEqual(
      blockWidth,
      palaceWidthToBlockWidth(palaceRef.clientWidth)
    )
  ) {
    resizePalace();
  }

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

  const removeBlock = (coordinates: { x: number; y: number; z: number }) => {
    const blockToRemove = blocks.find((block) =>
      isEqual(coordinates, block.coordinates)
    );
    if (!blockToRemove) {
      return;
    }

    setBlocks((blocks) =>
      blocks.filter((block) => !isEqual(coordinates, block.coordinates))
    );
    setUsedBlocks((usedBlocks) => ({
      ...usedBlocks,
      [blockToRemove.block.id]: (usedBlocks[blockToRemove.block.id] || 0) - 1,
    }));
  };

  return (
    <div
      ref={setPalaceRef}
      className="relative w-full m-auto my-2 pointer-events-none"
      style={{
        contain: "paint",
        height:
          getBlockSideHeight(blockWidth) * GRID_HEIGHT +
          getBlockTopHeight(blockWidth) * Math.max(GRID_WIDTH, GRID_DEPTH) +
          getShadowHeight(blockWidth) * 0.5,
        marginBottom: -getShadowHeight(blockWidth) * 0.5,
      }}
    >
      <PalaceWalls
        addBlock={addBlock}
        blockWidth={blockWidth}
        equippedBlock={equippedBlock}
      />
      {blocks.map((blockProps) => (
        <Block
          {...blockProps}
          removeBlock={removeBlock}
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
  );
}

export default memo(Palace);
