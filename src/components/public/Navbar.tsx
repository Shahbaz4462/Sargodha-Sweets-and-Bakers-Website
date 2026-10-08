"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Menu, X, Phone, ShoppingBag } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";

interface NavbarProps {
  settings?: any;
}

export function Navbar({ settings }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const businessName = settings?.businessName || "Sargodha Sweets & Bakers";
  const logoUrl = resolveMediaUrl(settings?.logoUrl, "/images/brand-seal.png");
  const phone = settings?.phone || "+92 300 1234567";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Our Story", href: "#timeline" },
    { name: "Team", href: "#team" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav py-3 shadow-md border-b border-black/5 dark:border-white/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo + Title */}
        <Link href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-[#6B1D2F] p-0.5 shadow-md transition-transform duration-300 group-hover:scale-105">
            <Image
              src={logoUrl}
              alt={businessName}
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-burgundy dark:text-[#E5C158] leading-tight">
              {businessName}
            </span>
            <span className="text-[11px] font-medium tracking-widest text-gold uppercase opacity-90">
              Est. 1990
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-custom-primary hover:text-burgundy dark:hover:text-gold transition-colors rounded-md"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions (Theme Toggle & Phone) */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border border-[#D4AF37]/50 text-burgundy dark:text-gold hover:bg-[#6B1D2F] hover:text-white transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{phone}</span>
          </a>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full border border-black/10 dark:border-white/15 text-custom-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gold" />
            ) : (
              <Moon className="w-5 h-5 text-burgundy" />
            )}
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full border border-black/10 dark:border-white/15 text-custom-primary"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gold" />
            ) : (
              <Moon className="w-5 h-5 text-burgundy" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg bg-burgundy text-white shadow-md focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[70px] bg-cream dark:bg-[#18151B] border-b border-black/10 dark:border-white/10 shadow-2xl p-6 transition-all duration-300">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold py-2 px-3 rounded-lg text-custom-primary hover:bg-[#6B1D2F]/10 hover:text-burgundy dark:hover:text-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl bg-burgundy text-white shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us: {phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
