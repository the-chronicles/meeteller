import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-[#0a0014]">
          <ChevronLeft size={16} />
        </button>

        <h2 className="font-medium">December 2025</h2>

        <button className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-[#0a0014]">
          <ChevronRight size={16} />
        </button>
      </div>

      <select className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-[#0a0014]">
        <option>All events</option>
        <option>Meetings only</option>
        <option>Tasks only</option>
      </select>
    </div>
  );
}
