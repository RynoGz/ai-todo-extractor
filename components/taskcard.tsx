import { Task } from "@/types/task";

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold">{task.title}</h2>
      <p>{task.description}</p>

      {task.due_date && (
        <p className="text-sm text-gray-500">
          Due: {new Date(task.due_date).toLocaleString()}
        </p>
      )}
    </div>
  );
}