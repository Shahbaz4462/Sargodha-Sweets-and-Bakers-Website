"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
}

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory?: (slug: string) => void;
}

export function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-black/5 dark:bg-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            Handcrafted Delicacies
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-custom-primary mt-2">
            Explore Product Categories
          </h2>
          <p className="text-custom-muted text-sm sm:text-base mt-3">
            Select a category to view our handcrafted sweets, cakes, bakery, and savoury delights.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.slug);
                const catalogEl = document.getElementById("products");
                if (catalogEl) catalogEl.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-card-custom border border-black/5 dark:border-white/10 flex flex-col h-[280px]"
            >
              {/* Image background */}
              <div className="relative w-full h-full">
                <Image
                  src={cat.image || "/images/hero-fallback.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Card Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mt-1.5 font-light">
                    {cat.description}
                  </p>
                )}
                
                <div className="mt-4 flex items-center text-xs font-semibold text-gold gap-1 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <span>Browse {cat.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
