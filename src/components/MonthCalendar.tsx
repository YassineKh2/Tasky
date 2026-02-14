"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckSquare, Coffee } from "lucide-react";
import { DayData } from "./DayCard";
import { DayDetailsModal } from "./DayDetailsModal";
interface TaskDefinition {
  id: string;
  text: string;
  description?: string;
  baselineDuration: number;
  isRecurring: boolean;
  recurringDays: number[];
}

interface TaskAssignment {
  id: string;
  taskId: string;
  dateStr: string;
  durationOverride?: number;
  completed: boolean;
}

interface MonthCalendarProps {
  currentDate: Date;
  days: DayData[];
  onDayClick: (dayId: string) => void;
  selectedDays: string[];
  onToggleSelectDay: (dayId: string) => void;
  isSelectMode: boolean;
  onToggleSelectMode: () => void;
  taskDefinitions: TaskDefinition[];
  assignments: TaskAssignment[];
  daysOff: string[];
  notes?: Record<string, string>;
  onSaveNote?: (dateStr: string, content: string) => Promise<void>;
}
export function MonthCalendar({
  currentDate,
  days,
  onDayClick,
  selectedDays,
  onToggleSelectDay,
  isSelectMode,
  onToggleSelectMode,
  taskDefinitions,
  assignments,
  daysOff,
  notes = {},
  onSaveNote,
}: MonthCalendarProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );
  const [viewingDayStr, setViewingDayStr] = useState<string | null>(null);
  const STATS_START_DATE = "2026-01-14";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Calculate completion level for color coding
  const getCompletionLevel = (day: DayData): number => {
    if (day.isDayOff) return -1; // Special case for rest days
    // Check if date is before tracking start date
    if (day.id < STATS_START_DATE) return -2; // Before tracking (neutral)
    // Check if date is in the future
    const dayDate = day.fullDate ? new Date(day.fullDate) : new Date(day.id);
    dayDate.setHours(0, 0, 0, 0);
    if (dayDate > today) return -2; // Future date (neutral)
    const completedCount = day.tasks.filter((t) => t.completed).length;
    const totalCount = day.tasks.length;
    // Missed day: has tasks but none completed (only for past dates within tracking period)
    if (totalCount > 0 && completedCount === 0) return 0;
    // Return completed count (1-5+)
    return Math.min(completedCount, 5);
  };
  // Get background color based on completion level
  const getCompletionColor = (
    level: number,
    isToday: boolean,
    isSelected: boolean,
  ): string => {
    if (isSelected) return "bg-[#2C2416]";
    if (isToday) return "bg-[#FFF8E7] border-[#2C2416]";
    switch (level) {
      case -2:
        // Before tracking or future (neutral)
        return "bg-white/50";
      case -1:
        // Rest day
        return "bg-[#F5EFE0]";
      case 0:
        // Missed (has tasks, none completed)
        return "bg-[#FFF5F5]";
      case 1:
        return "bg-[#FFF8E7]";
      case 2:
        return "bg-[#F5EDD9]";
      case 3:
        return "bg-[#E8DCC4]";
      case 4:
        return "bg-[#D4C4B0]";
      case 5:
        return "bg-[#C0B09C]";
      default:
        return "bg-white/50";
    }
  };
  // Get text color based on background darkness
  const getTextColor = (level: number, isSelected: boolean): string => {
    if (isSelected) return "text-[#FAF7F0]";
    if (level >= 4) return "text-[#2C2416]";
    return "text-[#6B5D4F]";
  };
  // Handle day click with shift-select support
  const handleDayClick = (
    dayId: string,
    dayIndex: number,
    isCurrentMonth: boolean,
    e: React.MouseEvent,
  ) => {
    if (!isCurrentMonth) return;
    if (isSelectMode) {
      if (e.shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, dayIndex);
        const end = Math.max(lastSelectedIndex, dayIndex);
        const currentMonthDays = days.filter(
          (d) => d.fullDate?.getMonth() === currentDate.getMonth(),
        );
        const daysToSelect = currentMonthDays
          .slice(start, end + 1)
          .map((d) => d.id);
        daysToSelect.forEach((id) => {
          if (!selectedDays.includes(id)) {
            onToggleSelectDay(id);
          }
        });
      } else {
        onToggleSelectDay(dayId);
        setLastSelectedIndex(dayIndex);
      }
    } else {
      // Show day details modal
      setViewingDayStr(dayId);
      onDayClick(dayId);
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      className="w-full bg-[#FFFBF5] rounded-sm p-4 md:p-8 shadow-sm border border-[#E8DCC4] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-paper-texture" />

      {/* Month Header with Select Mode Toggle */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="w-24" />

        <div className="text-center">
          <h2 className="font-handwriting text-4xl md:text-5xl text-[#2C2416] mb-2">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="h-px w-32 mx-auto bg-[#E8DCC4]" />
        </div>

        <div className="w-24 flex justify-end">
          <button
            onClick={onToggleSelectMode}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all
              ${isSelectMode ? "bg-[#2C2416] text-[#FAF7F0] border-[#2C2416]" : "bg-transparent text-[#8B7355] border-[#E8DCC4] hover:border-[#2C2416] hover:text-[#2C2416]"}
            `}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm font-serif-text font-bold hidden md:inline">
              {isSelectMode ? "Done" : "Select"}
            </span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap justify-center gap-3 text-xs font-serif-text relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#FFF5F5] border border-[#E8DCC4]" />
          <span className="text-[#8B7355]">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#FFF8E7] border border-[#E8DCC4]" />
          <span className="text-[#8B7355]">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#E8DCC4] border border-[#E8DCC4]" />
          <span className="text-[#8B7355]">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#C0B09C] border border-[#E8DCC4]" />
          <span className="text-[#8B7355]">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#F5EFE0] border border-[#E8DCC4]" />
          <span className="text-[#8B7355]">Rest</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 relative z-10">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-serif-text text-[#8B7355] text-xs md:text-sm font-bold uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const isCurrentMonth =
            day.fullDate?.getMonth() === currentDate.getMonth();
          const isSelected = selectedDays.includes(day.id);
          const completionLevel = getCompletionLevel(day);
          const bgColor = getCompletionColor(
            completionLevel,
            day.isToday,
            isSelected,
          );
          const textColor = getTextColor(completionLevel, isSelected);
          const currentMonthDays = days.filter(
            (d) => d.fullDate?.getMonth() === currentDate.getMonth(),
          );
          const monthIndex = currentMonthDays.findIndex((d) => d.id === day.id);
          return (
            <motion.button
              key={`${day.id}-${index}`}
              onClick={(e) =>
                handleDayClick(day.id, monthIndex, isCurrentMonth, e)
              }
              disabled={!isCurrentMonth}
              whileHover={
                isCurrentMonth
                  ? {
                      scale: 1.05,
                      zIndex: 10,
                    }
                  : {}
              }
              className={`
                aspect-square relative flex flex-col items-center justify-center
                rounded-lg border-2 transition-all duration-300
                ${bgColor}
                ${day.isToday && !isSelected ? "border-[#2C2416] shadow-md" : "border-transparent"}
                ${isCurrentMonth ? "hover:border-[#8B7355] hover:shadow-sm cursor-pointer" : "opacity-30 cursor-default"}
                ${isSelected ? "border-[#2C2416] shadow-lg scale-105 z-10" : ""}
              `}
            >
              {/* Rest Day Pattern Overlay */}
              {completionLevel === -1 && !isSelected && (
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
                  style={{
                    backgroundImage:
                      "radial-gradient(#8B7355 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                />
              )}

              {/* Selection Checkbox (Visible in Select Mode) */}
              {isSelectMode && isCurrentMonth && (
                <div
                  className={`
                    absolute top-1 right-1 w-3 h-3 md:w-4 md:h-4 rounded border flex items-center justify-center transition-colors
                    ${isSelected ? "bg-[#FAF7F0] border-[#FAF7F0]" : "border-[#8B7355] bg-white"}
                  `}
                >
                  {isSelected && (
                    <Check className="w-2 h-2 md:w-3 md:h-3 text-[#2C2416]" />
                  )}
                </div>
              )}

              {/* Day Number */}
              <span
                className={`font-handwriting text-base md:text-xl font-bold ${textColor} ${day.isToday && !isSelected ? "text-[#2C2416]" : ""}`}
              >
                {day.date.split(" ")[1]}
              </span>

              {/* Status Indicator */}
              {isCurrentMonth && !isSelected && (
                <div className="absolute bottom-1 flex items-center justify-center">
                  {day.isDayOff ? (
                    <Coffee className="w-3 h-3 text-[#8B7355]" />
                  ) : completionLevel === 0 ? (
                    <div className="w-1 h-1 rounded-full bg-red-400" />
                  ) : day.isComplete ? (
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-[#2C2416] stroke-[3]" />
                  ) : null}
                </div>
              )}

              {/* Today Pulse Marker */}
              {day.isToday && !isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#2C2416] rounded-full animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Shift-Select Hint */}
      {isSelectMode && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-4 text-center text-xs text-[#8B7355] italic relative z-10"
        >
          Hold{" "}
          <kbd className="px-1.5 py-0.5 bg-[#E8DCC4] rounded font-mono font-bold">
            Shift
          </kbd>{" "}
          to select multiple days
        </motion.div>
      )}

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={!!viewingDayStr}
        onClose={() => setViewingDayStr(null)}
        dateStr={viewingDayStr}
        taskDefinitions={taskDefinitions}
        assignments={assignments.filter((a) => a.dateStr === viewingDayStr)}
        isRestDay={!!viewingDayStr && daysOff.includes(viewingDayStr)}
        noteContent={viewingDayStr ? notes[viewingDayStr] || "" : ""}
        onSaveNote={onSaveNote}
      />
    </motion.div>
  );
}
