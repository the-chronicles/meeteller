"use client";

import { useState } from "react";
import { LiveTranscript } from "./components/live-transcript";
import OrbitVisual from "./components/OrbitVisual";
import AvatarCards from "./components/AvatarCards";

export default function LiveMeetingPage() {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <>
      {/* White canvas */}
      <div className="relative flex h-full w-full overflow-hidden rounded-3xl bg-white shadow-xl">
        {" "}
        {/* ================= LEFT MAIN ================= */}
        <div
          className={`relative flex flex-1 flex-col transition-all duration-500 ${
            showTranscript ? "pr-[25%]" : ""
          }`}
        >
          {/* Title */}
          <div className="space-y-2 pt-14 text-center">
            <p className="text-sm text-gray-500">Live meeting in progress</p>

            <h1 className="text-4xl font-semibold tracking-tight">
              Weekly Product Sync
              <span className="relative ml-2 inline-block">
                Meeting
                <span className="absolute -bottom-2 left-0 h-1 w-full rounded bg-[#5b09c4]" />
              </span>
            </h1>
          </div>

          {/* Animated center */}
          <div className="relative flex flex-1 items-center justify-center">
            <OrbitVisual />
            <AvatarCards />
          </div>

          {/* CTA */}
          <div className="pb-10 text-center">
            <button
              onClick={() => setShowTranscript((v) => !v)}
              className="group inline-flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-black"
            >
              View live transcript
              <span className="transition group-hover:translate-x-0.5">↗</span>
            </button>
          </div>
        </div>
        {/* ================= TRANSCRIPT SIDE ================= */}
        {showTranscript && (
          <div className="absolute top-0 right-0 h-full w-1/4 border-l bg-white">
            <LiveTranscript />
          </div>
        )}
      </div>
    </>
  );
}
