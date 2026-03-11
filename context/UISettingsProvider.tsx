/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
type BgType = "color" | "gradient" | "image";

interface UISettings {
  bgType: BgType;
  bgValue: string;
  blur: number;
  recentImages: string[];
    theme: "light" | "dark" | "system";
}

const defaultSettings: UISettings = {
  bgType: "gradient",
  bgValue: "linear-gradient(135deg, #6366f1, #ec4899)",
  blur: 20,
  recentImages: [],
  theme: "system",
};

const UISettingsContext = createContext<{
  settings: UISettings;
  updateSettings: (s: Partial<UISettings>) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const UISettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<UISettings>(defaultSettings);

  useEffect(() => {
  const saved = localStorage.getItem("ui-settings");

  if (!saved) return;

  const parsed = JSON.parse(saved);

  // 🔧 MIGRATE OLD TAILWIND GRADIENTS
  if (
    parsed.bgType === "gradient" &&
    parsed.bgValue?.startsWith("from-")
  ) {
    parsed.bgValue = "linear-gradient(135deg, #6366f1, #ec4899)";
  }

  setSettings(parsed);
}, []);


 const updateSettings = (newSettings: Partial<UISettings>) => {
  setSettings((prev) => {
    const updated = { ...prev, ...newSettings };
    localStorage.setItem("ui-settings", JSON.stringify(updated));
    return updated;
  });
};


  return (
    <UISettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UISettingsContext.Provider>
  );
};

export const useUISettings = () => useContext(UISettingsContext);
