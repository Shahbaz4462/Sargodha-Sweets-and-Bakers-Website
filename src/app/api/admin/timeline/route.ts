import { NextResponse } from "next/server";
import { checkAdminOrThrow, logAdminAction } from "@/lib/auth";
import { db } from "@/db";
import { timelines } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAllowedMediaUrl } from "@/lib/media";

export async function GET() {
  try {
    await checkAdminOrThrow();
    const list = await db.select().from(timelines).orderBy(asc(timelines.sortOrder), asc(timelines.id));
    return NextResponse.json({ timelines: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const body = await req.json();
    const { id, year, title, description, image, sortOrder } = body;

    if (!year || !title) {
      return NextResponse.json({ error: "Year and title are required" }, { status: 400 });
    }
    if (!isAllowedMediaUrl(image)) {
      return NextResponse.json({ error: "Timeline media must be local or stored in this project's Supabase Storage bucket." }, { status: 400 });
    }

    const payload = {
      year,
      title,
      description: description || "",
      image: image || "",
      sortOrder: Number(sortOrder) || 0,
    };

    if (id) {
      const [updated] = await db.update(timelines)
        .set(payload)
        .where(eq(timelines.id, Number(id)))
        .returning();

      await logAdminAction(admin.email, "UPDATE_TIMELINE", `Updated timeline event: ${year} - ${title}`);
      revalidatePath("/");
      return NextResponse.json({ success: true, timeline: updated });
    } else {
      const [created] = await db.insert(timelines)
        .values(payload)
        .returning();

      await logAdminAction(admin.email, "CREATE_TIMELINE", `Added timeline event: ${year} - ${title}`);
      revalidatePath("/");
      return NextResponse.json({ success: true, timeline: created });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save timeline event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Timeline ID is required" }, { status: 400 });
    }

    await db.delete(timelines).where(eq(timelines.id, Number(id)));
    await logAdminAction(admin.email, "DELETE_TIMELINE", `Deleted timeline event ID: ${id}`);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete timeline event" }, { status: 500 });
  }
}
