"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Award, ShieldCheck } from "lucide-react";

interface HeroProps {
  settings?: any;
}

export function Hero({ settings }: HeroProps) {
  const [videoError, setVideoError] = useState(false);

  const heroSubtitle = settings?.heroSubtitle || "Since 1990";
  const heroTitle = settings?.heroTitle || "A Tradition of Taste, Quality & Sweetness";
  const heroDescription =
    settings?.heroDescription ||
    "Discover the authentic Pakistani sweets, artisanal cakes, and bakery creations that have been part of our family journey for generations.";
  const videoUrl = settings?.heroVideoUrl || "https://videos.pexels.com/video-files/8478025/8478025-hd_1920_1080_24fps.mp4";
  const fallbackImage = settings?.heroFallbackImage || "/images/cat-sweets.jpg";
  const videoEnabled = settings?.heroVideoEnabled ?? false;

  return (
    <section id="hero" className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Hero Media Background */}
      <div className="absolute inset-0 z-0">
        {videoEnabled && videoUrl && !videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover scale-105 transform duration-1000"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={fallbackImage}
            alt="Sargodha Sweets & Bakers Traditional Desserts"
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Elegant Gradient Dark Soft Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
        {/* Established Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 backdrop-blur-md mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#E5C158]" />
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#F2D272] uppercase">
            {heroSubtitle}
          </span>
          <Sparkles className="w-4 h-4 text-[#E5C158]" />
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight mb-6 drop-shadow-lg max-w-4xl">
          {heroTitle}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl font-light mb-10 leading-relaxed drop-shadow">
          {heroDescription}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="#products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#6B1D2F] hover:bg-[#8B233D] text-white font-semibold text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 border border-[#D4AF37]/40"
          >
            <span>Explore Our Products</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <a
            href="#timeline"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-md border border-white/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Our Story</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-6 text-white/80 text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span>100% Pure Desi Ghee</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-gold" />
            <span>Food Scientist Management</span>
          </div>
          <div className="flex items-center justify-center gap-2 col-span-2 sm:col-span-1">
            <Sparkles className="w-5 h-5 text-gold" />
            <span>35+ Years Heritage</span>
          </div>
        </div>
      </div>
    </section>
  );
}
