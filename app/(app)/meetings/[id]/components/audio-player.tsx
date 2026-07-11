"use client";

import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  voiceGender: "male" | "female";
  setVoiceGender: (gender: "male" | "female") => void;
}

export function AudioPlayer({
  isPlaying,
  onPlayToggle,
  voiceGender,
  setVoiceGender,
}: AudioPlayerProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0014] p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">Meeting Playback</p>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          AI voice summary read aloud
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={voiceGender}
          onChange={(e) => setVoiceGender(e.target.value as "male" | "female")}
          className="text-sm bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded px-2 py-1 outline-none"
        >
          <option value="female" className="dark:bg-[#0a0014]">Female Voice</option>
          <option value="male" className="dark:bg-[#0a0014]">Male Voice</option>
        </select>

        <button
          onClick={onPlayToggle}
          className="h-10 w-10 rounded-full bg-[#5b09c4] hover:bg-[#4e07a9] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
