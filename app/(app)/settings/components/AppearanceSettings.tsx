"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useTheme } from "next-themes";
import { useUISettings } from "@/context/UISettingsProvider";
import { SOLID_COLORS, GRADIENTS, DEFAULT_IMAGES } from "../constants";

const THEMES = ["light", "dark", "system"] as const;

const isHexColor = (value: string) =>
  /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);

export default function AppearanceSettings() {
  const { settings, updateSettings } = useUISettings();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const solidColor =
    settings.bgType === "color" && isHexColor(settings.bgValue)
      ? settings.bgValue
      : SOLID_COLORS[0];

  const [solidInput, setSolidInput] = useState(solidColor);

  useEffect(() => {
    setSolidInput(solidColor);
  }, [solidColor]);

  const [g1, setG1] = useState("#6366f1");
  const [g2, setG2] = useState("#ec4899");

  const makeGradient = (a: string, b: string) =>
    `linear-gradient(135deg, ${a}, ${b})`;

  const gradientValue = makeGradient(g1, g2);

  const handleImageUpload = (file: File) => {
    if (file.size > 2_000_000) {
      alert("Image too large (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      saveRecentImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveRecentImage = (img: string) => {
    updateSettings({
      bgType: "image",
      bgValue: img,
      recentImages: [
        img,
        ...(settings.recentImages || []).filter((i) => i !== img),
      ].slice(0, 6),
    });
  };

  return (
    <section className="max-w-2xl space-y-10">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize the look and feel of your dashboard.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Theme
        </h3>

        <div className="flex flex-wrap gap-2">
          {THEMES.map((item) => {
            const active = mounted && theme === item;

            return (
              <button
                key={item}
                onClick={() => setTheme(item)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  active
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Background
        </h3>

        <div className="flex flex-wrap gap-2">
          {(["color", , "image"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                if (type === "color") {
                  updateSettings({
                    bgType: "color",
                    bgValue: isHexColor(settings.bgValue)
                      ? settings.bgValue
                      : SOLID_COLORS[0],
                  });
                }

                // if (type === "gradient") {
                //   updateSettings({
                //     bgType: "gradient",
                //     bgValue: gradientValue,
                //   });
                // }

                if (type === "image") {
                  updateSettings({
                    bgType: "image",
                    bgValue:
                      settings.bgValue.startsWith("/") ||
                      settings.bgValue.startsWith("data:image")
                        ? settings.bgValue
                        : DEFAULT_IMAGES[0],
                  });
                }
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                settings.bgType === type
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {settings.bgType === "color" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Solid color
          </h3>

          <HexColorPicker
            color={solidColor}
            onChange={(color) => {
              setSolidInput(color);
              updateSettings({ bgType: "color", bgValue: color });
            }}
            className="!w-full"
          />

          <div className="space-y-2">
            <label className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Hex code
            </label>
            <input
              type="text"
              value={solidInput}
              onChange={(e) => setSolidInput(e.target.value)}
              onBlur={() => {
                if (isHexColor(solidInput)) {
                  updateSettings({ bgType: "color", bgValue: solidInput });
                } else {
                  setSolidInput(solidColor);
                }
              }}
              placeholder="#6366f1"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {SOLID_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSolidInput(color);
                  updateSettings({ bgType: "color", bgValue: color });
                }}
                className={`h-8 w-8 rounded-full border ${
                  solidColor === color
                    ? "ring-2 ring-black dark:ring-white"
                    : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* {settings.bgType === "gradient" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Gradient
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <HexColorPicker
                color={g1}
                onChange={(color) => {
                  setG1(color);
                  updateSettings({
                    bgType: "gradient",
                    bgValue: makeGradient(color, g2),
                  });
                }}
                className="!w-full"
              />
              <input
                type="text"
                value={g1}
                onChange={(e) => setG1(e.target.value)}
                onBlur={() => {
                  if (isHexColor(g1)) {
                    updateSettings({
                      bgType: "gradient",
                      bgValue: makeGradient(g1, g2),
                    });
                  } else {
                    setG1("#6366f1");
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              <HexColorPicker
                color={g2}
                onChange={(color) => {
                  setG2(color);
                  updateSettings({
                    bgType: "gradient",
                    bgValue: makeGradient(g1, color),
                  });
                }}
                className="!w-full"
              />
              <input
                type="text"
                value={g2}
                onChange={(e) => setG2(e.target.value)}
                onBlur={() => {
                  if (isHexColor(g2)) {
                    updateSettings({
                      bgType: "gradient",
                      bgValue: makeGradient(g1, g2),
                    });
                  } else {
                    setG2("#ec4899");
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GRADIENTS.map((gradient) => (
              <button
                key={gradient}
                onClick={() =>
                  updateSettings({
                    bgType: "gradient",
                    bgValue: gradient,
                  })
                }
                className={`h-16 rounded-xl border ${
                  settings.bgValue === gradient
                    ? "ring-2 ring-black dark:ring-white"
                    : ""
                }`}
                style={{ backgroundImage: gradient }}
              />
            ))}
          </div>

          <div
            className="h-20 w-full rounded-xl border"
            style={{ backgroundImage: makeGradient(g1, g2) }}
          />
        </div>
      )} */}

      {settings.bgType === "image" && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Default images
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {DEFAULT_IMAGES.map((img) => (
                <button
                  key={img}
                  onClick={() => saveRecentImage(img)}
                  className={`relative h-20 overflow-hidden rounded-lg border ${
                    settings.bgValue === img
                      ? "ring-2 ring-black dark:ring-white"
                      : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt="Default background"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {settings.recentImages?.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                Recent images
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {settings.recentImages.map((img) => (
                  <button
                    key={img}
                    onClick={() => saveRecentImage(img)}
                    className={`relative h-20 overflow-hidden rounded-lg border ${
                      settings.bgValue === img
                        ? "ring-2 ring-black dark:ring-white"
                        : ""
                    }`}
                  >
                    <Image
                      src={img}
                      alt="Recent background"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Upload image
            </h3>

            <label className="flex h-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm text-gray-500 hover:border-black dark:border-white/10 dark:text-gray-400 dark:hover:border-white">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files[0])
                }
              />
              Click to upload
            </label>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          Dashboard blur ({settings.blur}px)
        </label>

        <input
          type="range"
          min={0}
          max={40}
          value={settings.blur}
          onChange={(e) => updateSettings({ blur: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </section>
  );
}
