"use client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
interface AddTaskButtonProps {
  onClick: () => void;
}
export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="
        flex items-center gap-2 px-5 py-2.5 rounded-full
        bg-[#FFF8E7] border-2 border-[#2C2416] border-dashed
        text-[#2C2416] font-handwriting text-xl font-bold
        hover:bg-[#2C2416] hover:text-[#FAF7F0] hover:border-transparent
        transition-all duration-300 shadow-sm
      "
    >
      <Plus className="w-5 h-5" />
      <span>Add Task</span>
    </motion.button>
  );
}
