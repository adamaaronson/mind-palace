import { FLOOR, WALL_LEFT, WALL_RIGHT } from "../types/shop";
import { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../utils/constants";
import type { BlockProps } from "./Block";
import Block from "./Block";

interface PalaceWallsProps {
  addBlock: BlockProps["addBlock"];
  equippedBlock?: BlockProps["equippedBlock"];
}

export default function PalaceWalls(props: PalaceWallsProps) {
  const { addBlock, equippedBlock } = props;
  const floor: BlockProps[] = Array.from({ length: GRID_WIDTH })
    .map((_, width) =>
      Array.from({ length: GRID_DEPTH }).map((_, depth) => ({
        coordinates: { x: width, y: 0, z: depth },
        block: FLOOR,
        onlyTop: true,
        isErasable: false,
        addBlock: addBlock,
      })),
    )
    .flat(1);

  const leftWall: BlockProps[] = Array.from({
    length: GRID_DEPTH,
  })
    .map((_, depth) =>
      Array.from({ length: GRID_HEIGHT }).map((_, height) => ({
        coordinates: { x: -1, y: height + 1, z: depth },
        block: WALL_RIGHT,
        onlyRight: true,
        isErasable: false,
        addBlock: addBlock,
        opacity: 0.4,
      })),
    )
    .flat(1);

  const rightWall: BlockProps[] = Array.from({
    length: GRID_WIDTH,
  })
    .map((_, width) =>
      Array.from({ length: GRID_HEIGHT }).map((_, height) => ({
        coordinates: { x: width, y: height + 1, z: -1 },
        block: WALL_LEFT,
        onlyLeft: true,
        isErasable: false,
        addBlock: addBlock,
        opacity: 0.4,
      })),
    )
    .flat(1);

  return (
    <>
      {[...floor, ...leftWall, ...rightWall].map((blockProps) => (
        <Block
          {...blockProps}
          equippedBlock={equippedBlock}
          key={`${blockProps.coordinates.x},${blockProps.coordinates.y},${blockProps.coordinates.z}`}
        />
      ))}
    </>
  );
}
