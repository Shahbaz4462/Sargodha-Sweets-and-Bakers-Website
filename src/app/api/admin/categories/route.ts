import { NextResponse } from "next/server";
import { checkAdminOrThrow, logAdminAction } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAllowedMediaUrl } from "@/lib/media";

export async function GET() {
  try {
    await checkAdminOrThrow();
    const list = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id));
    return NextResponse.json({ categories: list });
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
    const { id, name, slug, description, image, status, sortOrder } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }
    if (!isAllowedMediaUrl(image)) {
      return NextResponse.json({ error: "Category media must be local or stored in this project's Supabase Storage bucket." }, { status: 400 });
    }

    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    if (id) {
      // Update
      const [updated] = await db.update(categories)
        .set({
          name,
          slug: categorySlug,
          description: description || "",
          image: image || "",
          status: status || "active",
          sortOrder: Number(sortOrder) || 0,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, Number(id)))
        .returning();

      await logAdminAction(admin.email, "UPDATE_CATEGORY", `Updated category: ${name}`);
      revalidatePath("/");
      revalidatePath("/api/public/data");
      return NextResponse.json({ success: true, category: updated });
    } else {
      // Create
      const [created] = await db.insert(categories)
        .values({
          name,
          slug: categorySlug,
          description: description || "",
          image: image || "",
          status: status || "active",
          sortOrder: Number(sortOrder) || 0,
        })
        .returning();

      await logAdminAction(admin.email, "CREATE_CATEGORY", `Created category: ${name}`);
      revalidatePath("/");
      revalidatePath("/api/public/data");
      return NextResponse.json({ success: true, category: created });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const [deleted] = await db.delete(categories)
      .where(eq(categories.id, Number(id)))
      .returning();

    await logAdminAction(admin.email, "DELETE_CATEGORY", `Deleted category ID: ${id} (${deleted?.name || ""})`);
    revalidatePath("/");
    revalidatePath("/api/public/data");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
