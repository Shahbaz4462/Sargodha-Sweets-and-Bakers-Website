"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121013] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-[#1A171C] rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        
        {/* Background ambient light */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#6B1D2F] rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-full border-2 border-[#D4AF37] bg-[#6B1D2F] p-1 shadow-lg">
              <Image
                src="/images/brand-seal.png"
                alt="Sargodha Sweets Admin"
                fill
                className="object-cover rounded-full"
              />
            </div>

            <h1 className="font-serif text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-1">Sargodha Sweets & Bakers Management System</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@sargodhasweets.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-semibold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center text-[11px] text-gray-500">
            Protected Admin Route — Sargodha Sweets & Bakers
          </div>
        </div>

      </div>
    </div>
  );
}
