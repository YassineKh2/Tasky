"use client";

import { motion } from "framer-motion";
import { CheckCircle2, PenTool } from "lucide-react";
interface CompleteDayButtonProps {
  isComplete: boolean;
  onClick: () => void;
}
export function CompleteDayButton({
  isComplete,
  onClick,
}: CompleteDayButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        y: -1,
      }}
      whileTap={{
        scale: 0.95,
        y: 1,
      }}
      className={`
        relative overflow-hidden group
        flex items-center gap-3 px-6 py-3 rounded-lg
        border-2 transition-all duration-300
        ${isComplete ? "bg-[#E8DCC4]/30 border-[#8B7355] text-[#6B5D4F]" : "bg-[#2C2416] border-[#2C2416] text-[#FAF7F0] shadow-md hover:shadow-lg"}
      `}
    >
      <div className="relative z-10 flex items-center gap-2 cursor-pointer">
        {isComplete ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-handwriting text-xl">Day Complete!</span>
          </>
        ) : (
          <>
            <PenTool className="w-5 h-5" />
            <span className="font-handwriting text-xl">
              Mark Today Complete
            </span>
          </>
        )}
      </div>

      {/* Ink splash effect on complete */}
      {isComplete && (
        <motion.div
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1.5,
            opacity: 0.1,
          }}
          className="absolute inset-0 bg-[#8B7355] rounded-full blur-xl"
        />
      )}
    </motion.button>
  );
}
