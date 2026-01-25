import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
}
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  taskName,
}: DeleteConfirmModalProps) {
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
            className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-[#FFFBF5] rounded-lg shadow-xl border border-[#E8DCC4] z-50 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />

            <div className="relative z-10 p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <h3 className="font-handwriting text-2xl text-[#2C2416] mb-2">
                Delete Task?
              </h3>
              <p className="font-serif-text text-[#8B7355] mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold text-[#2C2416]">"{taskName}"</span>?
                This will remove all assignments of this task.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 font-serif-text font-medium text-[#8B7355] hover:text-[#2C2416] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg font-serif-text font-bold flex items-center justify-center gap-2 bg-red-600 text-white shadow-md hover:bg-red-700 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
