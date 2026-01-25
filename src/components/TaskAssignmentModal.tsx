import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Check, Clock } from "lucide-react";
interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (dateStr: string, duration?: number) => void;
  taskName: string;
  baselineDuration: number;
}
export function TaskAssignmentModal({
  isOpen,
  onClose,
  onAssign,
  taskName,
  baselineDuration,
}: TaskAssignmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [duration, setDuration] = useState<number>(baselineDuration);
  const [useCustomDuration, setUseCustomDuration] = useState(false);
  const handleAssign = () => {
    onAssign(selectedDate, useCustomDuration ? duration : undefined);
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
            className="fixed inset-0 m-auto w-full max-w-md h-fit bg-[#FFFBF5] rounded-lg shadow-xl border border-[#E8DCC4] z-50 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />

            <div className="relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-handwriting text-3xl text-[#2C2416]">
                  Assign Task
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#E8DCC4]/30 rounded-full text-[#8B7355] hover:text-[#2C2416]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-[#FFF8E7] rounded-lg border border-[#E8DCC4] border-dashed">
                <h3 className="font-handwriting text-2xl text-[#2C2416] mb-1">
                  {taskName}
                </h3>
                <div className="flex items-center gap-2 text-[#8B7355] font-serif-text text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Baseline: {baselineDuration} mins</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white border border-[#E8DCC4] rounded-lg pl-10 pr-4 py-3 font-serif-text text-[#2C2416] focus:border-[#2C2416] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block font-serif-text text-sm font-bold text-[#8B7355] uppercase tracking-wider">
                      Duration for this day
                    </label>
                    <button
                      onClick={() => setUseCustomDuration(!useCustomDuration)}
                      className={`text-xs font-bold px-2 py-1 rounded ${useCustomDuration ? "bg-[#2C2416] text-[#FAF7F0]" : "bg-[#E8DCC4]/30 text-[#8B7355]"}`}
                    >
                      {useCustomDuration ? "Custom" : "Default"}
                    </button>
                  </div>

                  {useCustomDuration ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) =>
                          setDuration(parseInt(e.target.value) || 0)
                        }
                        className="w-24 bg-white border-b-2 border-[#2C2416] px-2 py-1 font-handwriting text-xl text-[#2C2416] text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-handwriting text-lg text-[#8B7355]">
                        minutes
                      </span>
                    </div>
                  ) : (
                    <div className="text-[#8B7355] font-serif-text italic text-sm">
                      Using baseline duration ({baselineDuration} mins)
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#E8DCC4] border-dashed">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 font-serif-text font-medium text-[#8B7355] hover:text-[#2C2416]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    className="flex-1 py-3 rounded-lg font-serif-text font-bold flex items-center justify-center gap-2 bg-[#2C2416] text-[#FAF7F0] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <Check className="w-5 h-5" />
                    Assign Task
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
