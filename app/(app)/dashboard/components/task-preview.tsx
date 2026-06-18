import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";

export function TasksPreview() {
  const { tasks, isLoading, updateTask } = useTasks();

  const activeTasks = tasks.filter((t) => t.status !== "Done").slice(0, 3);

  const completeTask = (id: string) => {
    updateTask(id, { status: "Done" });
    toast.success("Task completed!");
  };

  return (
    <div className="">
      <div className="flex items-center justify-between rounded-t-xl border border-b border-[#5b09c4] bg-[#5b09c4] px-4 py-3">
        {/* <h3 className="font-medium text-white">Your Tasks</h3> */}
        <Link href="/tasks" className="text-xs text-white hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-3 shadow-sm rounded-b-xl dark:shadow-sm/30 bg-white p-4 dark:bg-black dark:text-[#8c8b8b]">
        {isLoading ? (
          <p className="text-sm text-gray-500 py-1">Loading tasks...</p>
        ) : activeTasks.length === 0 ? (
          <p className="text-sm text-gray-500 py-1">No active tasks! All caught up. 🎉</p>
        ) : (
          activeTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-2">
              <button
                onClick={() => completeTask(task.id)}
                className="mt-0.5 text-gray-400 hover:text-green-500 transition-colors"
                title="Mark Done"
              >
                <Circle size={16} />
              </button>
              <p className="text-sm text-gray-900 dark:text-white leading-tight">
                {task.title}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
