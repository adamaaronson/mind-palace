import LinkOrText from "./LinkOrText";

export default function Footer() {
  return (
    <footer
      className="text-text-light text-right text-sm p-2 w-full
        md:absolute md:-translate-full md:left-full md:top-full md:-mt-4
    "
    >
      <p>
        by <LinkOrText link="https://aaronson.org" text="Adam Aaronson" />
      </p>
    </footer>
  );
}
