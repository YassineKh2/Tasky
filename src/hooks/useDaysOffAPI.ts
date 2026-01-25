import { useState, useCallback } from "react";

interface UseDaysOffAPIReturn {
  daysOff: string[];
  loading: boolean;
  error: string | null;
  getByDateRange: (startDate: string, endDate: string) => Promise<void>;
  markDayOff: (dateStr: string) => Promise<void>;
  unmarkDayOff: (dateStr: string) => Promise<void>;
  setDaysOff: (daysOff: string[]) => void;
}

export function useDaysOffAPI(): UseDaysOffAPIReturn {
  const [daysOff, setDaysOffState] = useState<string[]>([]);
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
        const res = await fetch(`/api/days-off?${params}`);
        if (!res.ok)
          throw new Error(`Failed to fetch days off: ${res.statusText}`);
        const data = await res.json();
        setDaysOffState(data.map((d: { dateStr: string }) => d.dateStr));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching days off:", message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const markDayOff = useCallback(async (dateStr: string) => {
    setError(null);
    try {
      const res = await fetch("/api/days-off", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateStr }),
      });
      if (!res.ok) throw new Error(`Failed to mark day off: ${res.statusText}`);
      setDaysOffState((prev) =>
        prev.includes(dateStr) ? prev : [...prev, dateStr],
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error marking day off:", message);
      throw err;
    }
  }, []);

  const unmarkDayOff = useCallback(async (dateStr: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/days-off/${dateStr}`, { method: "DELETE" });
      if (!res.ok)
        throw new Error(`Failed to unmark day off: ${res.statusText}`);
      setDaysOffState((prev) => prev.filter((d) => d !== dateStr));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error unmarking day off:", message);
      throw err;
    }
  }, []);

  return {
    daysOff,
    loading,
    error,
    getByDateRange,
    markDayOff,
    unmarkDayOff,
    setDaysOff: setDaysOffState,
  };
}
