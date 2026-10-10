import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [settings] = await db
      .select({ businessName: siteSettings.businessName, logoUrl: siteSettings.logoUrl, faviconUrl: siteSettings.faviconUrl })
      .from(siteSettings)
      .limit(1);

    return NextResponse.json(settings || {}, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Public site settings query failed");
    if (error instanceof Error) {
      console.error(error.message);
    }
    return NextResponse.json({ error: "Could not load public branding settings." }, { status: 500 });
  }
}