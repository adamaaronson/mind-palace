import { useState } from "react";
import { BlockLeft, BlockRight, BlockTop } from "./BlockFace";
import { getIsometricProjection } from "./Palace";
import { GRID_DEPTH, GRID_HEIGHT, GRID_WIDTH } from "../utils/constants";
import { ERASER, type ShopItem } from "../types/shop";

export interface BlockProps {
  coordinates: { x: number; y: number; z: number };
  width: number;
  block: ShopItem;
  equippedBlock?: ShopItem;
  addBlock?: (
    block: ShopItem,
    coordinates: { x: number; y: number; z: number }
  ) => void;
  removeBlock?: (coordinates: { x: number; y: number; z: number }) => void;
  onlyTop?: boolean;
  onlyLeft?: boolean;
  onlyRight?: boolean;
  isGhost?: boolean;
  isErasable?: boolean;
  opacity?: number;
}

export default function Block(props: BlockProps) {
  const {
    coordinates: { x, y, z },
    width,
    block,
    equippedBlock,
    addBlock,
    removeBlock,
    onlyTop = false,
    onlyLeft = false,
    onlyRight = false,
    isGhost = false,
    isErasable = true,
    opacity = 1,
  } = props;

  const [hasRightGhost, setHasRightGhost] = useState(false);
  const [hasTopGhost, setHasTopGhost] = useState(false);
  const [hasLeftGhost, setHasLeftGhost] = useState(false);

  const { x: left, y: top } = getIsometricProjection(x, y, z, width);

  const isErasing = equippedBlock?.id === ERASER.id;
  const isHoveringErasing =
    (hasRightGhost || hasTopGhost || hasLeftGhost) && isErasing && isErasable;
  const isClickingForbidden = !equippedBlock || (isErasing && !isErasable);

  const addAdjacentBlock = (coordinates: { x: number; y: number; z: number }) =>
    addBlock && !isErasing && equippedBlock
      ? () => addBlock(equippedBlock, coordinates)
      : () => {};

  const addRightBlock = addAdjacentBlock({ x: x + 1, y, z });
  const addTopBlock = addAdjacentBlock({ x, y: y + 1, z });
  const addLeftBlock = addAdjacentBlock({ x, y, z: z + 1 });

  const isRight = x === GRID_WIDTH - 1;
  const isTop = y === GRID_HEIGHT;
  const isLeft = z === GRID_DEPTH - 1;

  return (
    <>
      {/* Visible block */}
      <div
        className="absolute select-none"
        style={{
          left: left,
          top: top,
          zIndex: x + y + z + 1,
          pointerEvents: "none",
          opacity: isGhost || isHoveringErasing ? 0.5 : opacity,
          width: width,
          minWidth: width,
        }}
      >
        <img
          src={typeof block === "string" ? block : block.image}
          width={width}
        />
      </div>

      {/* Hoverable block right */}
      {!onlyLeft && !onlyTop && !isGhost && (
        <div
          className="absolute select-none"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z + 1,
            cursor: isRight || isClickingForbidden ? "not-allowed" : "pointer",
            pointerEvents: "none",
            width: width,
            minWidth: width,
          }}
        >
          <BlockRight
            onMouseEnter={() => setHasRightGhost(true)}
            onMouseLeave={() => setHasRightGhost(false)}
            onClick={() =>
              isHoveringErasing ? removeBlock?.({ x, y, z }) : addRightBlock()
            }
            disabled={isRight}
            width={width}
          />
        </div>
      )}

      {/* Hoverable block top */}
      {!onlyLeft && !onlyRight && !isGhost && (
        <div
          className="absolute select-none"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z + 1,
            cursor: isTop || isClickingForbidden ? "not-allowed" : "pointer",
            pointerEvents: "none",
            width: width,
            minWidth: width,
          }}
        >
          <BlockTop
            onMouseEnter={() => setHasTopGhost(true)}
            onMouseLeave={() => setHasTopGhost(false)}
            onClick={() =>
              isHoveringErasing ? removeBlock?.({ x, y, z }) : addTopBlock()
            }
            disabled={isTop}
            width={width}
          />
        </div>
      )}

      {/* Hoverable block left */}
      {!onlyRight && !onlyTop && !isGhost && (
        <div
          className="absolute select-none"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z + 1,
            cursor: isLeft || isClickingForbidden ? "not-allowed" : "pointer",
            pointerEvents: "none",
            width: width,
            minWidth: width,
          }}
        >
          <BlockLeft
            onMouseEnter={() => setHasLeftGhost(true)}
            onMouseLeave={() => setHasLeftGhost(false)}
            onClick={() =>
              isHoveringErasing ? removeBlock?.({ x, y, z }) : addLeftBlock()
            }
            disabled={isLeft}
            width={width}
          />
        </div>
      )}

      {hasRightGhost && equippedBlock && !isErasing && (
        <Block
          coordinates={{ x: x + 1, y, z }}
          width={width}
          block={equippedBlock}
          isGhost
        />
      )}
      {hasTopGhost && equippedBlock && !isErasing && (
        <Block
          coordinates={{ x, y: y + 1, z }}
          width={width}
          block={equippedBlock}
          isGhost
        />
      )}
      {hasLeftGhost && equippedBlock && !isErasing && (
        <Block
          coordinates={{ x, y, z: z + 1 }}
          width={width}
          block={equippedBlock}
          isGhost
        />
      )}
    </>
  );
}
