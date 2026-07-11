"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function TranscriptPanel({
  transcript,
}: {
  transcript: { speaker: string; text: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 dark:border-white/10 dark:bg-[#282828]">
      {/* Clickable Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between p-6 text-left transition-colors hover:bg-gray-50/50 focus:outline-none dark:hover:bg-white/2"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Transcript
          </h3>
          {/* <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
            {transcript.length} {transcript.length === 1 ? 'segment' : 'segments'}
          </span> */}
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-200 dark:text-gray-400 ${
            isOpen ? "rotate-180 transform" : ""
          }`}
        />
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          isOpen
            ? "max-h-[400px] overflow-y-auto border-t border-gray-100 p-6 dark:border-white/5"
            : "max-h-0 overflow-hidden"
        }`}
      >
        {transcript.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500 dark:text-zinc-500">
            No transcript available for this meeting.
          </p>
        ) : (
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            {transcript.map((t, idx) => (
              <p key={idx} className="leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t.speaker}:
                </span>{" "}
                {t.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
