interface LinkOrTextProps {
  link?: string;
  text: string;
  isWikipedia?: boolean;
}

export default function LinkOrText(props: LinkOrTextProps) {
  const { link, text, isWikipedia = true } = props;
  return link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="link font-bold text-text-dark inline-block hover:opacity-50"
      style={{
        backgroundImage: "linear-gradient(#9c7e4e 0%, #9c7e4e 100%)",
        backgroundPosition: "0 1.15em",
        backgroundRepeat: "repeat-x",
        backgroundSize: "6px 1px",
      }}
    >
      {text}
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
    </a>
  ) : (
    <span className="font-bold text-text-dark">{text}</span>
  );
}
