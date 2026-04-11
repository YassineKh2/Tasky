"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setIsLoading(true);
    setApiError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Success! Redirect to login (replace is generally better for auth flows)
      window.location.replace("/login");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-texture flex flex-col justify-center items-center p-4 font-serif-text py-12 md:py-8">
      
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center p-4 bg-[#2C2416] rounded-full text-[#FAF7F0] shadow-xl border border-[#FAF7F0]/20 mb-4 group hover:scale-105 transition-transform duration-300">
            <PenTool className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h1 className="font-handwriting text-5xl font-bold text-[#2C2416] mb-2 leading-none drop-shadow-sm">
            Tasky
          </h1>
          <p className="text-[#8B7355] italic text-lg font-medium tracking-wide">
            Start your journey today.
          </p>
        </div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#FFFBF5] rounded-2xl shadow-2xl border border-[#E8DCC4] p-8 md:p-10 relative overflow-hidden paper-shadow"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-paper-texture" />
          
          <div className="relative z-10">
            <h2 className="font-handwriting text-4xl text-[#2C2416] mb-8 text-center border-b-2 border-[#E8DCC4] pb-4 ink-shadow">
              Create a Journal
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#8B7355]/50 group-focus-within:text-[#2C2416] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="w-full pl-11 pr-4 py-3 bg-white/60 border-b-2 border-[#E8DCC4] focus:border-[#2C2416] font-serif-text text-lg text-[#2C2416] placeholder-[#8B7355]/40 outline-none transition-all focus:bg-white rounded-t-sm"
                  />
                </div>
              </div>

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
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-serif-text text-sm font-bold text-[#8B7355] mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#8B7355]/50 group-focus-within:text-[#2C2416] transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-white/60 border-b-2 border-[#E8DCC4] focus:border-[#2C2416] font-serif-text text-lg text-[#2C2416] placeholder-[#8B7355]/40 outline-none transition-all focus:bg-white rounded-t-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B7355]/50 hover:text-[#2C2416] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                   <p className="mt-2 text-xs font-serif-text text-[#8B7355] font-bold italic">
                     Passwords do not match.
                   </p>
                )}
                {apiError && (
                   <p className="mt-2 text-xs font-serif-text text-red-700 font-bold italic">
                     {apiError}
                   </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password || !name || password !== confirmPassword}
                className={`w-full py-4 rounded-xl font-serif-text font-bold text-xl flex items-center justify-center gap-3 transition-all mt-6 ${
                  isLoading || !email || !password || !name || password !== confirmPassword
                    ? "bg-[#E8DCC4] text-[#FAF7F0] cursor-not-allowed"
                    : "bg-[#2C2416] text-[#FAF7F0] shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-[#FFFBF5] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            {/* Footer / Login */}
            <div className="mt-8 text-center pt-6 border-t-2 border-[#E8DCC4] border-dashed">
              <p className="text-[#8B7355] font-serif-text text-lg">
                Already have a journal?{" "}
                <Link href="/login" className="text-[#2C2416] font-bold hover:underline decoration-2 underline-offset-4 ml-1 transition-all">
                  Sign in
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
          className="mt-10 text-center opacity-60"
        >
          <p className="font-handwriting text-2xl text-[#6B5D4F]">
            "A goal without a plan is just a wish."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
