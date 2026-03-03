"use client";

import { useState } from "react";
import { Task } from "@/types/task";

interface Props {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!input) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      onTaskCreated(data);
      setInput("");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Type something like: Remind me to submit my assignment tomorrow at 5pm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>

      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
}