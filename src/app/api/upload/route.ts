import { NextResponse } from "next/server";
import { checkAdminOrThrow } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    // Require admin session for file uploads
    await checkAdminOrThrow();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate size (max 50MB)
    if (buffer.length > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 50MB limit" }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Clean file name
    const ext = file.name.split(".").pop() || "bin";
    const sanitizeName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${Date.now()}_${sanitizeName}.${ext}`;
    const filePath = join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "File upload failed" },
      { status: error.message?.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
