"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Calendar, GraduationCap, Users } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";

interface TimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
  image?: string;
  sortOrder: number;
}

interface AboutAndTimelineProps {
  settings?: any;
  timelines: TimelineItem[];
}

export function AboutAndTimeline({ settings, timelines }: AboutAndTimelineProps) {
  const aboutTitle = settings?.aboutTitle || "Our Story & Commitment";
  const aboutContent =
    settings?.aboutContent ||
    "Sargodha Sweets & Bakers began its journey in 1990 when Muhammad Gulzar established the bakery together with his brother Muhammad Riaz. Over the years, the business developed its identity around traditional taste, quality ingredients, freshness and customer trust. Current management is handled by Abdul Rehman, an M.Phil Food Scientist from CUVAS, bringing modern food-science knowledge together with the bakery's traditional experience.";

  return (
    <section id="about" className="py-20 bg-black/5 dark:bg-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Us Card Banner */}
        <div id="our-story" className="relative rounded-3xl bg-card-custom border border-black/10 dark:border-white/10 p-8 sm:p-12 shadow-xl overflow-hidden mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy dark:bg-gold/10 dark:text-gold text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heritage & Science Hand-in-Hand</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-custom-primary mb-6">
                {aboutTitle}
              </h2>

              <p className="text-custom-secondary text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-line">
                {aboutContent}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-burgundy text-white flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-custom-primary block">Family Heritage</span>
                    <span className="text-xs text-custom-muted">Founded by Gulzar & Riaz</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-custom-primary block">Scientific Standards</span>
                    <span className="text-xs text-custom-muted">M.Phil Food Scientist CUVAS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-gold/30 overflow-hidden shadow-2xl bg-burgundy flex items-center justify-center p-2">
                <Image
                  src={resolveMediaUrl(settings?.logoUrl, "/images/brand-seal.png")}
                  alt="Sargodha Sweets Seal"
                  width={280}
                  height={280}
                  className="object-contain"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Timeline Section */}
        <div id="timeline" className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Milestones Through Time</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-custom-primary mt-2">
              Our Journey Since 1990
            </h2>
            <p className="text-custom-muted text-sm sm:text-base mt-2">
              How a small traditional sweet corner in Sargodha grew into a benchmark of sweet and bakery excellence.
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-burgundy/30 dark:bg-gold/30 transform sm:-translate-x-1/2" />

            <div className="space-y-12">
              {timelines.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                      isEven ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Content Box */}
                    <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:pr-8 sm:group-even:pl-8 sm:group-even:pr-0">
                      <div className="p-6 rounded-2xl bg-card-custom border border-black/10 dark:border-white/10 shadow-md hover:shadow-lg transition-all">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy text-white text-xs font-bold mb-3 shadow-sm">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>{item.year}</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-custom-primary mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-custom-secondary leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Node Badge */}
                    <div className="absolute left-4 sm:left-1/2 top-6 sm:top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-gold border-4 border-cream dark:border-[#121013] shadow-md flex items-center justify-center font-bold text-black text-xs">
                      •
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
