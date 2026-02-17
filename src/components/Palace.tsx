import { memo, useState } from "react";
import {
  BLOCK_SIDE_HEIGHT,
  BLOCK_TOP_HEIGHT,
  BLOCK_WIDTH,
  GRID_DEPTH,
  GRID_HEIGHT,
  GRID_WIDTH,
  ORIGIN_X,
  ORIGIN_Y,
  PALACE_SHADOW_HEIGHT,
} from "../utils/constants";
import { type Inventory, type ShopItem } from "../types/shop";
import type { BlockProps } from "./Block";
import Block from "./Block";
import PalaceWalls from "./PalaceWalls";
import { isEqual } from "lodash";
import type { Coordinates } from "../types/coordinates";
import { cqw } from "../utils/utils";

// project 3-dimensional coordinates onto isometric view
// x: to the right and down a bit
// y: up
// z: to the left and down a bit
export function getIsometricProjection(coordinates: Coordinates) {
  const { x, y, z } = coordinates;
  return {
    x: ORIGIN_X + (x - z) * (BLOCK_WIDTH / 2),
    y: ORIGIN_Y + (x + z) * (BLOCK_TOP_HEIGHT / 2) - y * BLOCK_SIDE_HEIGHT,
  };
}

interface PalaceProps {
  equippedBlock?: ShopItem;
  setUsedBlocks: React.Dispatch<React.SetStateAction<Inventory>>;
}

function Palace(props: PalaceProps) {
  const { equippedBlock, setUsedBlocks } = props;
  const [blocks, setBlocks] = useState<BlockProps[]>([]);

  const addBlock = (equippedBlock: ShopItem, coordinates: Coordinates) => {
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

  const removeBlock = (coordinates: Coordinates) => {
    const blockToRemove = blocks.find((block) =>
      isEqual(coordinates, block.coordinates),
    );
    if (!blockToRemove) {
      return;
    }

    setBlocks((blocks) =>
      blocks.filter((block) => !isEqual(coordinates, block.coordinates)),
    );
    setUsedBlocks((usedBlocks) => ({
      ...usedBlocks,
      [blockToRemove.block.id]: (usedBlocks[blockToRemove.block.id] || 0) - 1,
    }));
  };

  return (
    <div className="relative w-full m-auto pb-8 pointer-events-none contain-paint @container">
      <PalaceWalls addBlock={addBlock} equippedBlock={equippedBlock} />
      {blocks.map((blockProps) => (
        <Block
          {...blockProps}
          removeBlock={removeBlock}
          equippedBlock={equippedBlock}
          key={`${blockProps.coordinates.x},${blockProps.coordinates.y},${blockProps.coordinates.z}`}
        />
      ))}
      <div
        style={{
          height: cqw(
            BLOCK_SIDE_HEIGHT * GRID_HEIGHT +
              BLOCK_TOP_HEIGHT * ((GRID_WIDTH + GRID_DEPTH) / 2) +
              PALACE_SHADOW_HEIGHT * 0.5,
          ),
          marginBottom: cqw(-PALACE_SHADOW_HEIGHT * 0.5),
        }}
      />
      <div
        className="z-0 opacity-60 rounded-full bg-radial from-0% to-50% from-text-light absolute -translate-x-1/2 pointer-events-none"
        style={{
          width: cqw(BLOCK_WIDTH * GRID_WIDTH * 1.2),
          height: cqw(PALACE_SHADOW_HEIGHT),
          left: cqw(ORIGIN_X + BLOCK_WIDTH / 2),
          top: cqw(ORIGIN_Y),
        }}
      />
    </div>
  );
}

export default memo(Palace);
