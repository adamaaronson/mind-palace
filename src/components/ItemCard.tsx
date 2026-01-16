import { memo, useRef, useState } from "react";
import type { ShopItem } from "../types/shop";
import { AnimatePresence, motion } from "motion/react";

interface ItemCardProps {
  item: ShopItem;
  isUpgrade?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
  isEquipped?: boolean;
  scroll?: number;
}

function ItemCard(props: ItemCardProps) {
  const {
    item,
    isUpgrade = false,
    isSmall = false,
    onClick,
    isEquipped = false,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const isClickable = onClick != undefined;
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const buttonBoundingBox = buttonRef.current?.getBoundingClientRect();

  return (
    <button
      className={`relative cursor-pointer bg-white border-standard rounded-md flex shrink-0 justify-center items-center ${
        isSmall ? "size-15 p-1 text-sm" : "size-20 p-2"
      } ${
        isClickable && !isEquipped
          ? "bg-inherit! border-[#ffffff00]! hover:bg-white!"
          : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      ref={buttonRef}
    >
      {item.level !== 0 && (
        <div
          className={`absolute font-bold left-full top-0 -translate-x-full  ${
            isSmall ? "-ml-0.5 -mt-0.5" : "-ml-1"
          }`}
        >
          {isUpgrade ? "+" : ""}
          {item.level}
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
            className="border-standard bg-white text-xs rounded-md fixed text-text-dark font-bold p-0.5 px-2 -translate-y-full -translate-x-1/2 -mt-1 text-nowrap"
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
  );
}

export default memo(ItemCard);
