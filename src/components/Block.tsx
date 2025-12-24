import { useState } from "react";
import { BlockLeft, BlockRight, BlockTop } from "./BlockFace";
import {
  getIsometricProjection,
  GRID_DEPTH,
  GRID_HEIGHT,
  GRID_WIDTH,
} from "./Palace";

export interface BlockProps {
  coordinates: { x: number; y: number; z: number };
  width: number;
  skinUrl: string;
  addBlock?: (coordinates: { x: number; y: number; z: number }) => void;
  onlyTop?: boolean;
  onlyLeft?: boolean;
  onlyRight?: boolean;
  isGhost?: boolean;
  opacity?: number;
}

export default function Block(props: BlockProps) {
  const {
    coordinates: { x, y, z },
    width,
    skinUrl,
    addBlock,
    onlyTop = false,
    onlyLeft = false,
    onlyRight = false,
    isGhost = false,
    opacity = 1,
  } = props;

  const [hasRightGhost, setHasRightGhost] = useState(false);
  const [hasTopGhost, setHasTopGhost] = useState(false);
  const [hasLeftGhost, setHasLeftGhost] = useState(false);

  const { x: left, y: top } = getIsometricProjection(x, y, z, width);

  const addRightBlock = () => addBlock?.({ x: x + 1, y, z });
  const addTopBlock = () => addBlock?.({ x, y: y + 1, z });
  const addLeftBlock = () => addBlock?.({ x, y, z: z + 1 });

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
          opacity: isGhost ? 0.5 : opacity,
          width: width,
          minWidth: width,
        }}
      >
        <img src={skinUrl} width={width} />
      </div>

      {/* Hoverable block right */}
      {!onlyLeft && !onlyTop && !isGhost && (
        <div
          className="absolute select-none"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z + 1,
            cursor: isRight ? "not-allowed" : "pointer",
            pointerEvents: "none",
            width: width,
            minWidth: width,
          }}
        >
          <BlockRight
            onMouseEnter={() => setHasRightGhost(true)}
            onMouseLeave={() => setHasRightGhost(false)}
            onClick={() => addRightBlock()}
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
            cursor: isTop ? "not-allowed" : "pointer",
            pointerEvents: "none",
            width: width,
            minWidth: width,
          }}
        >
          <BlockTop
            onMouseEnter={() => setHasTopGhost(true)}
            onMouseLeave={() => setHasTopGhost(false)}
            onClick={() => addTopBlock()}
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
            cursor: isLeft ? "not-allowed" : "pointer",
            pointerEvents: "none",
            width: width,
            minWidth: width,
          }}
        >
          <BlockLeft
            onMouseEnter={() => setHasLeftGhost(true)}
            onMouseLeave={() => setHasLeftGhost(false)}
            onClick={() => addLeftBlock()}
            disabled={isLeft}
            width={width}
          />
        </div>
      )}

      {hasRightGhost && (
        <Block
          coordinates={{ x: x + 1, y, z }}
          width={width}
          skinUrl="block.svg"
          isGhost
        />
      )}
      {hasTopGhost && (
        <Block
          coordinates={{ x, y: y + 1, z }}
          width={width}
          skinUrl="block.svg"
          isGhost
        />
      )}
      {hasLeftGhost && (
        <Block
          coordinates={{ x, y, z: z + 1 }}
          width={width}
          skinUrl="block.svg"
          isGhost
        />
      )}
    </>
  );
}
