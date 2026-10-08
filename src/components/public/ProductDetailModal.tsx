"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MessageSquare, Phone, CheckCircle, AlertCircle, Share2 } from "lucide-react";

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
  status: string;
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappPhone?: string;
}

export function ProductDetailModal({ product, onClose, whatsappPhone = "+923001234567" }: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  let extraImages: string[] = [];
  try {
    if (product.additionalImages) {
      extraImages = JSON.parse(product.additionalImages);
    }
  } catch {
    extraImages = [];
  }

  const allImages = Array.from(new Set([product.image, ...extraImages].filter(Boolean)));
  const currentImage = selectedImage || allImages[0] || "/images/hero-fallback.jpg";

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/public/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryName,
          phone: inquiryPhone,
          productName: product.name,
          message: inquiryMsg || `Inquiry regarding ${product.name}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const cleanWhatsapp = whatsappPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello Sargodha Sweets & Bakers! I am interested in learning more about: ${product.name}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-cream dark:bg-[#1A171C] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          aria-label="Close product detail"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Column: Image Showcase */}
          <div className="p-6 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center">
            <div className="relative w-full h-[280px] sm:h-[340px] rounded-xl overflow-hidden shadow-lg border border-black/10 dark:border-white/10 bg-white">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail selector if multiple images exist */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto max-w-full pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      currentImage === img ? "border-burgundy dark:border-gold scale-105" : "border-transparent opacity-70"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Inquiry */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              {/* Availability tag */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold">Product Detail</span>
                {product.status === "temporarily_unavailable" ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                    <AlertCircle className="w-3 h-3" /> Temporarily Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                    <CheckCircle className="w-3 h-3" /> Available Fresh Daily
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-custom-primary mb-2">
                {product.name}
              </h2>

              {/* Price & Unit */}
              <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-black/10 dark:border-white/10">
                <span className="text-2xl font-extrabold text-burgundy dark:text-gold">
                  {product.priceDisplay || (product.price ? `Rs. ${product.price.toLocaleString()}` : "Price on Request")}
                </span>
                {!product.priceOnRequest && product.unit && (
                  <span className="text-sm font-medium text-custom-muted">/ {product.unit}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-custom-secondary text-sm sm:text-base leading-relaxed mb-4">
                {product.longDescription || product.description}
              </p>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 mb-6">
                  <span className="text-xs font-bold uppercase text-custom-primary block mb-1">Key Ingredients</span>
                  <p className="text-xs text-custom-secondary">{product.ingredients}</p>
                </div>
              )}
            </div>

            {/* Quick Inquiry Form / WhatsApp Action */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all mb-3"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask About This Product via WhatsApp</span>
              </a>

              {/* Quick Inquiry Form */}
              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium text-center">
                  Thank you! Your inquiry about {product.name} has been sent. Our team will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-2.5">
                  <span className="text-xs font-bold text-custom-primary block">Or Send Direct Inquiry:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#201D24] border border-black/10 dark:border-white/10 text-custom-primary"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Phone Number"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-[#201D24] border border-black/10 dark:border-white/10 text-custom-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-burgundy hover:bg-[#541625] text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
