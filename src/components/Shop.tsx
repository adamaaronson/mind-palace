import { type Upgrade } from "../types/upgrade";
import { formatNumber } from "../utils/utils";

interface ShopProps {
  displayNuggets: number;
  setNuggets: React.Dispatch<React.SetStateAction<number>>;
  upgrades: Record<string, Upgrade>;
  setUpgrades: React.Dispatch<React.SetStateAction<Record<string, Upgrade>>>;
}

export default function Shop(props: ShopProps) {
  const { displayNuggets, setNuggets, upgrades, setUpgrades } = props;

  const purchaseUpgrade = (upgradeName: string) => {
    const upgrade = upgrades[upgradeName];
    const previousUpgradePrice = upgrade.price;
    if (displayNuggets < upgrade.price) {
      return;
    }
    setNuggets((nuggets) => nuggets - previousUpgradePrice);

    setUpgrades((upgrades) => ({
      ...upgrades,
      [upgradeName]: {
        ...upgrade,
        price: Math.floor(upgrade.price * 1.5),
        level: upgrade.level + 1,
      },
    }));

    if (upgradeName === "ANY_ANSWERS") {
      setUpgrades((upgrades) => ({
        ...upgrades,
        CORRECT_ANSWERS: {
          ...upgrades.CORRECT_ANSWERS,
          level: upgrades.CORRECT_ANSWERS.level + 1,
        },
      }));
    }
  };

  return (
    <div className="border-standard rounded-2xl bg-light-light p-4 flex gap-2 overflow-scroll min-w-0">
      {Object.entries(upgrades).map(([name, upgrade]) => (
        <div className="flex flex-col gap-1" key={name}>
          <div
            className="relative bg-white border-standard rounded-md h-20 w-20 p-2 flex justify-center align-center"
            key={name}
          >
            <div className="absolute font-bold left-full top-0 -translate-x-full -ml-1">
              +{upgrade.level}
            </div>
            <img src={upgrade.image} width="80%"></img>
          </div>
          <button
            type="submit"
            className={`button-standard py-0! px-2! text-sm ${
              displayNuggets >= upgrade.price
                ? "opacity-100 cursor-pointer"
                : "disabled:opacity-50 disabled:pointer-events-none"
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
  );
}
