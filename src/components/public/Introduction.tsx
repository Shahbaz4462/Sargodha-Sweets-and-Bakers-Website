"use client";

import React from "react";
import Image from "next/image";
import { Award, Clock, HeartHandshake, CheckCircle2 } from "lucide-react";

interface IntroductionProps {
  settings?: any;
}

export function Introduction({ settings }: IntroductionProps) {
  const heading = settings?.introHeading || "A Legacy of Taste Since 1990";
  const content =
    settings?.introContent ||
    "Sargodha Sweets & Bakers began its journey in 1990 when Muhammad Gulzar established the bakery together with his brother Muhammad Riaz. Over the years, the business developed its identity around traditional taste, quality ingredients, freshness and customer trust.";

  return (
    <section className="py-20 bg-cream dark:bg-[#121013] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/30 bg-burgundy">
              <div className="relative h-[380px] sm:h-[450px]">
                <Image
                  src="/images/cat-sweets.jpg"
                  alt="Traditional Pakistani Sweets"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-bold tracking-wider text-gold">Heritage Craftsmanship</span>
                  <p className="text-lg font-serif font-bold mt-1">Authentic Desi Sweets & Fresh Bakery Daily</p>
                </div>
              </div>
            </div>

            {/* Decorative Gold Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 z-20 bg-[#6B1D2F] text-white p-5 rounded-2xl shadow-2xl border border-gold/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-serif font-bold text-xl">
                35+
              </div>
              <div>
                <p className="text-xs font-medium text-gold uppercase tracking-wider">Years of</p>
                <p className="text-sm font-bold">Uncompromising Taste</p>
              </div>
            </div>
          </div>

          {/* Right Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B1D2F]/10 dark:bg-[#E5C158]/10 text-burgundy dark:text-gold text-xs font-bold uppercase tracking-widest mb-4 w-fit">
              <Clock className="w-3.5 h-3.5" />
              <span>Established 1990</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-custom-primary tracking-tight mb-6">
              {heading}
            </h2>

            <p className="text-custom-secondary text-base sm:text-lg leading-relaxed mb-8">
              {content}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <CheckCircle2 className="w-5 h-5 text-burgundy dark:text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-custom-primary">Pure Desi Ghee & Fresh Khoya</h3>
                  <p className="text-xs text-custom-muted mt-1">Zero synthetic additives. Made with authentic traditional recipes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <Award className="w-5 h-5 text-burgundy dark:text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-custom-primary">Food Scientist Direct Oversight</h3>
                  <p className="text-xs text-custom-muted mt-1">Managed by M.Phil Food Scientist Abdul Rehman (CUVAS).</p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div>
              <a
                href="#about"
                className="inline-flex items-center gap-2 font-semibold text-sm text-burgundy dark:text-gold hover:underline"
              >
                <span>Read more about our leadership & people behind the brand &rarr;</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
