import { toRomanNumerals } from "../utils/utils";

export default function Header() {
  return (
    <div className="md:p-4 px-8 md:px-8 border-b-standard bg-light font-classical tracking-widest font-bold flex justify-center sm:justify-between items-center">
      <span className="text-text-light md:text-2xl hidden sm:block">
        Version <span className="font-theme">0.1</span>
      </span>
      <h1 className="text-3xl md:text-5xl leading-[1.25em] md:leading-[0.8em] text-text-dark">
        Mind Palace
      </h1>
      <span className="text-text-light md:text-2xl hidden sm:block">
        A.D. &nbsp;{toRomanNumerals(new Date().getFullYear())}
      </span>
    </div>
  );
}
