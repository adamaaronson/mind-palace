import { useState } from "react";
import { BlockLeft, BlockRight, BlockTop } from "./BlockFace";
import { BLOCK_WIDTH, getIsometricProjection } from "./Palace";

export interface BlockProps {
  coordinates: { x: number; y: number; z: number };
  skinUrl: string;
  addBlock?: (coordinates: { x: number; y: number; z: number }) => void;
  onlyTop?: boolean;
  onlyLeft?: boolean;
  onlyRight?: boolean;
  isGhost?: boolean;
}

export default function Block(props: BlockProps) {
  const {
    coordinates: { x, y, z },
    skinUrl,
    addBlock,
    onlyTop = false,
    onlyLeft = false,
    onlyRight = false,
    isGhost = false,
  } = props;

  const [hasRightGhost, setHasRightGhost] = useState(false);
  const [hasTopGhost, setHasTopGhost] = useState(false);
  const [hasLeftGhost, setHasLeftGhost] = useState(false);

  const { x: left, y: top } = getIsometricProjection(x, y, z);

  const addRightBlock = () => addBlock?.({ x: x + 1, y, z });
  const addTopBlock = () => addBlock?.({ x, y: y + 1, z });
  const addLeftBlock = () => addBlock?.({ x, y, z: z + 1 });

  return (
    <>
      {/* Visible block */}
      <div
        className="absolute"
        style={{
          left: left,
          top: top,
          zIndex: x + y + z + 1,
          pointerEvents: "none",
          opacity: isGhost ? 0.5 : 1,
          width: BLOCK_WIDTH,
          minWidth: BLOCK_WIDTH,
        }}
      >
        <img src={skinUrl} />
      </div>

      {/* Hoverable block right */}
      {!onlyLeft && !onlyTop && !isGhost && (
        <div
          className="absolute"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z + 1,
            cursor: "pointer",
            pointerEvents: "none",
            width: BLOCK_WIDTH,
            minWidth: BLOCK_WIDTH,
          }}
        >
          <BlockRight
            onMouseEnter={() => setHasRightGhost(true)}
            onMouseLeave={() => setHasRightGhost(false)}
            onClick={() => addRightBlock()}
          />
        </div>
      )}

      {/* Hoverable block top */}
      {!onlyLeft && !onlyRight && !isGhost && (
        <div
          className="absolute"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z + 1,
            cursor: "pointer",
            pointerEvents: "none",
            width: BLOCK_WIDTH,
            minWidth: BLOCK_WIDTH,
          }}
        >
          <BlockTop
            onMouseEnter={() => setHasTopGhost(true)}
            onMouseLeave={() => setHasTopGhost(false)}
            onClick={() => addTopBlock()}
          />
        </div>
      )}

      {/* Hoverable block left */}
      {!onlyRight && !onlyTop && !isGhost && (
        <div
          className="absolute"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z + 1,
            cursor: "pointer",
            pointerEvents: "none",
            width: BLOCK_WIDTH,
            minWidth: BLOCK_WIDTH,
          }}
        >
          <BlockLeft
            onMouseEnter={() => setHasLeftGhost(true)}
            onMouseLeave={() => setHasLeftGhost(false)}
            onClick={() => addLeftBlock()}
          />
        </div>
      )}

      {hasRightGhost && (
        <Block coordinates={{ x: x + 1, y, z }} skinUrl="block.svg" isGhost />
      )}
      {hasTopGhost && (
        <Block coordinates={{ x, y: y + 1, z }} skinUrl="block.svg" isGhost />
      )}

      {hasLeftGhost && (
        <Block coordinates={{ x, y, z: z + 1 }} skinUrl="block.svg" isGhost />
      )}
    </>
  );
}
