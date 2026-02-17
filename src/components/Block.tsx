import { useState } from "react";
import { BlockLeft, BlockRight, BlockTop } from "./BlockFace";
import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  GRID_DEPTH,
  GRID_HEIGHT,
  GRID_WIDTH,
} from "../utils/constants";
import { ERASER, type ShopItem } from "../types/shop";
import type { Coordinates } from "../types/coordinates";
import { cqw, getIsometricProjection } from "../utils/utils";

export interface BlockProps {
  coordinates: Coordinates;
  block: ShopItem;
  equippedBlock?: ShopItem;
  addBlock?: (coordinates: Coordinates) => void;
  removeBlock?: (coordinates: Coordinates) => void;
  onlyTop?: boolean;
  onlyLeft?: boolean;
  onlyRight?: boolean;
  isGhost?: boolean;
  isErasable?: boolean;
  opacity?: number;
}

export interface BlockData {
  coordinates: Coordinates;
  blockId: string;
}

export default function Block(props: BlockProps) {
  const {
    coordinates: { x, y, z },
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

  const { x: left, y: top } = getIsometricProjection({ x, y, z });

  const isErasing = equippedBlock?.id === ERASER.id;
  const isHoveringErasing =
    (hasRightGhost || hasTopGhost || hasLeftGhost) && isErasing && isErasable;
  const isClickingForbidden = !equippedBlock || (isErasing && !isErasable);

  const addAdjacentBlock = (coordinates: Coordinates) =>
    addBlock && !isErasing && equippedBlock
      ? () => addBlock(coordinates)
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
          left: cqw(left),
          top: cqw(top),
          zIndex: x + y + z + 1,
          pointerEvents: "none",
          opacity: isGhost || isHoveringErasing ? 0.5 : opacity,
          width: cqw(BLOCK_WIDTH),
          height: cqw(BLOCK_HEIGHT),
          minWidth: cqw(BLOCK_WIDTH),
        }}
      >
        <img
          src={typeof block === "string" ? block : block.image}
          width="100%"
        />
      </div>

      {/* Hoverable block right */}
      {!onlyLeft && !onlyTop && !isGhost && (
        <div
          className="absolute select-none"
          style={{
            left: cqw(left),
            top: cqw(top),
            zIndex: x + y + z + 1,
            cursor:
              (!isErasing && isRight) || isClickingForbidden
                ? "not-allowed"
                : "pointer",
            pointerEvents: "none",
            width: cqw(BLOCK_WIDTH),
            height: cqw(BLOCK_HEIGHT),
            minWidth: cqw(BLOCK_WIDTH),
          }}
        >
          <BlockRight
            onMouseEnter={() => setHasRightGhost(true)}
            onMouseLeave={() => setHasRightGhost(false)}
            onClick={() =>
              isHoveringErasing ? removeBlock?.({ x, y, z }) : addRightBlock()
            }
            disabled={!isErasing && isRight}
          />
        </div>
      )}

      {/* Hoverable block top */}
      {!onlyLeft && !onlyRight && !isGhost && (
        <div
          className="absolute select-none"
          style={{
            left: cqw(left),
            top: cqw(top),
            zIndex: x + y + z + 1,
            cursor:
              (!isErasing && isTop) || isClickingForbidden
                ? "not-allowed"
                : "pointer",
            pointerEvents: "none",
            width: cqw(BLOCK_WIDTH),
            height: cqw(BLOCK_HEIGHT),
            minWidth: cqw(BLOCK_WIDTH),
          }}
        >
          <BlockTop
            onMouseEnter={() => setHasTopGhost(true)}
            onMouseLeave={() => setHasTopGhost(false)}
            onClick={() =>
              isHoveringErasing ? removeBlock?.({ x, y, z }) : addTopBlock()
            }
            disabled={!isErasing && isTop}
          />
        </div>
      )}

      {/* Hoverable block left */}
      {!onlyRight && !onlyTop && !isGhost && (
        <div
          className="absolute select-none"
          style={{
            left: cqw(left),
            top: cqw(top),
            zIndex: x + y + z + 1,
            cursor:
              (!isErasing && isLeft) || isClickingForbidden
                ? "not-allowed"
                : "pointer",
            pointerEvents: "none",
            width: cqw(BLOCK_WIDTH),
            height: cqw(BLOCK_HEIGHT),
            minWidth: cqw(BLOCK_WIDTH),
          }}
        >
          <BlockLeft
            onMouseEnter={() => setHasLeftGhost(true)}
            onMouseLeave={() => setHasLeftGhost(false)}
            onClick={() =>
              isHoveringErasing ? removeBlock?.({ x, y, z }) : addLeftBlock()
            }
            disabled={!isErasing && isLeft}
          />
        </div>
      )}

      {hasRightGhost && equippedBlock && !isErasing && (
        <Block coordinates={{ x: x + 1, y, z }} block={equippedBlock} isGhost />
      )}
      {hasTopGhost && equippedBlock && !isErasing && (
        <Block coordinates={{ x, y: y + 1, z }} block={equippedBlock} isGhost />
      )}
      {hasLeftGhost && equippedBlock && !isErasing && (
        <Block coordinates={{ x, y, z: z + 1 }} block={equippedBlock} isGhost />
      )}
    </>
  );
}
