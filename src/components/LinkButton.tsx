interface LinkButtonProps {
  onClick?: () => void;
  children: string;
  className: string;
}

export default function LinkButton(props: LinkButtonProps) {
  const { children, onClick, className } = props;

  return (
    <button
      className={`font-bold text-text-dark inline-block hover:text-text-light transition-colors cursor-pointer ${className}`}
      style={{
        backgroundImage: "linear-gradient(#9c7e4e 0%, #9c7e4e 100%)",
        backgroundPosition: "0 1.15em",
        backgroundRepeat: "repeat-x",
        backgroundSize: "6px 1px",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
