"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Camera, X, Maximize2 } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export function GallerySection({ gallery }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    gallery.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [gallery]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return gallery;
    return gallery.filter((g) => g.category === activeCategory);
  }, [gallery, activeCategory]);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-20 bg-black/5 dark:bg-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy dark:bg-gold/10 dark:text-gold text-xs font-bold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Showcase</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-custom-primary">
            Our Bakery & Sweets Gallery
          </h2>
          <p className="text-custom-secondary text-sm sm:text-base mt-2">
            A glance into our daily sweet craftsmanship, artisanal cakes, fresh bakery products, and store atmosphere.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-burgundy text-white shadow-md"
                  : "bg-black/5 dark:bg-white/5 text-custom-secondary hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md border border-black/10 dark:border-white/10 cursor-pointer bg-black/5 dark:bg-white/5"
            >
              <Image
                src={resolveMediaUrl(item.image, "/images/hero-fallback.jpg")}
                alt={item.title || "Bakery Gallery"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white z-10">
                <span className="text-[10px] uppercase font-bold text-gold tracking-widest mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {item.title || "Sargodha Sweets"}
                </h3>
                {item.description && (
                  <p className="text-xs text-gray-200 mt-1 line-clamp-2">{item.description}</p>
                )}

                <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-card-custom rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <div className="relative w-full h-[350px] sm:h-[500px]">
              <Image
                src={resolveMediaUrl(lightboxItem.image, "/images/hero-fallback.jpg")}
                alt={lightboxItem.title}
                fill
                className="object-contain bg-black"
              />
            </div>
            <div className="p-6 bg-card-custom">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">{lightboxItem.category}</span>
              <h3 className="font-serif text-2xl font-bold text-custom-primary mt-1">
                {lightboxItem.title}
              </h3>
              {lightboxItem.description && (
                <p className="text-sm text-custom-secondary mt-2">{lightboxItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
