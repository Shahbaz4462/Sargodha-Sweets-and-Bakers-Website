"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Sparkles, AlertCircle, Info } from "lucide-react";
import { ProductDetailModal } from "./ProductDetailModal";
import { resolveMediaUrl } from "@/lib/media";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number | null;
  priceDisplay: string;
  priceOnRequest: boolean;
  unit: string;
  image: string;
  additionalImages: string;
  ingredients: string;
  featured: boolean;
  status: string;
}

interface ProductsCatalogProps {
  categories: Category[];
  products: Product[];
  selectedCategorySlug?: string;
  whatsappPhone?: string;
}

export function ProductsCatalog({
  categories,
  products,
  selectedCategorySlug = "all",
  whatsappPhone = "+923001234567",
}: ProductsCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync prop category change
  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setActiveCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Category ID map
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  // Slug to ID map
  const slugToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    categories.forEach((cat) => map.set(cat.slug, cat.id));
    return map;
  }, [categories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (activeCategory !== "all") {
        const catId = slugToIdMap.get(activeCategory);
        if (catId && prod.categoryId !== catId) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        const matchesIng = prod.ingredients.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesIng) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeCategory, searchQuery, slugToIdMap]);

  return (
    <section id="products" className="py-20 bg-cream dark:bg-[#121013] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Freshly Prepared Daily</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-custom-primary">
            Our Traditional & Bakery Creation Menu
          </h2>
          <p className="text-custom-secondary text-sm sm:text-base mt-3">
            Browse our complete selection of authentic Pakistani sweets, custom cakes, tea rusks, and savouries.
          </p>
        </div>

        {/* Search Bar & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === "all"
                  ? "bg-burgundy text-white shadow-md"
                  : "bg-black/5 dark:bg-white/5 text-custom-secondary hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              All Items ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? "bg-burgundy text-white shadow-md"
                    : "bg-black/5 dark:bg-white/5 text-custom-secondary hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              placeholder="Search sweets, cakes, rusks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-[#1A171C] border border-black/10 dark:border-white/10 text-xs font-medium text-custom-primary focus:outline-none focus:border-burgundy dark:focus:border-gold shadow-sm"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-custom-muted" />
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 max-w-md mx-auto p-8">
            <AlertCircle className="w-12 h-12 text-gold mx-auto mb-3 opacity-80" />
            <h3 className="font-serif text-lg font-bold text-custom-primary">No products found</h3>
            <p className="text-xs text-custom-muted mt-1 mb-4">
              We couldn&apos;t find any item matching &quot;{searchQuery}&quot; in this category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-4 py-2 rounded-full bg-burgundy text-white text-xs font-semibold shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const categoryName = categoryMap.get(product.categoryId) || "Sweets & Bakery";

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-card-custom rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative w-full h-48 bg-black/5 dark:bg-white/5 overflow-hidden">
                      <Image
                        src={resolveMediaUrl(product.image, "/images/hero-fallback.jpg")}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {categoryName}
                      </span>

                      {/* Featured Star Badge */}
                      {product.featured && (
                        <span className="absolute top-3 right-3 bg-gold text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                          Specialty
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-bold text-custom-primary group-hover:text-burgundy dark:group-hover:text-gold transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-xs text-custom-secondary line-clamp-2 mt-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Price & View Action */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5 mt-auto">
                    <div>
                      <span className="text-base font-extrabold text-burgundy dark:text-gold block">
                        {product.priceDisplay || (product.price ? `Rs. ${product.price.toLocaleString()}` : "Price on Request")}
                      </span>
                      {!product.priceOnRequest && product.unit && (
                        <span className="text-[10px] text-custom-muted block font-medium">/ {product.unit}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-burgundy/10 dark:bg-gold/10 text-burgundy dark:text-gold group-hover:bg-burgundy group-hover:text-white dark:group-hover:bg-gold dark:group-hover:text-black transition-all"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Detail Lightbox Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsappPhone={whatsappPhone}
      />
    </section>
  );
}
