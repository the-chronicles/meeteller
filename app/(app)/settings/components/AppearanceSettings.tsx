"use client";

import Image from "next/image";
import { useUISettings } from "@/context/UISettingsProvider";
import { SOLID_COLORS, GRADIENTS, DEFAULT_IMAGES } from "../constants";
import { HexColorPicker } from "react-colorful";

import { useEffect, useState } from "react";

const THEMES = ["light", "dark", "system"] as const;

export default function AppearanceSettings() {
  const { settings, updateSettings } = useUISettings();

  const [g1, setG1] = useState("#6366f1");
  const [g2, setG2] = useState("#ec4899");

  const gradientValue = `linear-gradient(135deg, ${g1}, ${g2})`;


useEffect(() => {
  if (settings.bgType === "gradient") {
    updateSettings({ bgValue: gradientValue });
  }
}, [g1, g2]);

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
        {/* <h2 className="text-xl font-semibold">Customize the look and feel of your dashboard.</h2> */}
        <p className="text-sm text-gray-500">
          Customize the look and feel of your dashboard.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Theme</h3>

        <div className="flex gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => updateSettings({ theme })}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                settings.theme === theme
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Background</h3>

        <div className="flex gap-2">
          {(["color", "gradient", "image"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                if (type === "color") {
                  updateSettings({
                    bgType: "color",
                    bgValue: settings.bgValue.startsWith("#")
                      ? settings.bgValue
                      : SOLID_COLORS[0],
                  });
                }

                if (type === "gradient") {
                  updateSettings({
                    bgType: "gradient",
                    bgValue: gradientValue,
                  });
                }

                if (type === "image") {
                  updateSettings({
                    bgType: "image",
                    bgValue: settings.bgValue.startsWith("/")
                      ? settings.bgValue
                      : DEFAULT_IMAGES[0],
                  });
                }
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                settings.bgType === type
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {settings.bgType === "color" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Solid color</h3>

          <HexColorPicker
            color={settings.bgValue}
            onChange={(color) => updateSettings({ bgValue: color })}
            className="!w-full"
          />

          {/* Quick presets */}
          {/* <div className="flex flex-wrap gap-3">
            {SOLID_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateSettings({ bgValue: color })}
                className={`h-8 w-8 rounded-full border transition ${
                  settings.bgValue === color ? "ring-2 ring-black" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div> */}
        </div>
      )}

      {settings.bgType === "gradient" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Custom gradient</h3>

          <div className="grid grid-cols-2 gap-4">
            <HexColorPicker color={g1} onChange={setG1} />
            <HexColorPicker color={g2} onChange={setG2} />
          </div>

          <button
            onClick={() => updateSettings({ bgValue: gradientValue })}
            className="h-16 w-full rounded-lg border"
            style={{ background: gradientValue }}
          />
        </div>
      )}

      {settings.bgType === "image" && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium">Default images</h3>

            <div className="grid grid-cols-3 gap-3">
              {DEFAULT_IMAGES.map((img) => (
                <button
                  key={img}
                  onClick={() => saveRecentImage(img)}
                  className={`relative h-20 overflow-hidden rounded-lg border transition ${
                    settings.bgValue === img ? "ring-2 ring-black" : ""
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
              <h3 className="mb-3 text-sm font-medium">Recent images</h3>

              <div className="grid grid-cols-3 gap-3">
                {settings.recentImages.map((img) => (
                  <button
                    key={img}
                    onClick={() => saveRecentImage(img)}
                    className={`relative h-20 overflow-hidden rounded-lg border transition ${
                      settings.bgValue === img ? "ring-2 ring-black" : ""
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

          {/* Upload */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Upload image</h3>

            <label className="flex h-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm text-gray-500 hover:border-black">
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

          {/* Preview */}
          {/* {settings.bgValue && (
            <div className="relative h-32 w-full">
              <Image
                src={settings.bgValue}
                alt="Preview"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )} */}
        </div>
      )}

      


      {/* ----------------------------
         Blur
      ----------------------------- */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
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

