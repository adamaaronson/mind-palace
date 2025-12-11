import { UPGRADES } from "../types/upgrade";
import { formatNumber } from "../utils/utils";

interface ShopProps {
  displayNuggets: number;
  setNuggets: React.Dispatch<React.SetStateAction<number>>;
}

export default function Shop(props: ShopProps) {
  const { displayNuggets, setNuggets } = props;

  const purchaseUpgrade = (upgradeName: string) => {
    const upgrade = UPGRADES[upgradeName];
    const previousUpgradePrice = upgrade.price;
    if (displayNuggets < upgrade.price) {
      return;
    }
    setNuggets((nuggets) => nuggets - previousUpgradePrice);

    upgrade.price = Math.floor(upgrade.price * 1.5);
    upgrade.level += 1;
    if (upgradeName === "ANY_ANSWERS") {
      UPGRADES.CORRECT_ANSWERS.level += 1;
    }
  };

  return (
    <div className="p-4 px-8 mb-4 bg-light mx-4 border-2 border-border">
      <h3 className="text-2xl font-bold mb-2">Shop</h3>
      <div className="border-2 border-border rounded-2xl bg-light-light p-4 flex gap-2 overflow-scroll">
        {Object.entries(UPGRADES).map(([name, upgrade]) => (
          <div className="flex flex-col gap-1" key={name}>
            <div
              className="relative bg-white border-border border-2 rounded-md h-20 w-20 p-2 flex justify-center align-center"
              key={name}
            >
              <div className="absolute font-bold left-full top-0 -translate-x-full -ml-1">
                +{upgrade.level}
              </div>
              <img src={upgrade.image} width="80%"></img>
            </div>
            <button
              type="submit"
              className={`bg-gold-light border-gold border-2 rounded-md px-2 font-bold transition-colors text-sm ${
                displayNuggets >= upgrade.price
                  ? "opacity-100 cursor-pointer hover:bg-gold"
                  : "opacity-50"
              }`}
              disabled={displayNuggets < upgrade.price}
              onClick={() => purchaseUpgrade(name)}
            >
              <img
                src="nugget.svg"
                className="inline-block h-[1em] align-baseline -mb-0.5"
              ></img>{" "}
              {formatNumber(upgrade.price)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
