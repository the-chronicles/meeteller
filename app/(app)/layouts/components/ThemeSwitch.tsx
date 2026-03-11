function ThemeSwitch({
  theme,
  setTheme,
}: {
  theme: string | undefined;
  setTheme: (t: string) => void;
}) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-6 w-11 rounded-full bg-black/20 transition dark:bg-white/20"
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${isDark ? "left-6" : "left-1"} `}
      />
    </button>
  );
}
export { ThemeSwitch };