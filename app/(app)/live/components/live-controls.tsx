import { Mic, Pause, Square } from "lucide-react";

export function LiveControls() {
  return (
    <div className="border-t px-6 py-4 bg-white dark:bg-black flex justify-center gap-6">
      <button className="p-3 rounded-full bg-purple-600 text-white">
        <Mic size={18} />
      </button>

      <button className="p-3 rounded-full border">
        <Pause size={18} />
      </button>

      <button className="p-3 rounded-full bg-red-500 text-white">
        <Square size={18} />
      </button>
    </div>
  );
}
