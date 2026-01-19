export default function Footer() {
  return (
    <footer className="bg-light border-t-standard flex-none z-100 text-center font-classical p-0.5 font-bold text-text-light">
      <p>
        by{" "}
        <a
          href="https://aaronson.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-50 transition-all"
        >
          Adam Aaronson
        </a>
      </p>
    </footer>
  );
}
