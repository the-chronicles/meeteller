// pinnedColors.ts
export const PIN_STYLES = {
  green: {
    pin: "bg-emerald-500",
    card: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40",
    glow: "shadow-emerald-300/50 dark:shadow-emerald-950/20 dark:border dark:border-emerald-500/20",
  },
  purple: {
    pin: "bg-fuchsia-500",
    card: "from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-950/40 dark:to-fuchsia-900/40",
    glow: "shadow-fuchsia-300/50 dark:shadow-fuchsia-950/20 dark:border dark:border-fuchsia-500/20",
  },
  blue: {
    pin: "bg-sky-500",
    card: "from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/40",
    glow: "shadow-sky-300/50 dark:shadow-sky-950/20 dark:border dark:border-sky-500/20",
  },
} as const;
