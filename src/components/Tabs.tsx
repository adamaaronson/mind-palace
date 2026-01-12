import { type Dispatch, type SetStateAction } from "react";

interface TabsProps {
  labels: string[];
  widths: number[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  children: React.ReactNode[];
}

export default function Tabs(props: TabsProps) {
  const { labels, widths, activeIndex, setActiveIndex, children } = props;

  return (
    <div className="mx-3 2xl:flex 2xl:flex-row 2xl:gap-6 2xl:items-start">
      <div className="flex flex-row items-end 2xl:hidden">
        {labels.map((label, index) => (
          <button
            className={`text-2xl font-bold p-2 px-4 border-standard not-first:-ml-0.5 ${
              index === activeIndex
                ? "bg-light border-b-0! pb-2.5 pt-3"
                : "bg-light-light cursor-pointer hover:text-text-light transition-colors"
            }`}
            onClick={() => setActiveIndex(index)}
            key={index}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((child, index) => (
        <div
          className={`-mt-0.5 2xl:mt-0 p-4 sm:px-8 mb-4 bg-light border-standard overflow-hidden md:min-w-50 md:max-w-150 ${
            index === activeIndex ? "visible" : "hidden 2xl:block"
          }`}
          style={{ flex: widths[index] }}
          key={index}
        >
          <div className="hidden 2xl:block text-2xl font-bold mb-2">
            {labels[index]}
          </div>
          {child}
        </div>
      ))}
    </div>
  );
}
