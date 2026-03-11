import { CalendarEventCard } from "./calendar-event-card";

const days = Array.from({ length: 30 }, (_, i) => i + 1);

export function CalendarGrid() {
  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map((day) => (
        <div
          key={day}
          className="min-h-27.5 border rounded-xl p-2 bg-white dark:bg-[#0a0014]"
        >
          <div className="text-xs font-medium mb-1">{day}</div>

          {day === 6 && (
            <CalendarEventCard type="meeting" title="Budget Review" />
          )}
          {day === 10 && (
            <CalendarEventCard type="task" title="Submit compliance report" />
          )}
        </div>
      ))}
    </div>
  );
}
