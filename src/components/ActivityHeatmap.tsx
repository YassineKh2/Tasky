

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityHeatmapProps {
  data: { date: string; count: number; missed?: number; level: number }[];
  daysOff: string[];
  onDayClick?: (dateStr: string) => void;
}

export function ActivityHeatmap({ data, daysOff, onDayClick }: ActivityHeatmapProps) {
  const [hoveredData, setHoveredData] = useState<{
    x: number;
    y: number;
    date: string;
    count: number;
    missed: number;
    isRestDay: boolean;
    isFuture: boolean;
  } | null>(null);

  // Generate a full year (52 weeks) starting from Jan 1st 2026
  const START_DATE = new Date("2026-01-01");
  const dates: Date[] = [];
  
  // We want to fill 52 columns * 7 rows = 364 days
  // Or simply fill until the end of 2026 to look complete
  const END_DATE = new Date("2026-12-31");
  
  const current = new Date(START_DATE);
  while (current <= END_DATE) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Determine starting offset to align days correctly (Sunday = 0)
  const startDay = START_DATE.getDay();
  // We need to pad the beginning so the first day aligns with the correct row
  const paddedDates = Array(startDay).fill(null).concat(dates);

  // Group into weeks (columns)
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];
  
  paddedDates.forEach((date) => {
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Push remaining partial week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const getColor = (level: number, isRestDay: boolean, isFuture: boolean, missed: number) => {
    if (isFuture) return "bg-[#E5E7EB] border-transparent"; // Future: Cool Gray
    if (isRestDay) return "bg-[#A69B8F] opacity-80"; // Rest Day: Taupe
    if (missed > 0) return "bg-[#D97757]"; // Missed: Rust Red
    
    switch (level) {
      case 0: return "bg-[#FFFBF5]";
      case 1: return "bg-[#F0E0C0]"; // More visible Level 1
      case 2: return "bg-[#E0C595]"; // Level 2
      case 3: return "bg-[#C0A070]"; // Level 3
      case 4: return "bg-[#8F7045]"; // Level 4 (Darkest)
      default: return "bg-[#FFFBF5]";
    }
  };

  const today = new Date();
  today.setHours(0,0,0,0);

  const handleMouseEnter = (e: React.MouseEvent, date: string, count: number, missed: number, isRestDay: boolean, isFuture: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredData({
      x: rect.left + rect.width / 2, 
      y: rect.top, 
      date,
      count,
      missed,
      isRestDay,
      isFuture
    });
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[#E8DCC4] shadow-sm relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif-text text-lg font-bold text-[#8B7355] uppercase tracking-wider">
          Activity Log
        </h3>
        <span className="text-xs font-serif-text text-[#8B7355] italic">
          2026
        </span>
      </div>
      
      {/* Scroll container */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                if (!date) {
                  return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                }
                
                const dateStr = date.toISOString().split('T')[0];
                const dayData = data.find(d => d.date === dateStr);
                const level = dayData ? dayData.level : 0;
                const count = dayData ? dayData.count : 0;
                const missed = dayData?.missed || 0;
                const isRestDay = daysOff.includes(dateStr);
                const isFuture = date > today;
                
                const formattedDate = date.toLocaleDateString("en-US", { weekday: 'short', month: "short", day: "numeric" });

                return (
                  <div
                    key={dateStr}
                    onClick={() => onDayClick?.(dateStr)}
                    onMouseEnter={(e) => handleMouseEnter(e, formattedDate, count, missed, isRestDay, isFuture)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-3 h-3 rounded-sm border border-[#E8DCC4]/50 transition-all hover:scale-125 hover:z-10 relative cursor-pointer ${getColor(level, isRestDay, isFuture, missed)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tooltip Portal/Overlay */}
      <AnimatePresence>
        {hoveredData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              left: hoveredData.x,
              top: hoveredData.y - 8,
              x: "-50%",
              y: "-100%",
              zIndex: 1000,
              pointerEvents: 'none'
            }}
            className="fixed bg-[#FFFBF5] border border-[#E8DCC4] shadow-lg rounded-lg px-3 py-2 text-xs whitespace-nowrap z-50 pointer-events-none"
          >
            <div className="font-bold text-[#2C2416] mb-0.5">{hoveredData.date}</div>
            <div className="text-[#8B7355] italic">
              {hoveredData.isFuture ? "Upcoming" : 
               hoveredData.isRestDay ? "Rest Day" : 
               hoveredData.missed > 0 ? `${hoveredData.missed} tasks missed` :
               `${hoveredData.count} tasks completed`}
            </div>
            {/* Arrow/Tail */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#FFFBF5] border-r border-b border-[#E8DCC4]" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-wrap items-center gap-4 mt-2 justify-end">
        <div className="flex items-center gap-1.5 text-xs text-[#8B7355] font-serif-text">
           <div className="w-3 h-3 rounded-sm bg-[#E5E7EB] border border-[#E8DCC4]/30" />
           <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8B7355] font-serif-text">
           <div className="w-3 h-3 rounded-sm bg-[#A69B8F] opacity-80 border border-[#E8DCC4]/30" />
           <span>Rest</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8B7355] font-serif-text">
           <div className="w-3 h-3 rounded-sm bg-[#D97757] border border-[#E8DCC4]/30" />
           <span>Missed</span>
        </div>
        <div className="h-3 w-px bg-[#E8DCC4]" />
        <div className="flex items-center gap-1 text-xs text-[#8B7355] font-serif-text">
          <span>Less</span>
          <div className="w-3 h-3 bg-[#FFFBF5] border border-[#E8DCC4]/30 rounded-sm" />
          <div className="w-3 h-3 bg-[#F0E0C0] border border-[#E8DCC4]/30 rounded-sm" />
          <div className="w-3 h-3 bg-[#E0C595] border border-[#E8DCC4]/30 rounded-sm" />
          <div className="w-3 h-3 bg-[#C0A070] border border-[#E8DCC4]/30 rounded-sm" />
          <div className="w-3 h-3 bg-[#8F7045] border border-[#E8DCC4]/30 rounded-sm" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
