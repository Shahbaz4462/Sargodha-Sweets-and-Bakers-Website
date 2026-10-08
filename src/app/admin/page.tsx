"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Grid,
  Star,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Video,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const settings = data?.settings || {};
  const recentLogs = data?.recentLogs || [];

  const statCards = [
    { name: "Total Products", value: stats.productsCount || 0, icon: ShoppingBag, href: "/admin/products", color: "from-amber-500/20 to-amber-700/20" },
    { name: "Categories", value: stats.categoriesCount || 0, icon: Grid, href: "/admin/categories", color: "from-burgundy/40 to-burgundy/10" },
    { name: "Featured Products", value: stats.featuredCount || 0, icon: Star, href: "/admin/products", color: "from-yellow-500/20 to-amber-600/20" },
    { name: "Gallery Photos", value: stats.galleryCount || 0, icon: ImageIcon, href: "/admin/gallery", color: "from-purple-500/20 to-indigo-600/20" },
    { name: "Team Members", value: stats.teamCount || 0, icon: Users, href: "/admin/team", color: "from-blue-500/20 to-cyan-600/20" },
    { name: "Customer Inquiries", value: stats.inquiriesCount || 0, icon: MessageSquare, href: "/admin/inquiries", color: "from-emerald-500/20 to-teal-600/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1A171C] via-[#221D26] to-[#1A171C] border border-white/10 shadow-2xl relative overflow-hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
            Official Bakery Control Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome to Sargodha Sweets & Bakers Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Manage all website content, products, team profiles, hero video background, history timeline, and contact information without touching any source code.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-semibold text-xs border border-[#D4AF37]/30 shadow-lg transition-all shrink-0"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
        </Link>
      </div>

      {/* Hero Video Quick Status Card */}
      <div className="p-6 rounded-2xl bg-[#1A171C] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-white">Hero Background Video</h3>
            <div className="flex items-center gap-2 mt-1">
              {settings.heroVideoEnabled ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Video Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <XCircle className="w-3.5 h-3.5" /> Fallback Image Mode Active
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/admin/hero"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
        >
          Manage Hero Media & Text &rarr;
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.name}
              href={card.href}
              className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} bg-[#1A171C] border border-white/10 hover:border-[#D4AF37]/50 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group`}
            >
              <div>
                <span className="text-xs font-semibold text-gray-400 block">{card.name}</span>
                <span className="text-3xl font-extrabold text-white mt-1 block group-hover:text-[#D4AF37] transition-colors">
                  {card.value}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Activity Log */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1A171C] border border-white/10 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="font-serif text-lg font-bold text-white">Recent Admin Activity Audit Log</h2>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-gray-500">No admin activities recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {recentLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#E5C158]">{log.action}</td>
                    <td className="py-3 px-4 text-gray-400">{log.adminEmail}</td>
                    <td className="py-3 px-4">{log.details}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
