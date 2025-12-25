import { useState } from "react";

interface TabsProps {
  labels: string[];
  children: React.ReactNode[];
}

export default function Tabs(props: TabsProps) {
  const { labels, children } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="mx-4">
      <div className="flex flex-row items-end">
        {labels.map((label, index) => (
          <button
            className={`text-2xl font-bold p-2 px-4 border-2 border-border not-first:-ml-0.5 ${
              index === activeIndex
                ? "bg-light border-b-0 pb-2.5 pt-3"
                : "bg-light-light cursor-pointer hover:bg-light-medium transition-colors"
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
          className={`-mt-0.5 p-4 px-8 mb-4 bg-light border-2 border-border overflow-hidden ${
            index === activeIndex ? "visible" : "hidden"
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
