interface LinkProps {
  href?: string;
  children: string;
  onClick?: () => void;
  isItalic?: boolean;
  isWikipedia?: boolean;
}

export default function Link(props: LinkProps) {
  const {
    href,
    children,
    onClick,
    isItalic = false,
    isWikipedia = false,
  } = props;

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`font-bold text-text-dark hover:text-text-light transition-colors ${isItalic ? "italic" : ""}`}
      style={{
        backgroundImage: "linear-gradient(#9c7e4e 0%, #9c7e4e 100%)",
        backgroundPosition: "0 1.15em",
        backgroundRepeat: "repeat-x",
        backgroundSize: "6px 1px",
      }}
    >
      {children.split(" ").slice(0, -1).join(" ")}{" "}
      <span className="whitespace-nowrap">
        {children.split(" ").at(-1)}
        {isWikipedia ? (
          <img
            src="wikipedia.svg"
            className="inline-block w-[1em] align-middle ml-1 mb-[0.1em]"
          ></img>
        ) : (
          <img
            src="external.svg"
            className="inline-block w-[0.6em] align-middle ml-1 mb-[0.15em]"
          ></img>
        )}
      </span>
    </a>
  ) : (
    <span className={`font-bold text-text-dark ${isItalic ? "italic" : ""}`}>
      {children}
    </span>
  );
}
