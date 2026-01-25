import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  ChevronLeft,
  Plus,
  Clock,
  Edit2,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";
import { RecurringBadge } from "./RecurringBadge";
interface TaskDefinition {
  id: string;
  text: string;
  description?: string;
  baselineDuration: number;
  isRecurring: boolean;
  recurringDays: number[];
}
interface TaskLibraryProps {
  tasks: TaskDefinition[];
  onAssign: (taskId: string) => void;
  onCreateTask: () => void;
  onEditTask: (task: TaskDefinition) => void;
  onDeleteTask: (task: TaskDefinition) => void;
}
export function TaskLibrary({
  tasks,
  onAssign,
  onCreateTask,
  onEditTask,
  onDeleteTask,
}: TaskLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "copy";
  };
  return (
    <>
      {/* Toggle Button - Fixed position, doesn't move with sidebar */}
      <motion.button
        initial={{
          x: -100,
        }}
        animate={{
          x: 0,
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 px-3 py-4 rounded-r-xl bg-[#2C2416] text-[#FAF7F0] shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <Book className="w-5 h-5" />
        )}
        {!isOpen && (
          <span className="font-handwriting text-lg vertical-text hidden md:block">
            Library
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Only on mobile (where drag-drop isn't used) */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#2C2416]/20 backdrop-blur-sm z-30 md:hidden"
            />

            <motion.div
              initial={{
                x: -320,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -320,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed left-0 top-0 bottom-0 w-[320px] bg-[#FFFBF5] border-r border-[#E8DCC4] shadow-2xl z-40 flex flex-col"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />

              {/* Header with Close Button */}
              <div className="relative z-10 p-6 border-b border-[#E8DCC4] border-dashed bg-[#FFF8E7]">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-handwriting text-3xl text-[#2C2416]">
                    Task Library
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-[#E8DCC4]/30 rounded-full text-[#8B7355] hover:text-[#2C2416] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="font-serif-text text-sm text-[#8B7355] italic">
                  Drag tasks to calendar or assign manually
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 opacity-50">
                    <p className="font-handwriting text-xl text-[#8B7355]">
                      No tasks yet...
                    </p>
                    <p className="font-serif-text text-xs text-[#8B7355] mt-2">
                      Create one to get started!
                    </p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, task.id)}
                      className="group bg-white p-3 rounded-lg border border-[#E8DCC4] hover:border-[#2C2416] hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-[#E8DCC4] mt-1" />
                          <div>
                            <h3 className="font-handwriting text-xl text-[#2C2416] leading-tight">
                              {task.text}
                            </h3>
                            {task.description && (
                              <p className="text-xs text-[#8B7355] line-clamp-1 mt-0.5">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                            className="p-1 hover:bg-[#E8DCC4]/30 rounded text-[#8B7355] hover:text-[#2C2416]"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTask(task);
                            }}
                            className="p-1 hover:bg-red-50 rounded text-[#8B7355] hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-[#8B7355] text-xs font-serif-text bg-[#FFF8E7] px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          {formatDuration(task.baselineDuration)}
                        </div>
                        {task.isRecurring && (
                          <RecurringBadge days={task.recurringDays} />
                        )}
                      </div>

                      <button
                        onClick={() => onAssign(task.id)}
                        className="w-full mt-3 py-1.5 bg-[#E8DCC4]/30 hover:bg-[#2C2416] text-[#8B7355] hover:text-[#FAF7F0] rounded text-sm font-serif-text font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Assign
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-[#E8DCC4] bg-[#FFF8E7] relative z-10">
                <button
                  onClick={onCreateTask}
                  className="w-full py-3 bg-[#2C2416] text-[#FAF7F0] rounded-lg font-handwriting text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Task
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
