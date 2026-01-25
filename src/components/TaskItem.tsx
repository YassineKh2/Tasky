import { motion } from "framer-motion";
import { Check, X, RotateCw } from "lucide-react";
import { DurationInput } from "./DurationInput";
interface Task {
  id: string;
  text: string;
  completed: boolean;
  duration: number;
  assignmentId: string;
  isRecurring?: boolean;
}
interface TaskItemProps {
  task: Task;
  onToggle: (assignmentId: string) => void;
  onDurationChange: (assignmentId: string, duration: number) => void;
  onRemove?: (assignmentId: string) => void;
  disabled?: boolean;
}
export function TaskItem({
  task,
  onToggle,
  onDurationChange,
  onRemove,
  disabled = false,
}: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: disabled ? 0.5 : 1,
        y: 0,
      }}
      className={`group flex items-start gap-3 py-1 ${disabled ? "pointer-events-none" : ""}`}
    >
      {/* Checkbox */}
      <div
        onClick={() => !disabled && onToggle(task.assignmentId)}
        className="relative mt-1 flex-shrink-0 w-5 h-5 border-2 border-[#8B7355] rounded-md flex items-center justify-center transition-colors duration-300 hover:border-[#2C2416] cursor-pointer"
      >
        {task.completed && (
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Check className="w-4 h-4 text-[#2C2416] stroke-[3]" />
          </motion.div>
        )}
      </div>

      {/* Task Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <span
            onClick={() => !disabled && onToggle(task.assignmentId)}
            className={`font-handwriting text-xl leading-tight transition-all duration-300 flex-1 cursor-pointer
              ${task.completed ? "text-[#6B5D4F] line-through decoration-[#8B7355]/50 decoration-2" : "text-[#2C2416]"}
            `}
          >
            {task.text}
          </span>

          <div className="flex items-center gap-1">
            {/* Duration Display/Edit */}
            <div onClick={(e) => e.stopPropagation()}>
              <DurationInput
                duration={task.duration}
                onChange={(d) => onDurationChange(task.assignmentId, d)}
                className={disabled ? "opacity-50" : ""}
              />
            </div>

            {/* Remove Button or Recurring Indicator */}
            {task.isRecurring ? (
              <div
                className="opacity-50 p-1 text-[#8B7355] cursor-help"
                title="Recurring task - cannot be deleted from day view"
              >
                <RotateCw className="w-4 h-4" />
              </div>
            ) : (
              onRemove &&
              !disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(task.assignmentId);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-[#8B7355] hover:text-red-600 transition-all"
                  title="Remove task from this day"
                >
                  <X className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
