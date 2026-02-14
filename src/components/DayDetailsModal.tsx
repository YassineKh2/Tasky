import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TaskDefinition {
  id: string;
  text: string;
  description?: string;
  baselineDuration: number;
  isRecurring: boolean;
  recurringDays: number[];
}

interface TaskAssignment {
  id: string;
  taskId: string;
  dateStr: string;
  durationOverride?: number;
  completed: boolean;
}

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string | null;
  taskDefinitions: TaskDefinition[];
  assignments: TaskAssignment[];
  isRestDay: boolean;
  noteContent?: string;
  onSaveNote?: (dateStr: string, content: string) => Promise<void>;
}

export function DayDetailsModal({
  isOpen,
  onClose,
  dateStr,
  taskDefinitions,
  assignments,
  isRestDay,
  noteContent = "",
  onSaveNote,
}: DayDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(noteContent);
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Update noteText when noteContent prop changes
  useEffect(() => {
    setNoteText(noteContent);
  }, [noteContent]);

  const handleSaveNote = async () => {
    if (!dateStr || !onSaveNote) return;
    try {
      setIsSavingNote(true);
      await onSaveNote(dateStr, noteText);
      setEditingNote(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSavingNote(false);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dateStr) return null;

  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dayOfWeek = date.getDay();

  // Get assignments for THIS specific day only
  const dayAssignments = assignments.filter((a) => a.dateStr === dateStr);

  // Determine tasks for this day
  const dayTasks = taskDefinitions
    .filter((def) => {
      // Check if it's a recurring day for this task
      if (def.isRecurring && def.recurringDays.includes(dayOfWeek)) return true;
      // Check if there is an assignment for this day specifically
      return dayAssignments.some((a) => a.taskId === def.id);
    })
    .map((def) => {
      const assignment = dayAssignments.find((a) => a.taskId === def.id);
      const isCompleted = !!assignment?.completed;
      const duration = assignment?.durationOverride || def.baselineDuration;
      return {
        ...def,
        isCompleted,
        duration,
        assignment,
      };
    });

  // Sort: Completed first, then by name
  dayTasks.sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? -1 : 1;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            ref={modalRef}
            className="w-full max-w-md bg-[#FFFBF5] rounded-xl shadow-xl border border-[#E8DCC4] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E8DCC4] bg-[#FFFBF5]">
              <div>
                <h3 className="font-handwriting text-2xl text-[#2C2416]">
                  {formattedDate}
                </h3>
                {isRestDay && (
                  <span className="inline-block px-2 py-0.5 mt-1 text-xs font-serif-text font-bold text-[#FFFBF5] bg-[#A69B8F] rounded-full">
                    Rest Day
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#8B7355] hover:bg-[#F0E0C0] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar relative">
              {dayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-serif-text text-[#8B7355] italic">
                    No tasks scheduled for this day.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                        task.isCompleted
                          ? "bg-white border-[#E8DCC4]"
                          : isRestDay
                            ? "bg-[#F5F5F5] border-transparent opacity-60"
                            : "bg-[#FFF5F5] border-[#E8DCC4]"
                      }`}
                    >
                      <div className="shrink-0">
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-[#8F7045]" />
                        ) : isRestDay ? (
                          <div className="w-6 h-6 rounded-full border-2 border-[#A69B8F] flex items-center justify-center" />
                        ) : (
                          <XCircle className="w-6 h-6 text-[#D97757]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-serif-text text-sm font-bold ${
                            task.isCompleted
                              ? "text-[#2C2416]"
                              : "text-[#5C4B37]"
                          }`}
                        >
                          {task.text}
                        </p>
                        {task.description && (
                          <p className="text-xs text-[#8B7355] truncate">
                            {task.description}
                          </p>
                        )}
                      </div>
                      {task.isCompleted && (
                        <div className="flex items-center gap-1 text-xs text-[#8B7355]">
                          <Clock className="w-3 h-3" />
                          <span>{task.duration}m</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Notes Section */}
              <div className="mt-6 pt-4 border-t border-[#E8DCC4]">
                <h4 className="font-serif-text text-sm font-bold text-[#2C2416] mb-2">
                  Daily Note
                </h4>
                {!editingNote ? (
                  <div
                    onClick={() => setEditingNote(true)}
                    className="p-3 bg-[#FFF8E7] border border-dashed border-[#E8DCC4] rounded-lg cursor-pointer hover:bg-[#FFF5F5] transition-colors min-h-[80px]"
                  >
                    {noteText ? (
                      <p className="font-serif-text text-sm text-[#2C2416] whitespace-pre-wrap">
                        {noteText}
                      </p>
                    ) : (
                      <p className="font-serif-text text-sm text-[#8B7355] italic">
                        Click to add a note...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      autoFocus
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Write your note here..."
                      className="w-full p-3 bg-white border border-[#E8DCC4] rounded-lg font-serif-text text-sm text-[#2C2416] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8F7045] resize-none min-h-[100px]"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingNote(false);
                          setNoteText(noteContent);
                        }}
                        className="px-3 py-1.5 text-xs font-serif-text font-bold text-[#8B7355] hover:bg-[#F0E0C0] rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNote}
                        disabled={isSavingNote}
                        className="px-3 py-1.5 text-xs font-serif-text font-bold text-[#FFFBF5] bg-[#8F7045] hover:bg-[#6F5838] rounded transition-colors disabled:opacity-50"
                      >
                        {isSavingNote ? "Saving..." : "Save Note"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Summary */}
            <div className="bg-[#F9F5EB] p-3 text-center border-t border-[#E8DCC4]">
              <p className="text-xs font-serif-text text-[#8B7355]">
                {dayTasks.filter((t) => t.isCompleted).length} completed •{" "}
                {dayTasks.filter((t) => !t.isCompleted).length} missed
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
