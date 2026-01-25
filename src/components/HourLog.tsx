import { motion } from "framer-motion";
interface HourLogProps {
  logs: string[];
}
export function HourLog({ logs }: HourLogProps) {
  return (
    <div className="border-l-2 border-[#E8DCC4] pl-3 ml-2 flex flex-col gap-2 min-w-[80px]">
      <h4 className="font-serif-text text-xs uppercase tracking-widest text-[#8B7355] mb-1">
        Log
      </h4>
      {logs.map((log, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: index * 0.1,
          }}
          className="relative"
        >
          <span className="font-handwriting text-[#6B5D4F] text-lg rotate-[-1deg] block">
            {log}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
