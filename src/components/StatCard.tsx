import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  index?: number;
}
export function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.1,
      }}
      className="bg-white p-6 rounded-lg border border-[#E8DCC4] shadow-sm hover:shadow-md transition-all relative overflow-hidden"
    >
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-paper-texture" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-[#FFF8E7] rounded-lg">
            <Icon className="w-5 h-5 text-[#2C2416]" />
          </div>
        </div>

        <div className="font-handwriting text-4xl font-bold text-[#2C2416] mb-1">
          {value}
        </div>

        <div className="font-serif-text text-sm font-bold text-[#8B7355] uppercase tracking-wider">
          {label}
        </div>

        {subtitle && (
          <div className="font-serif-text text-xs text-[#8B7355] mt-1 italic">
            {subtitle}
          </div>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-tl from-[#E8DCC4]/40 to-transparent" />
    </motion.div>
  );
}
