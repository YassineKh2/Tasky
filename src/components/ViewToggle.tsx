"use client";

import { motion } from "framer-motion";
import { Calendar, Layout, BarChart3 } from "lucide-react";
interface ViewToggleProps {
  view: "week" | "month" | "stats";
  onChange: (view: "week" | "month" | "stats") => void;
}
export function ViewToggle({ view, onChange }: ViewToggleProps) {
  const views = [
    {
      value: "week" as const,
      icon: Layout,
      label: "Week",
    },
    {
      value: "month" as const,
      icon: Calendar,
      label: "Month",
    },
    {
      value: "stats" as const,
      icon: BarChart3,
      label: "Stats",
    },
  ];
  const activeIndex = views.findIndex((v) => v.value === view);
  return (
    <div className="bg-[#FFFBF5] p-1 rounded-full border border-[#E8DCC4] shadow-sm flex items-center gap-1 relative overflow-hidden">
      {/* Active Indicator */}
      <motion.div
        className="absolute h-[calc(100%-8px)] rounded-full bg-[#E8DCC4]/50 z-0"
        layoutId="viewToggle"
        initial={false}
        animate={{
          width: `calc(${100 / views.length}% - 4px)`,
          left: `calc(${activeIndex * (100 / views.length)}% + 2px)`,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />

      {views.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`
            relative z-10 flex items-center gap-2 px-4 py-2 rounded-full transition-colors
            ${view === value ? "text-[#2C2416]" : "text-[#8B7355] hover:text-[#2C2416]"}
          `}
        >
          <Icon className="w-4 h-4" />
          <span className="font-serif-text text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
