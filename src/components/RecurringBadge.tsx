import { Repeat } from "lucide-react";
interface RecurringBadgeProps {
  days: number[]; // 0-6
}
export function RecurringBadge({ days }: RecurringBadgeProps) {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const getLabel = () => {
    if (days.length === 7) return "Daily";
    if (days.length === 5 && !days.includes(0) && !days.includes(6))
      return "Weekdays";
    if (days.length === 2 && days.includes(0) && days.includes(6))
      return "Weekends";
    return days
      .sort()
      .map((d) => weekDays[d])
      .join(" ");
  };
  return (
    <div className="flex items-center gap-1 bg-[#E8DCC4]/40 px-2 py-0.5 rounded-full text-[10px] font-serif-text font-bold text-[#8B7355] uppercase tracking-wider">
      <Repeat className="w-3 h-3" />
      <span>{getLabel()}</span>
    </div>
  );
}
