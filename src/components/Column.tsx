function Flute() {
  return <div className="bg-light border-l-standard w-1.5 h-full"></div>;
}

export default function Column() {
  return (
    <div className="flex-none md:block hidden h-full relative mr-1 ml-0.5">
      <div className="bg-light border-standard border-t-0! w-[calc(100%+2px)] h-2 absolute top-0 left-0" />
      <div className="flex h-full">
        <div className="w-2 h-full"></div>
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <Flute />
        <div className="border-l-standard w-2 h-full"></div>
      </div>
      <div className="bg-light border-standard border-b-0! w-[calc(100%+2px)] h-2 absolute top-full left-0 -translate-y-full" />
    </div>
  );
}
