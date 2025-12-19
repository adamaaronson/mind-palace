import { useState } from "react";
import { BlockLeft, BlockRight, BlockTop } from "./BlockFace";
import { getIsometricProjection } from "./Palace";

export interface BlockProps {
  coordinates: { x: number; y: number; z: number };
  skinUrl: string;
  addBlock?: (coordinates: { x: number; y: number; z: number }) => void;
  onlyTop?: boolean;
  isGhost?: boolean;
}

export default function Block(props: BlockProps) {
  const {
    coordinates: { x, y, z },
    skinUrl,
    addBlock,
    onlyTop = false,
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
          zIndex: x + y + z,
          pointerEvents: "none",
          opacity: isGhost ? 0.5 : 1,
        }}
      >
        <img src={skinUrl} />
      </div>

      {/* Hoverable block right */}
      {!onlyTop && !isGhost && (
        <div
          className="absolute"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z,
            cursor: "pointer",
            pointerEvents: "none",
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
      {!isGhost && (
        <div
          className="absolute"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z,
            cursor: "pointer",
            pointerEvents: "none",
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
      {!onlyTop && !isGhost && (
        <div
          className="absolute"
          style={{
            left: left,
            top: top,
            zIndex: x + y + z,
            cursor: "pointer",
            pointerEvents: "none",
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
