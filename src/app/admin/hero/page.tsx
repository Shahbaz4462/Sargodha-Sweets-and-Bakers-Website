"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Video, Upload, Save, CheckCircle2, AlertCircle, Play, Eye } from "lucide-react";
import { uploadAdminMedia } from "@/lib/media-upload";
import { resolveMediaUrl } from "@/lib/media";

export default function HeroAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    heroSubtitle: "Since 1990",
    heroTitle: "A Tradition of Taste, Quality & Sweetness",
    heroDescription: "Discover the authentic Pakistani sweets, artisanal cakes, and bakery creations that have been part of our family journey for generations.",
    heroVideoUrl: "",
    heroFallbackImage: "/images/cat-sweets.jpg",
    heroVideoEnabled: false,
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        const heroVideoUrl = resolveMediaUrl(data.settings.heroVideoUrl);
        setForm((prev) => ({
          ...prev,
          heroSubtitle: data.settings.heroSubtitle || prev.heroSubtitle,
          heroTitle: data.settings.heroTitle || prev.heroTitle,
          heroDescription: data.settings.heroDescription || prev.heroDescription,
          heroVideoUrl,
          heroFallbackImage: resolveMediaUrl(data.settings.heroFallbackImage, "/images/cat-sweets.jpg"),
          heroVideoEnabled: Boolean(data.settings.heroVideoEnabled && heroVideoUrl),
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchSettings();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await uploadAdminMedia(file, "hero");
      setForm((prev) => ({
        ...prev,
        [fieldName]: url,
        ...(fieldName === "heroVideoUrl" ? { heroVideoEnabled: true } : {}),
      }));
      setMessage("Upload complete. Save changes to publish this media.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save hero settings");
      } else {
        setMessage("Hero section media and text updated successfully!");
      }
    } catch (err) {
      setError("Failed to save hero settings");
    } finally {
      setSaving(false);
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
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
          <Video className="w-7 h-7 text-[#D4AF37]" />
          Hero Section & Video Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Configure the hero section video background, fallback image, and main headline text.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Toggle Video Enable / Disable */}
        <div className="p-6 rounded-2xl bg-[#1A171C] border border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-white">Enable Video Background</h3>
            <p className="text-xs text-gray-400">
              When enabled, plays looping background video. When disabled, displays fallback hero image.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.heroVideoEnabled}
              onChange={(e) => setForm({ ...form, heroVideoEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B1D2F]"></div>
          </label>
        </div>

        {/* Video & Fallback Image Settings */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1A171C] border border-white/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
            Hero Video & Fallback Image
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Hero Video URL (MP4 / WebM)</label>
              <input
                type="text"
                value={form.heroVideoUrl || ""}
                onChange={(e) => setForm({ ...form, heroVideoUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] mb-2"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 cursor-pointer font-semibold transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upload Video File (MP4/WebM up to 50MB)</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => handleFileUpload(e, "heroVideoUrl")}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Fallback Hero Image URL</label>
              <input
                type="text"
                value={form.heroFallbackImage || ""}
                onChange={(e) => setForm({ ...form, heroFallbackImage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] mb-2"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 cursor-pointer font-semibold transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upload Fallback Image File</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={(e) => handleFileUpload(e, "heroFallbackImage")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-gray-300 block mb-2">Live Hero Background Preview</span>
            <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-white/10 bg-black">
              {form.heroVideoEnabled && resolveMediaUrl(form.heroVideoUrl) ? (
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src={resolveMediaUrl(form.heroVideoUrl)} type={/\.webm(?:$|\?)/i.test(form.heroVideoUrl) ? "video/webm" : "video/mp4"} />
                </video>
              ) : (
                <Image
                  src={resolveMediaUrl(form.heroFallbackImage, "/images/cat-sweets.jpg")}
                  alt="Hero Preview"
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">{form.heroSubtitle}</span>
                  <h3 className="font-serif text-xl font-bold text-white mt-1">{form.heroTitle}</h3>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">{form.heroDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Headings Text */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1A171C] border border-white/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
            Hero Text Content
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Subtitle Badge (e.g. &quot;Since 1990&quot;)</label>
              <input
                type="text"
                required
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Main Hero Headline</label>
              <input
                type="text"
                required
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Hero Description Paragraph</label>
              <textarea
                rows={3}
                required
                value={form.heroDescription}
                onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-4 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 border border-[#D4AF37]/30 disabled:opacity-50"
          >
            <Save className="w-5 h-5 text-[#D4AF37]" />
            <span>{saving ? "Saving Changes..." : "Save Hero Settings"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
