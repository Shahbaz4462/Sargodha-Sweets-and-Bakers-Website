"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { uploadAdminMedia } from "@/lib/media-upload";
import { resolveMediaUrl } from "@/lib/media";
import {
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Search,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Star,
  Eye,
} from "lucide-react";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    id: null,
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    price: "",
    priceDisplay: "",
    priceOnRequest: false,
    unit: "Per kg",
    image: "",
    additionalImages: "[]",
    ingredients: "",
    featured: false,
    status: "available",
    sortOrder: 0,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);

      const pData = await pRes.json();
      const cData = await cRes.json();

      if (pRes.ok) setProducts(pData.products || []);
      if (cRes.ok) setCategories(cData.categories || []);
    } catch (err) {
      console.error(err);
    } fontLoading: {
      setLoading(false);
    }
  };

  const handleOpenModal = (prod: any = null) => {
    setError("");
    setSuccess("");
    if (prod) {
      setForm({
        id: prod.id,
        categoryId: prod.categoryId,
        name: prod.name,
        slug: prod.slug || "",
        description: prod.description || "",
        longDescription: prod.longDescription || "",
        price: prod.price !== null ? String(prod.price) : "",
        priceDisplay: prod.priceDisplay || "",
        priceOnRequest: prod.priceOnRequest || false,
        unit: prod.unit || "Per kg",
        image: resolveMediaUrl(prod.image),
        additionalImages: prod.additionalImages || "[]",
        ingredients: prod.ingredients || "",
        featured: prod.featured || false,
        status: prod.status || "available",
        sortOrder: prod.sortOrder || 0,
      });
    } else {
      setForm({
        id: null,
        categoryId: categories[0]?.id || "",
        name: "",
        slug: "",
        description: "",
        longDescription: "",
        price: "",
        priceDisplay: "",
        priceOnRequest: false,
        unit: "Per kg",
        image: "",
        additionalImages: "[]",
        ingredients: "",
        featured: false,
        status: "available",
        sortOrder: 0,
      });
    }
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAdditional = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadAdminMedia(file, "products");
      {
        if (isAdditional) {
          let list: string[] = [];
          try {
            list = JSON.parse(form.additionalImages);
          } catch {
            list = [];
          }
          list.push(url);
          setForm((prev) => ({ ...prev, additionalImages: JSON.stringify(list) }));
        } else {
          setForm((prev) => ({ ...prev, image: url }));
        }
      }
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
    setSuccess("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save product");
      } else {
        setSuccess("Product saved successfully!");
        setModalOpen(false);
        fetchData();
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
      const res = await fetch(`/api/admin/products?id=${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== "all" && String(p.categoryId) !== String(filterCategory)) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-[#D4AF37]" />
            Products Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Add, update, or remove bakery items, pricing, images, and category assignments.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-lg transition-all border border-[#D4AF37]/30 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A171C] border border-white/10">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-400 font-semibold shrink-0">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] w-full sm:w-auto"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#1A171C] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 uppercase font-semibold">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price / Unit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                          <Image src={resolveMediaUrl(p.image, "/images/hero-fallback.jpg")} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">{p.name}</span>
                          <span className="text-[11px] text-gray-400 line-clamp-1">{p.description}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-300 font-medium">
                      {categoryMap.get(p.categoryId) || "Uncategorized"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#E5C158] block">
                        {p.priceDisplay || (p.price ? `Rs. ${p.price.toLocaleString()}` : "Price on Request")}
                      </span>
                      {!p.priceOnRequest && p.unit && (
                        <span className="text-[10px] text-gray-400 block">{p.unit}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.status === "available" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                          Available
                        </span>
                      )}
                      {p.status === "temporarily_unavailable" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                          Temp Unavailable
                        </span>
                      )}
                      {p.status === "hidden" && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-500/20 text-gray-400 font-semibold text-[10px]">
                          Hidden
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#E5C158] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[10px]">Standard</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-gray-200 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#1A171C] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-serif text-xl font-bold text-white">
                {form.id ? "Edit Product" : "Create New Product"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Category *</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    disabled={form.priceOnRequest}
                    placeholder="1200"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Per kg">Per kg</option>
                    <option value="Per 500g">Per 500g</option>
                    <option value="Per box">Per box</option>
                    <option value="Per piece">Per piece</option>
                    <option value="Per dozen">Per dozen</option>
                    <option value="Per cake">Per cake</option>
                    <option value="Per tray">Per tray</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.priceOnRequest}
                      onChange={(e) => setForm({ ...form, priceOnRequest: e.target.checked })}
                      className="rounded bg-[#221F26] border-white/20 text-[#6B1D2F] focus:ring-0"
                    />
                    <span>Price on Request</span>
                  </label>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Brief summary shown on product card"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Full recipe details, serving suggestions, etc."
                  value={form.longDescription}
                  onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Main Product Image URL</label>
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
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
                {form.image && (
                  <div className="relative mt-3 h-36 w-36 overflow-hidden rounded-lg border border-white/10 bg-black/5">
                    <Image src={resolveMediaUrl(form.image, "/images/hero-fallback.jpg")} alt="Product media preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Ingredients & Settings */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Ingredients</label>
                <input
                  type="text"
                  placeholder="e.g. Khoya, Desi Ghee, Saffron, Cardamom"
                  value={form.ingredients}
                  onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Availability Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#221F26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="available">Available Fresh Daily</option>
                    <option value="temporarily_unavailable">Temporarily Unavailable</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded bg-[#221F26] border-white/20 text-[#6B1D2F] focus:ring-0"
                    />
                    <span>Mark as Featured / Specialty</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 rounded-xl bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-bold text-xs shadow-md transition-all border border-[#D4AF37]/30 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Product"}
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
            <h3 className="font-serif text-lg font-bold text-white">Confirm Product Deletion</h3>
            <p className="text-xs text-gray-400">
              Are you sure you want to permanently delete this product? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
