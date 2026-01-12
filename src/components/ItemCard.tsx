import type { ShopItem } from "../types/shop";

interface ItemCardProps {
  item: ShopItem;
  isUpgrade?: boolean;
  isSmall?: boolean;
  onClick?: () => void;
  isEquipped?: boolean;
}

export default function ItemCard(props: ItemCardProps) {
  const {
    item,
    isUpgrade = false,
    isSmall = false,
    onClick,
    isEquipped = false,
  } = props;
  const isClickable = onClick != undefined;

  return (
    <button
      className={`relative bg-white border-standard rounded-md flex shrink-0 justify-center items-center ${
        isSmall ? "size-15 p-1 text-sm" : "size-20 p-2"
      } ${
        isClickable && !isEquipped
          ? "cursor-pointer bg-inherit! border-light-light! hover:bg-white!"
          : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`absolute font-bold left-full top-0 -translate-x-full  ${
          isSmall ? "-ml-0.5 -mt-0.5" : "-ml-1"
        }`}
      >
        {isUpgrade ? "+" : ""}
        {item.level}
      </div>
      <img src={item.image} width="80%"></img>
    </button>
  );
}
