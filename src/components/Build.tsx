import { memo, useCallback, useEffect, useState } from "react";
import Block, { type BlockProps } from "./Block";
import LinkButton from "./LinkButton";
import {
  getBlockSideHeight,
  getBlockTopHeight,
  GRID_DEPTH,
  GRID_HEIGHT,
  GRID_WIDTH,
} from "../utils/constants";

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
  inventory: { id: string; count: number }[];
  goToShop: () => void;
}

function Build(props: BuildProps) {
  const { inventory, goToShop } = props;
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

  const floor: Omit<BlockProps, "width">[] = Array.from({ length: GRID_WIDTH })
    .map((_, width) =>
      Array.from({ length: GRID_DEPTH }).map((_, depth) => ({
        coordinates: { x: width, y: 0, z: depth },
        skinUrl: "block-floor.svg",
        onlyTop: true,
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
        skinUrl: "block-wall-right.svg",
        onlyRight: true,
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
        skinUrl: "block-wall-left.svg",
        onlyLeft: true,
        addBlock: addBlock,
        opacity: 0.4,
      }))
    )
    .flat(1);

  const allBlocks = [...floor, ...leftWall, ...rightWall, ...blocks];

  return (
    <div>
      <div
        ref={(ref) => setPalaceRef(ref)}
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
      <h3 className="text-text-dark font-bold text-xl -mt-2 mb-2 ml-3">
        Inventory
      </h3>
      <div className="border-standard rounded-2xl bg-light-light p-4">
        {inventory.length === 0 ? (
          <p className="text-sm text-text-light text-center">
            You don't have any blocks! Buy some in the{" "}
            <LinkButton onClick={goToShop}>shop</LinkButton>.
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default memo(Build);
