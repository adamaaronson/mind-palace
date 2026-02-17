import { memo } from "react";
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
import { getShopItem, type ShopItem } from "../types/shop";
import type { BlockData } from "./Block";
import Block from "./Block";
import PalaceWalls from "./PalaceWalls";
import type { Coordinates } from "../types/coordinates";
import { cqw } from "../utils/utils";

interface PalaceProps {
  equippedBlock?: ShopItem;
  blocks: BlockData[];
  addBlock: (coordinates: Coordinates) => void;
  removeBlock: (coordinates: Coordinates) => void;
}

function Palace(props: PalaceProps) {
  const { equippedBlock, blocks, addBlock, removeBlock } = props;

  return (
    <div className="relative w-full m-auto pb-8 pointer-events-none contain-paint @container">
      <PalaceWalls addBlock={addBlock} equippedBlock={equippedBlock} />
      {blocks.map(({ coordinates, blockId }) => (
        <Block
          coordinates={coordinates}
          block={getShopItem(blockId)}
          addBlock={addBlock}
          removeBlock={removeBlock}
          equippedBlock={equippedBlock}
          key={`${coordinates.x},${coordinates.y},${coordinates.z}`}
        />
      ))}
      {/* dummy div to make the palace height offset correctly using cqw */}
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
