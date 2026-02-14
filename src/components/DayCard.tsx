"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Circle, Check, Coffee, FileText } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { HourLog } from "./HourLog";
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  duration: number;
  assignmentId: string;
  isRecurring?: boolean;
}
export interface DayData {
  id: string;
  date: string;
  dayName: string;
  isToday: boolean;
  isDayOff: boolean;
  isComplete: boolean;
  tasks: Task[];
  hourLogs: string[];
  fullDate?: Date;
}
interface DayCardProps {
  day: DayData;
  onToggleTask: (assignmentId: string) => void;
  onToggleDayOff: (dayId: string) => void;
  onDurationChange: (assignmentId: string, duration: number) => void;
  onDropTask: (taskId: string, dateStr: string) => void;
  onRemoveTask?: (assignmentId: string) => void;
  note?: string;
  onEditNote?: (dateStr: string) => void;
}
export function DayCard({
  day,
  onToggleTask,
  onToggleDayOff,
  onDurationChange,
  onDropTask,
  onRemoveTask,
  note,
  onEditNote,
}: DayCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!day.isDayOff) {
      setIsDragOver(true);
    }
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (day.isDayOff) return;
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onDropTask(taskId, day.id);
    }
  };
  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative h-full flex flex-col p-5 rounded-sm transition-all duration-300 overflow-hidden
        ${day.isToday ? "bg-[#FFF8E7]" : "bg-[#FFFBF5]"} 
        ${day.isDayOff ? "bg-[#F5EFE0]" : ""}
        ${isDragOver ? "ring-2 ring-[#2C2416] ring-dashed bg-[#E8DCC4]/30" : ""}
      `}
      style={{
        boxShadow:
          "1px 1px 5px rgba(0,0,0,0.05), inset 0 0 40px rgba(232, 220, 196, 0.2)",
      }}
      whileHover={{
        y: -2,
        boxShadow: "2px 4px 12px rgba(44, 36, 22, 0.08)",
      }}
    >
      {/* Rest Day Overlay Pattern */}
      {day.isDayOff && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#8B7355 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4 border-b border-[#E8DCC4] pb-2 border-dashed relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className={`font-handwriting text-3xl font-bold ${day.isDayOff ? "text-[#8B7355]" : "text-[#2C2416]"}`}
            >
              {day.dayName}
            </h3>
            {day.isComplete && !day.isDayOff && (
              <motion.div
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                className="bg-[#2C2416] text-[#FAF7F0] rounded-full p-0.5"
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}
          </div>
          <span className="font-serif-text text-sm text-[#8B7355] italic">
            {day.date}
          </span>
        </div>

        <button
          onClick={() => onToggleDayOff(day.id)}
          className="text-[#8B7355] hover:text-[#2C2416] transition-colors p-1"
          aria-label="Toggle day off"
        >
          {day.isDayOff ? (
            <motion.div
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <Star className="w-6 h-6 fill-[#8B7355] text-[#8B7355]" />
            </motion.div>
          ) : (
            <Circle className="w-5 h-5 opacity-30 hover:opacity-100" />
          )}
        </button>
      </div>

      {/* Content Grid */}
      <div className="flex-1 flex gap-2 relative z-10">
        <div className="flex-1">
          {day.isDayOff ? (
            <div className="h-full flex flex-col items-center justify-center opacity-60 text-[#8B7355]">
              <Coffee className="w-12 h-12 mb-2 stroke-1" />
              <span className="font-handwriting text-2xl -rotate-6">
                Rest Day
              </span>
            </div>
          ) : day.tasks.length > 0 ? (
            <div className="space-y-1">
              {day.tasks.map((task) => (
                <TaskItem
                  key={task.assignmentId}
                  task={task}
                  onToggle={onToggleTask}
                  onDurationChange={onDurationChange}
                  onRemove={onRemoveTask}
                />
              ))}
            </div>
          ) : (
            <div
              className={`h-full flex items-center justify-center ${isDragOver ? "opacity-100" : "opacity-30"}`}
            >
              <span className="font-handwriting text-2xl -rotate-6">
                {isDragOver ? "Drop to assign!" : "No tasks yet..."}
              </span>
            </div>
          )}
        </div>

        {!day.isDayOff && day.hourLogs.length > 0 && (
          <HourLog logs={day.hourLogs} />
        )}
      </div>

      {/* Note Preview or Edit Button */}
      {!day.isDayOff && (
        <div className="mt-2 pt-2 border-t border-[#E8DCC4]/50 relative z-10">
          {note ? (
            <button
              onClick={() => onEditNote?.(day.id)}
              className="w-full flex items-start gap-2 hover:bg-[#E8DCC4]/20 p-2 rounded transition-colors text-left group"
            >
              <FileText className="w-4 h-4 text-[#8F7045] flex-shrink-0 mt-0.5 group-hover:text-[#2C2416]" />
              <span className="text-xs text-[#8B7355] line-clamp-2 group-hover:text-[#2C2416]">
                {note}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onEditNote?.(day.id)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[#8B7355] hover:text-[#2C2416] hover:bg-[#E8DCC4]/20 rounded transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Add note</span>
            </button>
          )}
        </div>
      )}

      <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-[#E8DCC4]/40 to-transparent pointer-events-none" />

      {day.isComplete && !day.isDayOff && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 rotate-[-15deg]">
          <span className="font-handwriting text-8xl text-[#2C2416] border-4 border-[#2C2416] rounded-xl px-4 py-2">
            DONE
          </span>
        </div>
      )}
    </motion.div>
  );
}
