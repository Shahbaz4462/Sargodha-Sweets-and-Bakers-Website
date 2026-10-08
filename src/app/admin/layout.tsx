"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Video,
  ShoppingBag,
  Grid,
  Users,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();

        if (!res.ok || !data.authenticated) {
          window.location.href = "/admin/login";
        } else {
          setUser(data.user);
        }
      } catch (err) {
        window.location.href = "/admin/login";
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    window.location.href = "/admin/login";
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121013] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#E5C158]">Securing Admin Session...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Site Settings", href: "/admin/settings", icon: Settings },
    { name: "Hero Media", href: "/admin/hero", icon: Video },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: Grid },
    { name: "Team Members", href: "/admin/team", icon: Users },
    { name: "Story Timeline", href: "/admin/timeline", icon: Calendar },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#121013] text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-[#18151B] border-r border-white/10 flex-col justify-between shrink-0">
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full border border-[#D4AF37] overflow-hidden bg-[#6B1D2F]">
              <Image src="/images/logo.png" alt="Sargodha Sweets Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold block text-white">Sargodha Sweets</span>
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Admin Dashboard</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#6B1D2F] text-white shadow-md border border-[#D4AF37]/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-gray-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-white/5 text-xs">
            <span className="text-gray-400 block text-[10px]">Logged in as:</span>
            <span className="font-bold text-gray-200 truncate block">{user?.email || "Admin"}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              View Public Website
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#18151B] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full border border-[#D4AF37] overflow-hidden bg-[#6B1D2F]">
            <Image src="/images/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <span className="font-serif text-sm font-bold">Admin Dashboard</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/10 text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#18151B] p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="font-serif text-lg font-bold text-[#D4AF37]">Admin Navigation</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-200 hover:bg-[#6B1D2F]"
                  >
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-sm font-semibold text-white"
            >
              <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
              View Public Website
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
