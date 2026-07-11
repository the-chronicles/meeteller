export type Priority = "High" | "Medium" | "Low";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export type TaskOrigin = "meeting" | "manual";

export type Task = {
  id: string;
  title: string;
  meeting?: string; // optional now
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  dueISO: string;
  description?: string;
  origin?: TaskOrigin;
};