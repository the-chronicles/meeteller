"use client";

import { X, Minus, Maximize2, GripVertical } from "lucide-react";
import { useState } from "react";

export function WidgetShell({
  title,
  children,
  onClose,
  dragAttributes,
  dragListeners,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  dragAttributes?: Record<string, unknown>;
  dragListeners?: Record<string, unknown>;
}) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const content = (
    <div className="rounded-2xl border bg-white shadow-2xl/10 dark:border-white/10 dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-3">
          {/* macOS buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white"
            >
              <X size={6} className="text-black" />
            </button>

            <button
              onClick={() => setMinimized((v) => !v)}
              className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-400 text-white"
            >
              <Minus size={6} className="text-black" />
            </button>

            <button
              onClick={() => setExpanded(true)}
              className="flex h-3 w-3 items-center justify-center rounded-full bg-green-500 text-white"
            >
              <Maximize2 size={6} className="text-black" />
            </button>
          </div>

          <h3 className="font-helvetica text-sm font-medium">{title}</h3>
        </div>

        <GripVertical
          className="h-4 w-4 cursor-grab opacity-40"
          {...dragAttributes}
          {...dragListeners}
        />
      </div>

      {!minimized && <div className="p-4">{children}</div>}
    </div>
  );

  /* Expanded modal */
  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
        <div className="w-full max-w-4xl">
          <div className="relative">
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-10 text-sm opacity-60 hover:opacity-100"
            >
              Esc
            </button>
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}
