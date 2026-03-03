"use client";

import { useState, useEffect } from "react";
import { Task } from "../types/task";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/get-tasks");

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data: Task[] = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">
        AI To-Do Extractor
      </h1>

      <TaskForm onTaskCreated={handleTaskCreated} />

      {loading ? (
        <p className="mt-6 text-gray-500">Loading tasks...</p>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </main>
  );
}