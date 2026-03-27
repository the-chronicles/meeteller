/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type BgType = "color" | "gradient" | "image";

interface UISettings {
  bgType: BgType;
  bgValue: string;
  blur: number;
  recentImages: string[];
  theme: "light" | "dark" | "system";
}

const defaultSettings: UISettings = {
  bgType: "color",
  bgValue: "#0f172a",
  blur: 16,
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
    const raw = localStorage.getItem("ui-settings");
    if (raw) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(raw) });
      } catch {
        // ignore bad localStorage data
      }
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UISettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };

      const same =
        prev.theme === updated.theme &&
        prev.bgType === updated.bgType &&
        prev.bgValue === updated.bgValue &&
        prev.blur === updated.blur &&
        JSON.stringify(prev.recentImages ?? []) ===
          JSON.stringify(updated.recentImages ?? []);

      if (same) return prev;

      localStorage.setItem("ui-settings", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <UISettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UISettingsContext.Provider>
  );
};

export const useUISettings = () => useContext(UISettingsContext);
