import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings, categories, products, teamMembers, timelines, gallery } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    // Seed database if necessary
    await seedDatabase();

    const [settingsList] = await Promise.all([
      db.select().from(siteSettings).limit(1),
    ]);

    const settings = settingsList[0] || null;

    const [categoriesList, productsList, teamList, timelineList, galleryList] = await Promise.all([
      db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
      db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id)),
      db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
      db.select().from(timelines).orderBy(asc(timelines.sortOrder), asc(timelines.id)),
      db.select().from(gallery).orderBy(asc(gallery.sortOrder), asc(gallery.id)),
    ]);

    // Filter active items for public consumption
    const activeCategories = categoriesList.filter(c => c.status === "active");
    const activeProducts = productsList.filter(p => p.status !== "hidden");
    const activeTeam = teamList.filter(t => t.status === "active");
    const activeGallery = galleryList.filter(g => g.status === "active");

    return NextResponse.json({
      settings,
      categories: activeCategories,
      products: activeProducts,
      team: activeTeam,
      timeline: timelineList,
      gallery: activeGallery,
    });
  } catch (error) {
    console.error("Public data error:", error);
    return NextResponse.json({ error: "Failed to fetch public data" }, { status: 500 });
  }
}
