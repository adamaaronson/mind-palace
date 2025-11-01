function Flute() {
  return (
    <div className="bg-light border-l-2 border-border w-[6px] h-full"></div>
  );
}

export default function Column() {
  return (
    <div className="flex-none md:block hidden h-full relative mr-[4px] ml-[2px]">
      <div className="bg-light border-2 border-border border-t-0 w-[calc(100%+2px)] h-2 absolute top-0 left-0" />
      <div className="flex h-full">
        <div className="border-border w-[8px] h-full"></div>
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <div className="border-l-2 border-border w-[8px] h-full"></div>
      </div>
      <div className="bg-light border-2 border-border border-b-0 w-[calc(100%+2px)] h-2 absolute top-full left-0 -translate-y-full" />
    </div>
  );
}
