interface DamaskProps {
  className?: string;
}

export default function Damask(props: DamaskProps) {
  const { className } = props;
  return (
    <div
      className={`fixed h-full w-full top-0 left-0 bg-[url(/damask.png)] bg-size-[400px] md:bg-size-[600px] opacity-10 -z-20 ${className ?? ""}`}
    ></div>
  );
}
