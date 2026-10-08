import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { resolveMediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const [settings] = await db
      .select({ faviconUrl: siteSettings.faviconUrl, logoUrl: siteSettings.logoUrl })
      .from(siteSettings)
      .limit(1);
    const iconUrl = resolveMediaUrl(settings?.faviconUrl || settings?.logoUrl, "/images/brand-seal.png");

    return NextResponse.redirect(new URL(iconUrl, request.url), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.redirect(new URL("/images/brand-seal.png", request.url), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}