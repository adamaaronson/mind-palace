import { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../utils/constants";
import type { BlockProps } from "./Block";
import Block from "./Block";

interface PalaceWallsProps {
  addBlock: BlockProps["addBlock"];
  blockWidth: number;
  equippedBlock?: BlockProps["equippedBlock"];
}

export default function PalaceWalls(props: PalaceWallsProps) {
  const { addBlock, blockWidth, equippedBlock } = props;
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

  return (
    <>
      {[...floor, ...leftWall, ...rightWall].map((blockProps) => (
        <Block
          {...blockProps}
          equippedBlock={equippedBlock}
          width={blockWidth}
          key={`${blockProps.coordinates.x},${blockProps.coordinates.y},${blockProps.coordinates.z}`}
        />
      ))}
    </>
  );
}
