import { NextResponse } from "next/server";
import { checkAdminOrThrow } from "@/lib/auth";
import { createMediaUpload } from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";

const mediaFolders = new Set(["brand", "hero", "products", "categories", "gallery", "team"]);

export async function POST(req: Request) {
  try {
    await checkAdminOrThrow();

    const body = await req.json();
    const { fileName, contentType, size, folder } = body;

    if (typeof fileName !== "string" || fileName.length > 255 || typeof contentType !== "string" || typeof size !== "number" || !mediaFolders.has(folder)) {
      return NextResponse.json({ error: "A valid file type, file size, and media folder are required." }, { status: 400 });
    }

    const upload = await createMediaUpload({ fileName, contentType, size, folder });
    return NextResponse.json(upload, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "File upload could not be prepared.";
    const status = message.includes("Unauthorized") ? 401 : message.includes("not configured") ? 503 : message.includes("Unsupported media type") || message.includes("must be smaller") ? 400 : 502;
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
