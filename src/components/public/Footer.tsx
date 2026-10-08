"use client";

import React from "react";
import Image from "next/image";
import { Phone, MapPin, Clock } from "lucide-react";

interface FooterProps {
  settings?: any;
  categories?: any[];
}

export function Footer({ settings, categories = [] }: FooterProps) {
  const businessName = settings?.businessName || "Sargodha Sweets & Bakers";
  const logoUrl = settings?.logoUrl || "/images/logo.png";
  const tagline = settings?.tagline || "Since 1990 — A Tradition of Taste, Quality & Sweetness";
  const address = settings?.address || "Main Bazaar, Near Clock Tower, Sargodha, Punjab, Pakistan";
  const phone = settings?.phone || "+92 300 1234567";
  const openingHours = settings?.openingHours || "Monday – Sunday: 7:00 AM – 11:00 PM";
  const facebookUrl = settings?.facebookUrl || "#";
  const instagramUrl = settings?.instagramUrl || "#";
  const youtubeUrl = settings?.youtubeUrl || "#";
  const footerText = settings?.footerText || `© 1990 - 2026 ${businessName}. All rights reserved.`;

  return (
    <footer className="bg-[#18151B] text-gray-300 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold bg-burgundy shrink-0">
                <Image src={logoUrl} alt={businessName} fill className="object-cover" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white block leading-tight">
                  {businessName}
                </span>
                <span className="text-[11px] font-semibold text-gold tracking-widest uppercase">
                  Est. 1990
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed pt-2">
              {tagline}. Handcrafting authentic Pakistani mithai, fresh bakery delights, and custom celebration cakes with uncompromising quality.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-black text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-black text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-black text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-gold transition-colors">Products</a></li>
              <li><a href="#about" className="hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#timeline" className="hover:text-gold transition-colors">Our Story</a></li>
              <li><a href="#team" className="hover:text-gold transition-colors">Our Team</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Gallery</a></li>
              <li><a href="#contact" className="hover:text-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <a href="#products" className="hover:text-gold transition-colors">
                      {cat.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#products" className="hover:text-gold transition-colors">Traditional Sweets</a></li>
                  <li><a href="#products" className="hover:text-gold transition-colors">Custom Cakes</a></li>
                  <li><a href="#products" className="hover:text-gold transition-colors">Fresh Bakery</a></li>
                  <li><a href="#products" className="hover:text-gold transition-colors">Snacks & Savouries</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Store Info */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">
              Store Info
            </h4>
            <p className="flex items-start gap-2 text-gray-400">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>{address}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-400">
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <span>{phone}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4 text-gold shrink-0" />
              <span>{openingHours}</span>
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{footerText}</p>
          <div className="text-[11px] text-gray-600">
            A Tradition of Quality Since 1990
          </div>
        </div>
      </div>
    </footer>
  );
}
