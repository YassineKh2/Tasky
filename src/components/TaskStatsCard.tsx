"use client";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { RecurringBadge } from "./RecurringBadge";
interface TaskStatsCardProps {
  taskName: string;
  description?: string;
  totalHours: number;
  completedCount: number;
  missedCount: number;
  isRecurring: boolean;
  recurringDays: number[];
  index: number;
}
export function TaskStatsCard({
  taskName,
  description,
  totalHours,
  completedCount,
  missedCount,
  isRecurring,
  recurringDays,
  index,
}: TaskStatsCardProps) {
  const completionRate =
    completedCount + missedCount > 0
      ? Math.round((completedCount / (completedCount + missedCount)) * 100)
      : 0;
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      className="bg-white p-5 rounded-lg border border-[#E8DCC4] hover:border-[#2C2416] hover:shadow-md transition-all relative overflow-hidden"
    >
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-paper-texture" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-handwriting text-2xl text-[#2C2416] leading-tight mb-1">
              {taskName}
            </h3>
            {description && (
              <p className="text-xs text-[#8B7355] line-clamp-1">
                {description}
              </p>
            )}
          </div>
          {isRecurring && (
            <div className="ml-2">
              <RecurringBadge days={recurringDays} />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 bg-[#FFF8E7] rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-[#8B7355]" />
            </div>
            <div className="font-handwriting text-2xl font-bold text-[#2C2416]">
              {totalHours}h
            </div>
            <div className="font-serif-text text-[10px] text-[#8B7355] uppercase tracking-wider">
              Total Time
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="font-handwriting text-2xl font-bold text-green-700">
              {completedCount}
            </div>
            <div className="font-serif-text text-[10px] text-green-600 uppercase tracking-wider">
              Completed
            </div>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="font-handwriting text-2xl font-bold text-red-700">
              {missedCount}
            </div>
            <div className="font-serif-text text-[10px] text-red-600 uppercase tracking-wider">
              Missed
            </div>
          </div>
        </div>

        {/* Completion Rate Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-serif-text text-xs text-[#8B7355] font-bold uppercase tracking-wider">
              Completion Rate
            </span>
            <span className="font-handwriting text-lg text-[#2C2416] font-bold">
              {completionRate}%
            </span>
          </div>
          <div className="h-2 bg-[#E8DCC4] rounded-full overflow-hidden">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${completionRate}%`,
              }}
              transition={{
                delay: index * 0.05 + 0.3,
                duration: 0.5,
              }}
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-[#E8DCC4]/40 to-transparent" />
    </motion.div>
  );
}
