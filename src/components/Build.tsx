import { memo, useCallback, useEffect, useState } from "react";
import Block, { type BlockProps } from "./Block";
import Link from "./Link";
import LinkButton from "./LinkButton";

export const GRID_WIDTH = 11;
export const GRID_DEPTH = 11;
export const GRID_HEIGHT = 11;

const getTopHeight = (blockWidth: number) => (blockWidth / 36) * 18;
const getSideHeight = (blockWidth: number) => (blockWidth / 36) * 22;
export const getBlockHeight = (blockWidth: number) => (blockWidth / 36) * 40;

const getOriginX = (blockWidth: number) =>
  (GRID_DEPTH / 2) * blockWidth - blockWidth / 2;
const getOriginY = (blockWidth: number) =>
  GRID_HEIGHT * getSideHeight(blockWidth);

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
      (x + z) * (getTopHeight(blockWidth) / 2) -
      y * getSideHeight(blockWidth),
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

  const resizePalace = useCallback(() => {
    const palaceWidth = palaceRef?.clientWidth;
    setBlockWidth(
      palaceWidth ? palaceWidth / Math.max(GRID_WIDTH, GRID_DEPTH) : 0
    );
  }, [palaceRef]);

  useEffect(() => {
    resizePalace();

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
        className="relative w-full m-auto my-2"
        style={
          blockWidth === 0
            ? {}
            : {
                height:
                  getSideHeight(blockWidth) * GRID_HEIGHT +
                  getTopHeight(blockWidth) * Math.max(GRID_WIDTH, GRID_DEPTH),
              }
        }
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
            height: getSideHeight(blockWidth) * GRID_WIDTH * 1.1,
            left: getOriginX(blockWidth) + blockWidth / 2,
            top: getOriginY(blockWidth),
          }}
        />
      </div>
      <h3 className="text-text-dark font-bold text-xl -mt-2 mb-2 ml-3">
        Inventory
      </h3>
      <div className="border-2 border-border rounded-2xl bg-light-light p-4">
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
