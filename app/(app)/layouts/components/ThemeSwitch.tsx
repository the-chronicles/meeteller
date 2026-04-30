/* eslint-disable @typescript-eslint/no-explicit-any */
// function ThemeSwitch({
//   theme,
//   setTheme,
// }: {
//   theme: string | undefined;
//   setTheme: (t: string) => void;
// }) {
//   const isDark = theme === "dark";

//   return (
//     <button
//       onClick={() => setTheme(isDark ? "light" : "dark")}
//       className="relative h-6 w-11 rounded-full bg-black/20 transition dark:bg-white/20"
//     >
//       <span
//         className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${isDark ? "left-6" : "left-1"} `}
//       />
//     </button>
//   );
// }
// export { ThemeSwitch };

"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeSwitch({ theme, setTheme }: any) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-8 w-14 items-center rounded-full bg-gray-300 p-1 transition dark:bg-gray-700"
    >
      <div
        className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition ${
          isDark ? "translate-x-6" : ""
        }`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-gray-800" />
        )}
      </div>
    </button>
  );
}
