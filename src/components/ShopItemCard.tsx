import { useRef, useState } from "react";
import { getPrice, type ShopItem } from "../types/shop";
import { AnimatePresence, motion } from "motion/react";
import { formatNumberShort } from "../utils/utils";

interface ShopItemCardProps {
  item: ShopItem;
  level: number;
  isUpgrade?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
  isEquipped?: boolean;
  showPurchaseButton?: boolean;
  canPurchase?: boolean;
  onPurchase?: () => void;
}

export default function ShopItemCard(props: ShopItemCardProps) {
  const {
    item,
    level,
    isUpgrade = false,
    isSmall = false,
    onClick,
    isEquipped = false,
    canPurchase = false,
    onPurchase,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const isClickable = onClick != undefined;
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const buttonBoundingBox = buttonRef.current?.getBoundingClientRect();

  return (
    <div
      className="flex flex-col gap-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`relative cursor-pointer bg-white border-standard rounded-md flex shrink-0 justify-center items-center ${
          isSmall ? "size-15 p-1 text-sm" : "size-22 p-2"
        } ${
          isClickable && !isEquipped
            ? "bg-inherit! border-[#ffffff00]! hover:bg-white!"
            : ""
        }`}
        onClick={onClick}
        ref={buttonRef}
      >
        {level !== 0 && (
          <div
            className={`absolute font-bold left-full top-0 -translate-x-full  ${
              isSmall ? "-ml-0.5 -mt-0.5" : "-ml-1"
            }`}
          >
            {isUpgrade ? "+" : ""}
            {level}
          </div>
        )}
        <img src={item.image} width="80%"></img>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 0.9, translateY: 0 }}
              exit={{ opacity: 0, translateY: 10 }}
              transition={{ duration: 0.1 }}
              className="border-standard bg-white text-xs rounded-md fixed text-text-dark font-bold p-0.5 px-2 -translate-y-full -translate-x-1/2 -mt-1 text-nowrap pointer-events-none"
              style={
                buttonBoundingBox
                  ? {
                      top: buttonBoundingBox.top,
                      left:
                        (buttonBoundingBox.left + buttonBoundingBox.right) / 2,
                    }
                  : undefined
              }
            >
              {item.displayName}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      {onPurchase != undefined && (
        <button
          type="submit"
          className="button-standard py-0! px-0! text-sm"
          disabled={!canPurchase}
          onClick={onPurchase}
        >
          <img
            src="nugget.svg"
            className="inline-block h-[1em] align-baseline -mb-0.5"
          ></img>{" "}
          {formatNumberShort(getPrice(item, level))}
        </button>
      )}
    </div>
  );
}
