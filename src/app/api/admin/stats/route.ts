import { NextResponse } from "next/server";
import { checkAdminOrThrow } from "@/lib/auth";
import { db } from "@/db";
import { products, categories, teamMembers, gallery, siteSettings, auditLogs, inquiries } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    await checkAdminOrThrow();

    const [
      [totalProducts],
      [totalCategories],
      [featuredProducts],
      [totalGallery],
      [totalTeam],
      [totalInquiries],
      settingsList,
      logsList,
    ] = await Promise.all([
      db.select({ count: count() }).from(products),
      db.select({ count: count() }).from(categories),
      db.select({ count: count() }).from(products).where(eq(products.featured, true)),
      db.select({ count: count() }).from(gallery),
      db.select({ count: count() }).from(teamMembers),
      db.select({ count: count() }).from(inquiries),
      db.select().from(siteSettings).limit(1),
      db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(10),
    ]);

    const settings = settingsList[0] || null;

    return NextResponse.json({
      stats: {
        productsCount: totalProducts.count,
        categoriesCount: totalCategories.count,
        featuredCount: featuredProducts.count,
        galleryCount: totalGallery.count,
        teamCount: totalTeam.count,
        inquiriesCount: totalInquiries.count,
      },
      settings,
      recentLogs: logsList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message?.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
