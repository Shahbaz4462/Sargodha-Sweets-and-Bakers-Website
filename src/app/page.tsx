import React from "react";
import { db } from "@/db";
import { siteSettings, categories, products, teamMembers, timelines, gallery } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { asc } from "drizzle-orm";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { Introduction } from "@/components/public/Introduction";
import { CategoryGrid } from "@/components/public/CategoryGrid";
import { ProductsCatalog } from "@/components/public/ProductsCatalog";
import { AboutAndTimeline } from "@/components/public/AboutAndTimeline";
import { TeamSection } from "@/components/public/TeamSection";
import { GallerySection } from "@/components/public/GallerySection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";

export const revalidate = 0; // Fresh content on demand

export default async function HomePage() {
  // Ensure DB seed runs on startup
  await seedDatabase();

  const [settingsList, categoriesList, productsList, teamList, timelineList, galleryList] = await Promise.all([
    db.select().from(siteSettings).limit(1),
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
    db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id)),
    db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
    db.select().from(timelines).orderBy(asc(timelines.sortOrder), asc(timelines.id)),
    db.select().from(gallery).orderBy(asc(gallery.sortOrder), asc(gallery.id)),
  ]);

  const settings = settingsList[0] || null;

  // Filter active records
  const activeCategories = categoriesList.filter((c) => c.status === "active");
  const activeProducts = productsList.filter((p) => p.status !== "hidden");
  const activeTeam = teamList.filter((t) => t.status === "active");
  const activeGallery = galleryList.filter((g) => g.status === "active");

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-burgundy selection:text-white">
        <Navbar settings={settings} />

        <main className="flex-grow">
          <Hero settings={settings} />
          <Introduction settings={settings} />
          <CategoryGrid categories={activeCategories} />
          <ProductsCatalog
            categories={activeCategories}
            products={activeProducts}
            whatsappPhone={settings?.whatsapp}
          />
          <AboutAndTimeline settings={settings} timelines={timelineList} />
          <TeamSection team={activeTeam} />
          <GallerySection gallery={activeGallery} />
          <ContactSection settings={settings} />
        </main>

        <Footer settings={settings} categories={activeCategories} />
      </div>
    </ThemeProvider>
  );
}
