"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Mail, Lock, ArrowRight, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showForgotPopup, setShowForgotPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      window.location.replace("/");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-texture flex flex-col justify-center items-center p-4 font-serif-text">
      
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex justify-center items-center p-4 bg-[#2C2416] rounded-full text-[#FAF7F0] shadow-xl border border-[#FAF7F0]/20 mb-6 group hover:scale-105 transition-transform duration-300">
            <PenTool className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h1 className="font-handwriting text-6xl font-bold text-[#2C2416] mb-3 leading-none drop-shadow-sm">
            Tasky
          </h1>
          <p className="text-[#8B7355] italic text-xl font-medium tracking-wide">
            Focus on what matters, one day at a time.
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#FFFBF5] rounded-2xl shadow-2xl border border-[#E8DCC4] p-8 md:p-10 relative overflow-hidden paper-shadow"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />
          
          <div className="relative z-10">
            <h2 className="font-handwriting text-4xl text-[#2C2416] mb-8 text-center border-b-2 border-[#E8DCC4] pb-4 ink-shadow">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#8B7355]/50 group-focus-within:text-[#2C2416] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/60 border-b-2 border-[#E8DCC4] focus:border-[#2C2416] font-serif-text text-lg text-[#2C2416] placeholder-[#8B7355]/40 outline-none transition-all focus:bg-white rounded-t-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#8B7355]/50 group-focus-within:text-[#2C2416] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-white/60 border-b-2 border-[#E8DCC4] focus:border-[#2C2416] font-serif-text text-lg text-[#2C2416] placeholder-[#8B7355]/40 outline-none transition-all focus:bg-white rounded-t-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B7355]/50 hover:text-[#2C2416] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPopup(true)}
                    className="text-sm font-serif-text text-[#8B7355] hover:text-[#2C2416] transition-colors italic hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                {apiError && (
                   <div className="mt-3 text-center">
                     <p className="text-sm font-serif-text text-red-700 font-bold italic">
                       {apiError}
                     </p>
                   </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className={`w-full py-4 rounded-xl font-serif-text font-bold text-xl flex items-center justify-center gap-3 transition-all mt-6 ${
                  !email || !password
                    ? "bg-[#E8DCC4] text-[#FAF7F0] cursor-not-allowed"
                    : "bg-[#2C2416] text-[#FAF7F0] shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-[#FFFBF5] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Open Journal
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            {/* Footer / Sign Up */}
            <div className="mt-8 text-center pt-6 border-t-2 border-[#E8DCC4] border-dashed">
              <p className="text-[#8B7355] font-serif-text text-lg">
                Don't have a journal yet?{" "}
                <Link href="/register" className="text-[#2C2416] font-bold hover:underline decoration-2 underline-offset-4 ml-1 transition-all">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Footer quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 text-center opacity-60"
        >
          <p className="font-handwriting text-2xl text-[#6B5D4F]">
            "The secret of your future is hidden in your daily routine."
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Popup */}
      <AnimatePresence>
        {showForgotPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForgotPopup(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-[#FFFBF5] rounded-2xl shadow-2xl border border-[#E8DCC4] p-8 max-w-sm w-full paper-shadow"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowForgotPopup(false)}
                className="absolute top-4 right-4 text-[#8B7355]/60 hover:text-[#2C2416] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="p-3 bg-[#2C2416]/10 rounded-full">
                  <Mail className="w-8 h-8 text-[#2C2416]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-handwriting text-3xl text-[#2C2416] text-center mb-4">
                Password Recovery
              </h3>

              {/* Message */}
              <p className="font-serif-text text-[#8B7355] text-center text-base leading-relaxed mb-5">
                To recover your password, please contact us at:
              </p>

              {/* Email address */}
              <div className="bg-white/80 border border-[#E8DCC4] rounded-xl py-3 px-4 text-center mb-6">
                <a
                  href="mailto:yassinekhemiri.dev@gmail.com"
                  className="font-serif-text text-[#2C2416] font-bold text-lg hover:underline underline-offset-4 decoration-2"
                >
                  yassinekhemiri.dev@gmail.com
                </a>
              </div>

              {/* Close action */}
              <button
                onClick={() => setShowForgotPopup(false)}
                className="w-full py-3 rounded-xl bg-[#2C2416] text-[#FAF7F0] font-serif-text font-bold text-base hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
