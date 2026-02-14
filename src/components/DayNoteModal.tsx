"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2 } from "lucide-react";

interface DayNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  onDelete: () => Promise<void>;
  dayName: string;
  date: string;
  initialContent?: string;
}

export function DayNoteModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  dayName,
  date,
  initialContent = "",
}: DayNoteModalProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, isOpen]);

  const handleSave = async () => {
    if (content.trim() === initialContent.trim()) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await onSave(content);
      onClose();
    } catch (err) {
      console.error("Error saving note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      console.error("Error deleting note:", err);
    } finally {
      setIsDeleting(false);
    }
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl bg-[#FFFBF5] rounded-lg shadow-2xl pointer-events-auto border border-[#E8DCC4]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DCC4]">
                <div>
                  <h2 className="font-handwriting text-3xl font-bold text-[#2C2416]">
                    {dayName}
                  </h2>
                  <p className="text-sm text-[#8B7355] italic mt-1">{date}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#E8DCC4]/30 rounded-full transition-colors text-[#8B7355] hover:text-[#2C2416]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add your notes for this day..."
                  className="w-full h-64 p-4 border border-[#E8DCC4] rounded-lg bg-white text-[#2C2416] placeholder-[#8B7355]/40 focus:outline-none focus:ring-2 focus:ring-[#2C2416]/20 focus:border-[#2C2416] resize-none font-serif-text"
                />
                <div className="mt-2 text-xs text-[#8B7355]/60">
                  {content.length} characters
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8DCC4] bg-[#FFFBF5]">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || !initialContent}
                  title={
                    !initialContent ? "No note to delete" : "Delete this note"
                  }
                  className="p-2 text-[#8B7355] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg text-[#8B7355] hover:bg-[#E8DCC4]/30 transition-colors font-serif-text"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 rounded-lg bg-[#2C2416] text-[#FAF7F0] hover:bg-[#2C2416]/90 transition-colors font-serif-text flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {content.trim() === "" ? "Clear Note" : "Save Note"}
                    </span>
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
