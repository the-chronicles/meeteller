import { Play } from "lucide-react";

export function AudioPlayer() {
  return (
    <div className="rounded-xl border bg-white dark:bg-[#0a0014] p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">Meeting Playback</p>
        <p className="text-xs text-gray-500">
          AI voice summary or full recording
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select className="text-sm bg-transparent border rounded px-2 py-1">
          <option>Male Voice</option>
          <option>Female Voice</option>
        </select>

        <button className="h-10 w-10 rounded-full bg-[#5b09c4] text-white flex items-center justify-center">
          <Play size={16} />
        </button>
      </div>
    </div>
  );
}
