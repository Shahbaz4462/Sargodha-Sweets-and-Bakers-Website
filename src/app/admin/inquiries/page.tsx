"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Phone, Mail, CheckCircle2, Archive, Trash2, Clock } from "lucide-react";

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (res.ok) setInquiries(data.inquiries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="w-7 h-7 text-[#D4AF37]" />
          Customer Inquiries
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Review customer messages submitted via website product inquiry forms and contact section.
        </p>
      </div>

      {/* List */}
      {inquiries.length === 0 ? (
        <div className="p-8 text-center bg-[#1A171C] rounded-2xl border border-white/10 text-gray-400 text-xs">
          No customer inquiries received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-6 rounded-2xl border transition-all ${
                inq.status === "new"
                  ? "bg-[#1A171C] border-[#D4AF37]/50 shadow-lg"
                  : "bg-[#18151B] border-white/10 opacity-80"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-base">{inq.name}</span>
                  {inq.productName && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#6B1D2F] text-white text-[10px] font-bold">
                      Item: {inq.productName}
                    </span>
                  )}
                  {inq.status === "new" && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black font-extrabold text-[10px]">
                      NEW
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(inq.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#E5C158]">
                  <a href={`tel:${inq.phone}`} className="flex items-center gap-1.5 hover:underline">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{inq.phone}</span>
                  </a>
                  {inq.email && (
                    <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 hover:underline text-gray-300">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{inq.email}</span>
                    </a>
                  )}
                </div>

                <p className="text-xs text-gray-200 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
                  "{inq.message}"
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {inq.status !== "read" && (
                  <button
                    onClick={() => handleUpdateStatus(inq.id, "read")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Read</span>
                  </button>
                )}

                {inq.status !== "archived" && (
                  <button
                    onClick={() => handleUpdateStatus(inq.id, "archived")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-semibold transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(inq.id)}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
