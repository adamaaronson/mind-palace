interface LinkOrTextProps {
  link?: string;
  text: string;
}

export default function LinkOrText(props: LinkOrTextProps) {
  const { link, text } = props;
  return link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="link font-bold text-text-dark inline-block hover:opacity-50"
    >
      {text}{" "}
      <img
        src="external.svg"
        className="inline-block w-[0.6em] align-baseline mr-1"
      ></img>
    </a>
  ) : (
    <span className="font-bold text-text-dark">{text}</span>
  );
}
