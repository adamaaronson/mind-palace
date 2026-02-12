function Flute() {
  return <div className="bg-light border-l-standard w-1.5 h-full"></div>;
}

export default function Column() {
  return (
    <div className="flex-none md:block hidden h-full relative mx-1 z-100">
      <div className="bg-light rounded-full border-standard w-full h-2.5 -translate-y-0.5 absolute top-0 left-0" />
      <div className="flex h-full">
        <div className="w-1.5 h-full"></div>
        {Array.from({ length: 7 }, (_, index) => (
          <Flute key={index} />
        ))}
        <div className="border-l-standard w-2 h-full"></div>
      </div>
      <div className="bg-light rounded-full border-standard w-full h-2.5 absolute top-full left-0 translate-y-[calc(-100%+2px)]" />
    </div>
  );
}
