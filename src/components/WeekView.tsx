"use client";

import { DayCard, DayData } from "./DayCard";
interface WeekViewProps {
  weekData: DayData[];
  direction: number;
  onToggleTask: (assignmentId: string) => void;
  onToggleDayOff: (dayId: string) => void;
  onDurationChange: (assignmentId: string, duration: number) => void;
  onDropTask: (taskId: string, dateStr: string) => void;
  onRemoveTask: (assignmentId: string) => void;
}
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    rotateY: direction > 0 ? 45 : -45,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    rotateY: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    rotateY: direction < 0 ? 45 : -45,
    scale: 0.95,
  }),
};
export function WeekView({
  weekData,
  direction,
  onToggleTask,
  onToggleDayOff,
  onDurationChange,
  onDropTask,
  onRemoveTask,
}: WeekViewProps) {
  // If no data yet, render empty placeholders to keep layout stable
  if (!weekData || weekData.length === 0) {
    return (
      <div className="relative w-full h-full perspective-1000">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`placeholder-${i}`} className="h-100 md:h-112.5">
              <div className="h-full p-5 rounded-sm bg-[#FFFBF5] border border-dashed border-[#E8DCC4] opacity-40 flex items-center justify-center">
                Loading...
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full perspective-1000">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
        {(weekData && weekData.length > 0
          ? weekData
          : Array.from({ length: 7 }).map(
              (_, i) =>
                ({
                  id: `placeholder-${i}`,
                  date: "",
                  dayName: "",
                  isToday: false,
                  isDayOff: false,
                  isComplete: false,
                  tasks: [],
                  hourLogs: [],
                  fullDate: new Date(),
                }) as DayData,
            )
        ).map((day) => (
          <div key={day.id} className="h-100 md:h-112.5">
            <DayCard
              day={day}
              onToggleTask={onToggleTask}
              onToggleDayOff={onToggleDayOff}
              onDurationChange={onDurationChange}
              onDropTask={onDropTask}
              onRemoveTask={onRemoveTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
