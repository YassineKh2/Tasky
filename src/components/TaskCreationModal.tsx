"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Clock, Repeat } from "lucide-react";
interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    text: string;
    description?: string;
    baselineDuration: number;
    isRecurring: boolean;
    recurringDays: number[];
  }) => void;
}
export function TaskCreationModal({
  isOpen,
  onClose,
  onSave,
}: TaskCreationModalProps) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const weekDays = [
    {
      label: "S",
      value: 0,
    },
    {
      label: "M",
      value: 1,
    },
    {
      label: "T",
      value: 2,
    },
    {
      label: "W",
      value: 3,
    },
    {
      label: "T",
      value: 4,
    },
    {
      label: "F",
      value: 5,
    },
    {
      label: "S",
      value: 6,
    },
  ];
  const toggleDay = (day: number) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter((d) => d !== day));
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };
  const handleSave = () => {
    if (!text.trim()) return;
    onSave({
      text,
      description,
      baselineDuration: duration,
      isRecurring,
      recurringDays: isRecurring ? recurringDays : [],
    });
    // Reset
    setText("");
    setDescription("");
    setDuration(30);
    setIsRecurring(false);
    setRecurringDays([]);
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
            onClick={onClose}
            className="fixed inset-0 bg-[#2C2416]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 20,
            }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit max-h-[90vh] overflow-y-auto bg-[#FFFBF5] rounded-lg shadow-xl border border-[#E8DCC4] z-50"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />

            <div className="relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-handwriting text-3xl text-[#2C2416]">
                  New Task Definition
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#E8DCC4]/30 rounded-full text-[#8B7355] hover:text-[#2C2416]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., Read 10 pages..."
                    className="w-full bg-white border-b-2 border-[#E8DCC4] focus:border-[#2C2416] px-4 py-3 font-handwriting text-xl text-[#2C2416] placeholder-[#E8DCC4] outline-none transition-colors"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details..."
                    rows={3}
                    className="w-full bg-white border border-[#E8DCC4] rounded-lg px-4 py-3 font-serif-text text-[#2C2416] focus:border-[#2C2416] outline-none resize-none"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                    Baseline Duration
                  </label>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#8B7355]" />
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) =>
                        setDuration(parseInt(e.target.value) || 0)
                      }
                      className="w-24 bg-white border-b-2 border-[#E8DCC4] focus:border-[#2C2416] px-2 py-2 font-handwriting text-xl text-[#2C2416] text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-handwriting text-lg text-[#8B7355]">
                      minutes
                    </span>
                  </div>
                </div>

                {/* Recurring Toggle */}
                <div className="pt-4 border-t border-[#E8DCC4] border-dashed">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 font-serif-text text-sm font-bold text-[#8B7355] uppercase tracking-wider cursor-pointer">
                      <Repeat className="w-4 h-4" />
                      Recurring Task
                    </label>
                    <button
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${isRecurring ? "bg-[#2C2416]" : "bg-[#E8DCC4]"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isRecurring ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  {isRecurring && (
                    <div className="flex justify-between gap-1">
                      {weekDays.map((day) => (
                        <button
                          key={day.value}
                          onClick={() => toggleDay(day.value)}
                          className={`
                            w-9 h-9 rounded-full flex items-center justify-center font-handwriting text-lg transition-all
                            ${recurringDays.includes(day.value) ? "bg-[#2C2416] text-[#FAF7F0] shadow-md scale-110" : "bg-[#E8DCC4]/30 text-[#8B7355] hover:bg-[#E8DCC4]/60"}
                          `}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#E8DCC4] border-dashed">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 font-serif-text font-medium text-[#8B7355] hover:text-[#2C2416]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={
                      !text.trim() ||
                      (isRecurring && recurringDays.length === 0)
                    }
                    className={`
                      flex-1 py-3 rounded-lg font-serif-text font-bold flex items-center justify-center gap-2 transition-all
                      ${!text.trim() || (isRecurring && recurringDays.length === 0) ? "bg-[#E8DCC4] text-[#FFFBF5] cursor-not-allowed" : "bg-[#2C2416] text-[#FAF7F0] shadow-lg hover:shadow-xl hover:-translate-y-1"}
                    `}
                  >
                    <Check className="w-5 h-5" />
                    Create Definition
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
