"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // UI only, mock load
    setTimeout(() => setIsLoading(false), 1000);
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-white/60 border-b-2 border-[#E8DCC4] focus:border-[#2C2416] font-serif-text text-lg text-[#2C2416] placeholder-[#8B7355]/40 outline-none transition-all focus:bg-white rounded-t-sm"
                  />
                </div>
                <div className="mt-3 text-right">
                  <button type="button" className="text-sm font-serif-text text-[#8B7355] hover:text-[#2C2416] transition-colors italic hover:underline">
                    Forgot your password?
                  </button>
                </div>
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
    </div>
  );
}
