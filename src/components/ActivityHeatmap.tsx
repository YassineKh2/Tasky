import { motion } from "framer-motion";
import { Tooltip } from "recharts";

interface ActivityHeatmapProps {
  data: { date: string; count: number; level: number }[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Generate last 365 days
  const today = new Date();
  const dates = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  const getColor = (level: number) => {
    switch (level) {
      case 0: return "bg-[#FFFBF5]";
      case 1: return "bg-[#F5EDD9]";
      case 2: return "bg-[#E8DCC4]";
      case 3: return "bg-[#D4C4B0]";
      case 4: return "bg-[#C0B09C]";
      default: return "bg-[#FFFBF5]";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[#E8DCC4] shadow-sm">
      <h3 className="font-serif-text text-lg font-bold text-[#8B7355] mb-4 uppercase tracking-wider">
        Activity Log
      </h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {Array.from({ length: 53 }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const dateIndex = weekIndex * 7 + dayIndex;
              if (dateIndex >= dates.length) return null;
              
              const date = dates[dateIndex];
              const dateStr = date.toISOString().split('T')[0];
              const dayData = data.find(d => d.date === dateStr);
              const level = dayData ? dayData.level : 0;
              const count = dayData ? dayData.count : 0;

              return (
                <div
                  key={dateStr}
                  className={`w-3 h-3 rounded-sm ${getColor(level)} border border-[#E8DCC4]/30`}
                  title={`${dateStr}: ${count} tasks completed`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-[#8B7355] justify-end font-serif-text">
        <span>Less</span>
        <div className="w-3 h-3 bg-[#FFFBF5] border border-[#E8DCC4]/30 rounded-sm" />
        <div className="w-3 h-3 bg-[#F5EDD9] border border-[#E8DCC4]/30 rounded-sm" />
        <div className="w-3 h-3 bg-[#E8DCC4] border border-[#E8DCC4]/30 rounded-sm" />
        <div className="w-3 h-3 bg-[#D4C4B0] border border-[#E8DCC4]/30 rounded-sm" />
        <div className="w-3 h-3 bg-[#C0B09C] border border-[#E8DCC4]/30 rounded-sm" />
        <span>More</span>
      </div>
    </div>
  );
}
