"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Trash2, X, AlertCircle } from "lucide-react";

export default function TimelineAdminPage() {
  const [timelines, setTimelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    id: null,
    year: "",
    title: "",
    description: "",
    sortOrder: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const res = await fetch("/api/admin/timeline");
      const data = await res.json();
      if (res.ok) setTimelines(data.timelines || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: any = null) => {
    setError("");
    if (item) {
      setForm({
        id: item.id,
        year: item.year,
        title: item.title,
        description: item.description || "",
        sortOrder: item.sortOrder || 0,
      });
    } else {
      setForm({
        id: null,
        year: "",
        title: "",
        description: "",
        sortOrder: timelines.length + 1,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save timeline event");
      } else {
        setModalOpen(false);
        fetchTimeline();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/timeline?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchTimeline();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-[#D4AF37]" />
            Story Timeline Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage historical milestone events for Sargodha Sweets & Bakers from 1990 to present day.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-lg transition-all border border-[#D4AF37]/30 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add Timeline Event</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {timelines.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#1A171C] border border-white/10 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <span className="px-3.5 py-1.5 rounded-xl bg-[#6B1D2F] text-white font-bold text-sm shrink-0 border border-[#D4AF37]/30">
                {item.year}
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => handleOpenModal(item)}
                className="p-2 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#1A171C] rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-white">
                {form.id ? "Edit Timeline Event" : "Add Timeline Event"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 bg-red-500/20 text-red-300 text-xs rounded-xl">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Year / Era *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1990, Today"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Opening of First Store"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-md border border-[#D4AF37]/30"
                >
                  {saving ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A171C] rounded-2xl border border-white/10 p-6 max-w-sm w-full space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Delete Timeline Event</h3>
            <p className="text-xs text-gray-400">Are you sure you want to delete this event?</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-gray-300">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
