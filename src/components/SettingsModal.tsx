"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Lock, CalendarOff, SkipForward } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Settings UI state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Toggle states
  const [countRestDaysAsMissing, setCountRestDaysAsMissing] = useState(false);
  const [countVacationDaysAsMissing, setCountVacationDaysAsMissing] = useState(false);
  const [resetStreakAtVacationDay, setResetStreakAtVacationDay] = useState(true);
  const [resetStreakAtRestDay, setResetStreakAtRestDay] = useState(true);

  const Toggle = ({ label, icon: Icon, state, onToggle }: { label: string, icon: React.ElementType, state: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between py-3">
      <label className="flex items-center gap-3 font-serif-text text-sm font-bold text-[#8B7355] uppercase tracking-wider cursor-pointer select-none">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative flex items-center ${state ? "bg-[#2C2416]" : "bg-[#E8DCC4]"}`}
      >
        <motion.div
          initial={false}
          animate={{ x: state ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );

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
            className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] overflow-y-auto bg-[#FFFBF5] rounded-lg shadow-xl border border-[#E8DCC4] z-50"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />

            <div className="relative z-10 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Settings className="w-8 h-8 text-[#2C2416]" />
                  <h2 className="font-handwriting text-3xl text-[#2C2416]">
                    Settings
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#E8DCC4]/30 rounded-full text-[#8B7355] hover:text-[#2C2416] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Account Settings */}
                <div>
                  <h3 className="font-handwriting text-2xl text-[#2C2416] mb-4 border-b-2 border-[#E8DCC4] pb-2">
                    Account
                  </h3>
                  
                  {!isChangingPassword ? (
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center gap-2 text-[#8B7355] hover:text-[#2C2416] font-serif-text font-bold text-sm uppercase tracking-wider transition-colors py-2"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 bg-white p-4 rounded-lg border border-[#E8DCC4]"
                    >
                      <div>
                        <label className="block font-serif-text text-xs font-bold text-[#8B7355] mb-1 uppercase tracking-wider">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-[#FFFBF5] border border-[#E8DCC4] focus:border-[#2C2416] rounded px-3 py-2 text-[#2C2416] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block font-serif-text text-xs font-bold text-[#8B7355] mb-1 uppercase tracking-wider">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#FFFBF5] border border-[#E8DCC4] focus:border-[#2C2416] rounded px-3 py-2 text-[#2C2416] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block font-serif-text text-xs font-bold text-[#8B7355] mb-1 uppercase tracking-wider">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[#FFFBF5] border border-[#E8DCC4] focus:border-[#2C2416] rounded px-3 py-2 text-[#2C2416] outline-none transition-colors"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => setIsChangingPassword(false)}
                          className="flex-1 py-2 font-serif-text text-sm font-bold text-[#8B7355] hover:text-[#2C2416] transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            // Mock save logic
                            setIsChangingPassword(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          disabled={!newPassword || newPassword !== confirmPassword}
                          className="flex-1 py-2 bg-[#2C2416] text-[#FAF7F0] font-serif-text text-sm font-bold rounded shadow disabled:opacity-50 transition-all hover:bg-[#1a150d]"
                        >
                          Save Password
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Tracker Behavior */}
                <div>
                  <h3 className="font-handwriting text-2xl text-[#2C2416] mb-4 border-b-2 border-[#E8DCC4] pb-2">
                    Tracker Rules
                  </h3>
                  <div className="space-y-1">
                    <Toggle 
                      label="Count rest days as missing" 
                      icon={CalendarOff} 
                      state={countRestDaysAsMissing} 
                      onToggle={() => setCountRestDaysAsMissing(!countRestDaysAsMissing)} 
                    />
                    <Toggle 
                      label="Count vacation days as missing" 
                      icon={CalendarOff} 
                      state={countVacationDaysAsMissing} 
                      onToggle={() => setCountVacationDaysAsMissing(!countVacationDaysAsMissing)} 
                    />
                    <Toggle 
                      label="Reset streak at a vacation day" 
                      icon={SkipForward} 
                      state={resetStreakAtVacationDay} 
                      onToggle={() => setResetStreakAtVacationDay(!resetStreakAtVacationDay)} 
                    />
                    <Toggle 
                      label="Reset streak at a rest day" 
                      icon={SkipForward} 
                      state={resetStreakAtRestDay} 
                      onToggle={() => setResetStreakAtRestDay(!resetStreakAtRestDay)} 
                    />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
