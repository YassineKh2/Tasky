import { useState, useCallback, useEffect } from "react";

export interface UserSettings {
  id: string;
  countRestDaysAsMissing: boolean;
  countVacationDaysAsMissing: boolean;
  countOtherDaysAsMissing: boolean;
  resetStreakAtRestDay: boolean;
  resetStreakAtVacationDay: boolean;
  resetStreakAtOtherDay: boolean;
  updatedAt: string;
}

export function useSettingsAPI() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<unknown>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      setIsError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    // Optimistic update
    const previous = settings;
    if (settings) setSettings({ ...settings, ...updates });
    
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      const updatedData = await response.json();
      setSettings(updatedData);
      return updatedData;
    } catch (err) {
      console.error(err);
      if (previous) setSettings(previous);
      throw err;
    }
  };

  return {
    settings,
    isLoading,
    isError,
    updateSettings,
  };
}
