import { NextResponse } from "next/server";
import { checkAdminOrThrow, logAdminAction } from "@/lib/auth";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await checkAdminOrThrow();
    const settings = await db.select().from(siteSettings).limit(1);
    return NextResponse.json({ settings: settings[0] || null });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message?.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const body = await req.json();

    const existing = await db.select().from(siteSettings).limit(1);

    if (existing.length === 0) {
      await db.insert(siteSettings).values({
        ...body,
        updatedAt: new Date(),
      });
    } else {
      await db.update(siteSettings)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, existing[0].id));
    }

    await logAdminAction(admin.email, "UPDATE_SETTINGS", "Updated website branding, hero, or contact details");

    const updated = await db.select().from(siteSettings).limit(1);
    return NextResponse.json({ success: true, settings: updated[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: error.message?.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
