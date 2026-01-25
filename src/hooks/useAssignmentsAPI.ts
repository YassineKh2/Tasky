import { useState, useCallback } from "react";

export interface TaskAssignment {
  id: string;
  taskId: string;
  dateStr: string;
  durationOverride?: number;
  completed: boolean;
}

interface UseAssignmentsAPIReturn {
  assignments: TaskAssignment[];
  loading: boolean;
  error: string | null;
  getByDateRange: (startDate: string, endDate: string) => Promise<void>;
  createAssignment: (
    data: Omit<TaskAssignment, "id">,
  ) => Promise<TaskAssignment>;
  updateAssignment: (
    id: string,
    updates: Partial<TaskAssignment>,
  ) => Promise<TaskAssignment>;
  deleteAssignment: (id: string) => Promise<void>;
  setAssignments: (assignments: TaskAssignment[]) => void;
}

export function useAssignmentsAPI(): UseAssignmentsAPIReturn {
  const [assignments, setAssignmentsState] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getByDateRange = useCallback(
    async (startDate: string, endDate: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          startDate,
          endDate,
        });
        const res = await fetch(`/api/assignments?${params}`);
        if (!res.ok)
          throw new Error(`Failed to fetch assignments: ${res.statusText}`);
        const data = await res.json();
        setAssignmentsState(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching assignments:", message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createAssignment = useCallback(
    async (data: Omit<TaskAssignment, "id">) => {
      setError(null);
      try {
        const res = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok)
          throw new Error(`Failed to create assignment: ${res.statusText}`);
        const newAssignment = await res.json();
        setAssignmentsState((prev) => [...prev, newAssignment]);
        return newAssignment;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error creating assignment:", message);
        throw err;
      }
    },
    [],
  );

  const updateAssignment = useCallback(
    async (id: string, updates: Partial<TaskAssignment>) => {
      setError(null);
      try {
        const res = await fetch(`/api/assignments/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok)
          throw new Error(`Failed to update assignment: ${res.statusText}`);
        const updated = await res.json();
        setAssignmentsState((prev) =>
          prev.map((a) => (a.id === id ? updated : a)),
        );
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error updating assignment:", message);
        throw err;
      }
    },
    [],
  );

  const deleteAssignment = useCallback(async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" });
      if (!res.ok)
        throw new Error(`Failed to delete assignment: ${res.statusText}`);
      setAssignmentsState((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error deleting assignment:", message);
      throw err;
    }
  }, []);

  return {
    assignments,
    loading,
    error,
    getByDateRange,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    setAssignments: setAssignmentsState,
  };
}
