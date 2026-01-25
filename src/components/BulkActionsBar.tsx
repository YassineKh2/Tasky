import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onMarkComplete: () => void;
}
export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onMarkComplete,
}: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 100,
            opacity: 0,
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="bg-[#2C2416] text-[#FAF7F0] rounded-xl shadow-2xl p-4 flex items-center justify-between border border-[#E8DCC4]/20">
            <div className="flex items-center gap-3">
              <div className="bg-[#FAF7F0] text-[#2C2416] w-8 h-8 rounded-full flex items-center justify-center font-handwriting font-bold text-lg">
                {selectedCount}
              </div>
              <span className="font-serif-text font-medium">Days Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onMarkComplete}
                className="flex items-center gap-2 px-4 py-2 bg-[#FAF7F0] text-[#2C2416] rounded-lg font-serif-text font-bold hover:bg-white transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Complete All</span>
                <span className="sm:hidden">Done</span>
              </button>

              <button
                onClick={onClearSelection}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Clear selection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
