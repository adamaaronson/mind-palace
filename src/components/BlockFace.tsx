import { getBlockHeight } from "./Palace";

interface BlockFaceProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  disabled: boolean;
  width: number;
}

export function BlockLeft(props: BlockFaceProps) {
  const { onMouseEnter, onMouseLeave, onClick, disabled, width } = props;
  const height = getBlockHeight(width);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 18L0 9V31L18 40V18Z"
        fill="none"
        onMouseEnter={disabled ? () => {} : onMouseEnter}
        onMouseLeave={disabled ? () => {} : onMouseLeave}
        onClick={disabled ? () => {} : onClick}
        style={{ pointerEvents: "all" }}
      />
    </svg>
  );
}

export function BlockRight(props: BlockFaceProps) {
  const { onMouseEnter, onMouseLeave, onClick, disabled, width } = props;
  const height = getBlockHeight(width);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 18L36 9V31L18 40V18Z"
        fill="none"
        onMouseEnter={disabled ? () => {} : onMouseEnter}
        onMouseLeave={disabled ? () => {} : onMouseLeave}
        onClick={disabled ? () => {} : onClick}
        style={{ pointerEvents: "all" }}
      />
    </svg>
  );
}

export function BlockTop(props: BlockFaceProps) {
  const { onMouseEnter, onMouseLeave, onClick, disabled, width } = props;
  const height = getBlockHeight(width);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 9L18 0L36 9L18 18L0 9Z"
        fill="none"
        onMouseEnter={disabled ? () => {} : onMouseEnter}
        onMouseLeave={disabled ? () => {} : onMouseLeave}
        onClick={disabled ? () => {} : onClick}
        style={{ pointerEvents: "all" }}
      />
    </svg>
  );
}
