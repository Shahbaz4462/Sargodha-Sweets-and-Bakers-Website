import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings, categories, products, teamMembers, timelines, gallery } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { eq, asc } from "drizzle-orm";
import { resolveMediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Seed database if necessary
    await seedDatabase();

    const [settingsList] = await Promise.all([
      db.select().from(siteSettings).limit(1),
    ]);

    const storedSettings = settingsList[0] || null;
    const settings = storedSettings
      ? {
          ...storedSettings,
          logoUrl: resolveMediaUrl(storedSettings.logoUrl),
          faviconUrl: resolveMediaUrl(storedSettings.faviconUrl),
          heroVideoUrl: resolveMediaUrl(storedSettings.heroVideoUrl),
          heroFallbackImage: resolveMediaUrl(storedSettings.heroFallbackImage),
        }
      : null;

    const [categoriesList, productsList, teamList, timelineList, galleryList] = await Promise.all([
      db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
      db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id)),
      db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
      db.select().from(timelines).orderBy(asc(timelines.sortOrder), asc(timelines.id)),
      db.select().from(gallery).orderBy(asc(gallery.sortOrder), asc(gallery.id)),
    ]);

    // Filter active items for public consumption
    const activeCategories = categoriesList
      .filter((category) => category.status === "active")
      .map((category) => ({ ...category, image: resolveMediaUrl(category.image) }));
    const activeProducts = productsList
      .filter((product) => product.status !== "hidden")
      .map((product) => ({ ...product, image: resolveMediaUrl(product.image) }));
    const activeTeam = teamList
      .filter((member) => member.status === "active")
      .map((member) => ({ ...member, image: resolveMediaUrl(member.image) }));
    const activeGallery = galleryList
      .filter((item) => item.status === "active")
      .map((item) => ({ ...item, image: resolveMediaUrl(item.image) }));

    return NextResponse.json({
      settings,
      categories: activeCategories,
      products: activeProducts,
      team: activeTeam,
      timeline: timelineList,
      gallery: activeGallery,
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("Public data error:", error);
    return NextResponse.json({ error: "Failed to fetch public data" }, { status: 500 });
  }
}
