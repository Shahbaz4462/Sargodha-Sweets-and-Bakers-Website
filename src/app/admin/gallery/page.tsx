"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Edit, Trash2, Upload, X, AlertCircle } from "lucide-react";
import { uploadAdminMedia } from "@/lib/media-upload";
import { resolveMediaUrl } from "@/lib/media";

export default function GalleryAdminPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
    category: "Sweets",
    status: "active",
    sortOrder: 0,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (res.ok) setGallery(data.gallery || []);
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
        title: item.title || "",
        description: item.description || "",
        image: resolveMediaUrl(item.image),
        category: item.category || "Sweets",
        status: item.status || "active",
        sortOrder: item.sortOrder || 0,
      });
    } else {
      setForm({
        id: null,
        title: "",
        description: "",
        image: "",
        category: "Sweets",
        status: "active",
        sortOrder: gallery.length + 1,
      });
    }
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadAdminMedia(file, "gallery");
      setForm((prev) => ({ ...prev, image: url }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save gallery item");
      } else {
        setModalOpen(false);
        fetchGallery();
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
      const res = await fetch(`/api/admin/gallery?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchGallery();
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
            <ImageIcon className="w-7 h-7 text-[#D4AF37]" />
            Gallery Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload and organize store photos, cakes, sweets, and production showcase items.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-lg transition-all border border-[#D4AF37]/30 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Upload New Gallery Photo</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((g) => (
          <div
            key={g.id}
            className="p-4 rounded-2xl bg-[#1A171C] border border-white/10 shadow-md flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-black mb-3">
                <Image src={resolveMediaUrl(g.image, "/images/hero-fallback.jpg")} alt={g.title || "Gallery"} fill className="object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#6B1D2F] text-white text-[10px] font-bold">
                  {g.category}
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-white">{g.title || "Untitled Photo"}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{g.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                g.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-gray-500/20 text-gray-400"
              }`}>
                {g.status === "active" ? "Active" : "Hidden"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(g)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-gray-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(g.id)}
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
                {form.id ? "Edit Gallery Item" : "Upload Gallery Item"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 bg-red-500/20 text-red-300 text-xs rounded-xl">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 cursor-pointer font-semibold shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Upload</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {form.image && (
                  <div className="relative mt-3 h-36 overflow-hidden rounded-lg border border-white/10 bg-black/5">
                    <Image src={resolveMediaUrl(form.image, "/images/hero-fallback.jpg")} alt="Gallery media preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Photo Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Hot Gulab Jamun"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Category Tag</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Sweets">Sweets</option>
                    <option value="Cakes">Cakes</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Interior">Interior</option>
                    <option value="Production">Production</option>
                  </select>
                </div>

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
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Caption / Description</label>
                <textarea
                  rows={2}
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
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-md border border-[#D4AF37]/30"
                >
                  {saving ? "Saving..." : "Save Photo"}
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
            <h3 className="font-serif text-lg font-bold text-white">Delete Gallery Photo</h3>
            <p className="text-xs text-gray-400">Are you sure you want to delete this photo?</p>
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
