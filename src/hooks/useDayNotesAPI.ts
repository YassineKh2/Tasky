import { useState, useCallback } from "react";

interface DayNote {
  id: string;
  dateStr: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface UseDayNotesAPIReturn {
  notes: Record<string, string>; // Map of dateStr -> content
  loading: boolean;
  error: string | null;
  getByDateRange: (startDate: string, endDate: string) => Promise<void>;
  saveNote: (dateStr: string, content: string) => Promise<void>;
  deleteNote: (dateStr: string) => Promise<void>;
  setNotes: (notes: Record<string, string>) => void;
}

export function useDayNotesAPI(): UseDayNotesAPIReturn {
  const [notes, setNotesState] = useState<Record<string, string>>({});
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
        const res = await fetch(`/api/day-notes?${params}`);
        if (!res.ok)
          throw new Error(`Failed to fetch day notes: ${res.statusText}`);
        const data: DayNote[] = await res.json();

        // Convert array to map of dateStr -> content
        const notesMap = data.reduce(
          (acc, note) => {
            acc[note.dateStr] = note.content;
            return acc;
          },
          {} as Record<string, string>,
        );

        setNotesState(notesMap);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching day notes:", message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const saveNote = useCallback(async (dateStr: string, content: string) => {
    setError(null);
    try {
      const res = await fetch("/api/day-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateStr, content }),
      });
      if (!res.ok)
        throw new Error(`Failed to save day note: ${res.statusText}`);

      setNotesState((prev) => ({
        ...prev,
        [dateStr]: content,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error saving day note:", message);
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (dateStr: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/day-notes/${dateStr}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`Failed to delete day note: ${res.statusText}`);

      setNotesState((prev) => {
        const updated = { ...prev };
        delete updated[dateStr];
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error deleting day note:", message);
      throw err;
    }
  }, []);

  return {
    notes,
    loading,
    error,
    getByDateRange,
    saveNote,
    deleteNote,
    setNotes: setNotesState,
  };
}
