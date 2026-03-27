import { Mic, ClipboardList, Clock, TrendingUp } from "lucide-react";

const stats = [
  { label: "Meetings", value: "12", icon: Mic },
  { label: "Action Items", value: "38", icon: ClipboardList },
  { label: "Hours Spent", value: "9.4h", icon: Clock },
];

export function StatsCards() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:border dark:border-white/10 dark:bg-black">
      {/* <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        Statistics
      </h3> */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-white/5"
            >
              <div className="rounded-lg bg-[#5b09c4]/10 p-2">
                <Icon className="h-4 w-4 text-[#5b09c4]" />
              </div>

              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="font-helvetica text-lg font-semibold">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
