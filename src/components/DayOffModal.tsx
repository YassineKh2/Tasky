"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, CalendarOff, Palmtree, HelpCircle } from "lucide-react";

interface DayOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, reason: string | null) => void;
  dateStr: string;
}

export function DayOffModal({
  isOpen,
  onClose,
  onSave,
  dateStr,
}: DayOffModalProps) {
  const [type, setType] = useState<string>("REST");
  const [reason, setReason] = useState("");

  const handleSave = () => {
    if (type === "OTHER" && !reason.trim()) return;
    onSave(type, type === "OTHER" ? reason : null);
    setType("REST");
    setReason("");
  };

  const options = [
    { id: "REST", label: "Rest Day", icon: CalendarOff },
    { id: "VACATION", label: "Vacation", icon: Palmtree },
    { id: "OTHER", label: "Other", icon: HelpCircle },
  ];

  // Friendly date formatting
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2C2416]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-[#FFFBF5] rounded-lg shadow-xl border border-[#E8DCC4] z-50"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />

            <div className="relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-handwriting text-3xl text-[#2C2416]">
                    Mark Day Off
                  </h2>
                  <p className="font-serif-text text-sm text-[#8B7355]">
                    {formattedDate}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#E8DCC4]/30 rounded-full text-[#8B7355] hover:text-[#2C2416]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setType(opt.id)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border font-serif-text transition-all text-left
                        ${
                          type === opt.id
                            ? "bg-[#2C2416] border-[#2C2416] text-[#FAF7F0] shadow-md -translate-y-0.5"
                            : "bg-white border-[#E8DCC4] text-[#8B7355] hover:border-[#8B7355] hover:bg-[#FFFBF5]"
                        }
                      `}
                    >
                      <opt.icon
                        className={`w-5 h-5 ${type === opt.id ? "text-[#FAF7F0]" : "text-[#8B7355]"}`}
                      />
                      <span className="font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {type === "OTHER" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                      Reason for Day Off
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Sick day, Mental health day..."
                      className="w-full bg-white border-b-2 border-[#E8DCC4] focus:border-[#2C2416] px-4 py-3 font-handwriting text-xl text-[#2C2416] placeholder-[#E8DCC4] outline-none transition-colors"
                      autoFocus
                    />
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-6 mt-4 border-t border-[#E8DCC4] border-dashed">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 font-serif-text font-medium text-[#8B7355] hover:text-[#2C2416]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={type === "OTHER" && !reason.trim()}
                    className={`
                      flex-1 py-3 rounded-lg font-serif-text font-bold flex items-center justify-center gap-2 transition-all
                      ${
                        type === "OTHER" && !reason.trim()
                          ? "bg-[#E8DCC4] text-[#FFFBF5] cursor-not-allowed"
                          : "bg-[#2C2416] text-[#FAF7F0] shadow-lg hover:shadow-xl hover:-translate-y-1"
                      }
                    `}
                  >
                    <Check className="w-5 h-5" />
                    Save
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
