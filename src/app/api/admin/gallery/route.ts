import { NextResponse } from "next/server";
import { checkAdminOrThrow, logAdminAction } from "@/lib/auth";
import { db } from "@/db";
import { gallery } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    await checkAdminOrThrow();
    const list = await db.select().from(gallery).orderBy(asc(gallery.sortOrder), asc(gallery.id));
    return NextResponse.json({ gallery: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const body = await req.json();
    const { id, title, description, image, category, status, sortOrder } = body;

    if (!image) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const payload = {
      title: title || "",
      description: description || "",
      image,
      category: category || "All",
      status: status || "active",
      sortOrder: Number(sortOrder) || 0,
    };

    if (id) {
      const [updated] = await db.update(gallery)
        .set(payload)
        .where(eq(gallery.id, Number(id)))
        .returning();

      await logAdminAction(admin.email, "UPDATE_GALLERY", `Updated gallery item ID: ${id}`);
      return NextResponse.json({ success: true, item: updated });
    } else {
      const [created] = await db.insert(gallery)
        .values(payload)
        .returning();

      await logAdminAction(admin.email, "CREATE_GALLERY", `Added gallery item: ${title || "Untitled"}`);
      return NextResponse.json({ success: true, item: created });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Gallery ID is required" }, { status: 400 });
    }

    await db.delete(gallery).where(eq(gallery.id, Number(id)));
    await logAdminAction(admin.email, "DELETE_GALLERY", `Deleted gallery item ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete gallery item" }, { status: 500 });
  }
}
