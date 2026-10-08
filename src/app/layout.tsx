import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sargodhasweets.com"),
  title: "Sargodha Sweets & Bakers | Since 1990 — A Tradition of Taste, Quality & Sweetness",
  description:
    "Official website of Sargodha Sweets & Bakers. Established in 1990 by Muhammad Gulzar and Muhammad Riaz. Current management led by Abdul Rehman (M.Phil Food Scientist - CUVAS). Handcrafting authentic Pakistani sweets, custom cakes, and fresh bakery products daily in Sargodha.",
  keywords: [
    "Sargodha Sweets",
    "Sargodha Bakers",
    "Gulab Jamun",
    "Barfi",
    "Desi Ghee Sweets",
    "Custom Birthday Cakes Sargodha",
    "Pakistani Sweets",
    "M.Phil Food Scientist Bakery",
    "Est 1990 Sargodha",
  ],
  openGraph: {
    title: "Sargodha Sweets & Bakers | Since 1990",
    description:
      "A Tradition of Taste, Quality & Sweetness. Discover handcrafted Pakistani sweets, custom cakes, and fresh bakery creations.",
    images: [{ url: "/images/cat-sweets.jpg" }],
  },
  icons: {
    icon: "/images/brand-seal.png",
    shortcut: "/images/brand-seal.png",
    apple: "/images/brand-seal.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-cream dark:bg-[#121013] text-custom-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
