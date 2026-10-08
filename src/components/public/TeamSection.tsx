"use client";

import React from "react";
import Image from "next/image";
import { Award, UserCheck, ShieldCheck } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  qualification: string;
  biography: string;
  image: string;
  sortOrder: number;
}

interface TeamSectionProps {
  team: TeamMember[];
}

export function TeamSection({ team }: TeamSectionProps) {
  if (!team || team.length === 0) return null;

  return (
    <section id="team" className="py-20 bg-cream dark:bg-[#121013] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Leadership & Heritage</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-custom-primary">
            People Behind the Brand
          </h2>
          <p className="text-custom-secondary text-sm sm:text-base mt-2">
            Meet the founders who laid the foundation of trust and the food scientist driving modern excellence today.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-card-custom rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
            >
              {/* Photo Box */}
              <div className="relative w-full h-72 bg-black/5 dark:bg-white/5 overflow-hidden">
                <Image
                  src={member.image || "/images/hero-fallback.jpg"}
                  alt={`Initials monogram for ${member.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Role badge */}
                <span className="absolute bottom-4 left-4 bg-[#6B1D2F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {member.role}
                </span>
              </div>

              {/* Info Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-custom-primary mb-1">
                    {member.name}
                  </h3>

                  {member.qualification && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gold mb-3">
                      <Award className="w-3.5 h-3.5" />
                      <span>{member.qualification}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-custom-secondary leading-relaxed">
                    {member.biography}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-medium text-custom-muted">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-burgundy dark:text-gold" />
                    Verified Custodian
                  </span>
                  <span>Sargodha Sweets</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
