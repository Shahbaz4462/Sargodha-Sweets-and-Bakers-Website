"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Settings, Save, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadAdminMedia } from "@/lib/media-upload";
import { resolveMediaUrl } from "@/lib/media";

export default function SiteSettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    tagline: "",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#6B1D2F",
    secondaryColor: "#D4AF37",
    introHeading: "",
    introContent: "",
    aboutTitle: "",
    aboutContent: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    openingHours: "",
    googleMapUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    footerText: "",
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        setForm({
          ...data.settings,
          logoUrl: resolveMediaUrl(data.settings.logoUrl),
          faviconUrl: resolveMediaUrl(data.settings.faviconUrl),
        });
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
      const url = await uploadAdminMedia(file, "brand");
      setForm((prev) => fieldName === "logoUrl"
        ? { ...prev, logoUrl: url, faviconUrl: url }
        : { ...prev, [fieldName]: url });
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
        setError(data.error || "Failed to update settings");
      } else {
        setMessage("Website settings and branding updated successfully!");
      }
    } catch (err) {
      setError("Failed to save settings");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="w-7 h-7 text-[#D4AF37]" />
            Website Settings & Branding
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Update business name, logo, contact details, map location, and footer copyright text.
          </p>
        </div>
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
        
        {/* Brand & Logo Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1A171C] border border-white/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
            Brand Identity & Logo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={form.businessName || ""}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Tagline / Slogan</label>
              <input
                type="text"
                value={form.tagline || ""}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Logo Upload Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Logo Image URL</label>
              <input
                type="text"
                value={form.logoUrl || ""}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value, faviconUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] mb-2"
              />
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 cursor-pointer font-semibold transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upload New Logo File</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={(e) => handleFileUpload(e, "logoUrl")}
                  className="hidden"
                />
              </label>
            </div>

            {form.logoUrl && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37] bg-[#6B1D2F]">
                  <Image src={resolveMediaUrl(form.logoUrl, "/images/brand-seal.png")} alt="Current Logo" fill className="object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Current Logo Preview</span>
                  <span className="text-[10px] text-gray-400">Displayed in navbar & footer</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1A171C] border border-white/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
            Contact & Address Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={form.whatsapp || ""}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Email Address</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Physical Address</label>
              <input
                type="text"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Opening Hours</label>
              <input
                type="text"
                value={form.openingHours || ""}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              value={form.googleMapUrl || ""}
              onChange={(e) => setForm({ ...form, googleMapUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Introduction & About Text */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1A171C] border border-white/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
            Homepage Introduction & About Story Text
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Intro Heading</label>
              <input
                type="text"
                value={form.introHeading || ""}
                onChange={(e) => setForm({ ...form, introHeading: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Intro Content Paragraph</label>
              <textarea
                rows={3}
                value={form.introContent || ""}
                onChange={(e) => setForm({ ...form, introContent: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">About Us Section Title</label>
              <input
                type="text"
                value={form.aboutTitle || ""}
                onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">About Us Story Content</label>
              <textarea
                rows={4}
                value={form.aboutContent || ""}
                onChange={(e) => setForm({ ...form, aboutContent: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Footer */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1A171C] border border-white/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-white/10 pb-3">
            Social Media Links & Footer Text
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Facebook URL</label>
              <input
                type="text"
                value={form.facebookUrl || ""}
                onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Instagram URL</label>
              <input
                type="text"
                value={form.instagramUrl || ""}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">YouTube URL</label>
              <input
                type="text"
                value={form.youtubeUrl || ""}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Footer Copyright Text</label>
            <input
              type="text"
              value={form.footerText || ""}
              onChange={(e) => setForm({ ...form, footerText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-4 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 border border-[#D4AF37]/30 disabled:opacity-50"
          >
            <Save className="w-5 h-5 text-[#D4AF37]" />
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
