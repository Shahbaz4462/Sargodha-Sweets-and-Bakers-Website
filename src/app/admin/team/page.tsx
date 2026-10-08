"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Plus, Edit, Trash2, Upload, X, AlertCircle } from "lucide-react";

export default function TeamAdminPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    role: "",
    qualification: "",
    biography: "",
    image: "",
    status: "active",
    sortOrder: 0,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (res.ok) setTeam(data.team || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member: any = null) => {
    setError("");
    if (member) {
      setForm({
        id: member.id,
        name: member.name,
        role: member.role,
        qualification: member.qualification || "",
        biography: member.biography || "",
        image: member.image || "",
        status: member.status || "active",
        sortOrder: member.sortOrder || 0,
      });
    } else {
      setForm({
        id: null,
        name: "",
        role: "",
        qualification: "",
        biography: "",
        image: "/images/team-gulzar.jpg",
        status: "active",
        sortOrder: team.length + 1,
      });
    }
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm({ ...form, image: data.url });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save team member");
      } else {
        setModalOpen(false);
        fetchTeam();
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
      const res = await fetch(`/api/admin/team?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchTeam();
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
            <Users className="w-7 h-7 text-[#D4AF37]" />
            People Behind the Brand Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage profiles, photos, titles, qualifications, and biographies for founders and current management.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-lg transition-all border border-[#D4AF37]/30 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[#1A171C] border border-white/10 shadow-md flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-white/10 bg-black mb-4">
                <Image src={m.image || "/images/hero-fallback.jpg"} alt={m.name} fill className="object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#6B1D2F] text-white text-[10px] font-bold">
                  {m.role}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white">{m.name}</h3>
              {m.qualification && (
                <span className="text-xs font-semibold text-[#E5C158] block mt-0.5">{m.qualification}</span>
              )}
              <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{m.biography}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                m.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-gray-500/20 text-gray-400"
              }`}>
                {m.status === "active" ? "Active Profile" : "Hidden"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(m)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-gray-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(m.id)}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#1A171C] rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-white">
                {form.id ? "Edit Team Profile" : "Add Team Profile"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 bg-red-500/20 text-red-300 text-xs rounded-xl">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Founder, Current Management"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Qualification / Title</label>
                <input
                  type="text"
                  placeholder="e.g. M.Phil Food Scientist — CUVAS"
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={form.biography}
                  onChange={(e) => setForm({ ...form, biography: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Profile Photo URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 cursor-pointer font-semibold shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                  </select>
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
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-md border border-[#D4AF37]/30"
                >
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A171C] rounded-2xl border border-white/10 p-6 max-w-sm w-full space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">Confirm Member Deletion</h3>
            <p className="text-xs text-gray-400">Are you sure you want to remove this profile from the website?</p>
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
