import { useState, useCallback } from "react";

export interface TaskDefinition {
  id: string;
  text: string;
  description?: string;
  baselineDuration: number;
  isRecurring: boolean;
  recurringDays: number[];
}

interface UseTasksAPIReturn {
  tasks: TaskDefinition[];
  loading: boolean;
  error: string | null;
  createTask: (data: Omit<TaskDefinition, "id">) => Promise<TaskDefinition>;
  updateTask: (
    id: string,
    updates: Partial<TaskDefinition>,
  ) => Promise<TaskDefinition>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<TaskDefinition[]>;
}

export function useTasksAPI(): UseTasksAPIReturn {
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`);
      const data = await res.json();
      setTasks(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching tasks:", message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (data: Omit<TaskDefinition, "id">) => {
      setError(null);
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok)
          throw new Error(`Failed to create task: ${res.statusText}`);
        const newTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
        // Refetch to ensure consistency
        await fetchTasks();
        return newTask;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error creating task:", message);
        throw err;
      }
    },
    [fetchTasks],
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<TaskDefinition>) => {
      setError(null);
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok)
          throw new Error(`Failed to update task: ${res.statusText}`);
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error updating task:", message);
        throw err;
      }
    },
    [],
  );

  const deleteTask = useCallback(async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete task: ${res.statusText}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error deleting task:", message);
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
}
