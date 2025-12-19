import { useState } from "react";
import Block, { type BlockProps } from "./Block";

const GRID_WIDTH = 11;
const GRID_DEPTH = 11;
const GRID_HEIGHT = 11;

const BLOCK_TOP_HEIGHT = 18;
const BLOCK_SIDE_HEIGHT = 22;
const BLOCK_WIDTH = 36;

const ORIGIN_X = (GRID_DEPTH / 2) * BLOCK_WIDTH - BLOCK_WIDTH / 2;
const ORIGIN_Y = GRID_HEIGHT * BLOCK_SIDE_HEIGHT;

// project 3-dimensional coordinates onto isometric view
// x: to the right and down a bit
// y: up
// z: to the left and down a bit
export function getIsometricProjection(x: number, y: number, z: number) {
  return {
    x: ORIGIN_X + (x - z) * (BLOCK_WIDTH / 2),
    y: ORIGIN_Y + (x + z) * (BLOCK_TOP_HEIGHT / 2) - y * BLOCK_SIDE_HEIGHT,
  };
}

export default function Palace() {
  const [blocks, setBlocks] = useState<BlockProps[]>([]);

  const addBlock = (coordinates: { x: number; y: number; z: number }) => {
    setBlocks((blocks) => [
      ...blocks,
      {
        coordinates: coordinates,
        skinUrl: "block.svg",
        addBlock: addBlock,
      },
    ]);
  };

  const floor: BlockProps[] = Array.from({ length: GRID_WIDTH })
    .map((_, width) =>
      Array.from({ length: GRID_DEPTH }).map((_, depth) => ({
        coordinates: { x: width, y: 0, z: depth },
        skinUrl: "block-floor.svg",
        onlyTop: true,
        addBlock: addBlock,
      }))
    )
    .flat(1);

  return (
    <div className="p-4 pl-8 mb-4 bg-light mx-4 border-2 border-border overflow-hidden">
      <h3 className="text-2xl font-bold mb-2">Build</h3>
      <div className="h-120 relative">
        {[...floor, ...blocks].map((blockProps) => (
          <Block
            {...blockProps}
            key={`${blockProps.coordinates.x},${blockProps.coordinates.y},${blockProps.coordinates.z}`}
          />
        ))}
        <div
          className="z-0 opacity-50 rounded-full bg-radial from-0% to-50% from-text-light to-light absolute -translate-x-1/2"
          style={{
            width: BLOCK_WIDTH * GRID_WIDTH * 1.2,
            height: BLOCK_SIDE_HEIGHT * GRID_WIDTH * 1.1,
            left: ORIGIN_X + BLOCK_WIDTH / 2,
            top: ORIGIN_Y,
          }}
        />
      </div>
    </div>
  );
}
