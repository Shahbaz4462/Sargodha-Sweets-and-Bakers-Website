import { NextResponse } from "next/server";
import { checkAdminOrThrow, logAdminAction } from "@/lib/auth";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    await checkAdminOrThrow();
    const list = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    return NextResponse.json({ inquiries: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Inquiry ID and status are required" }, { status: 400 });
    }

    const [updated] = await db.update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, Number(id)))
      .returning();

    await logAdminAction(admin.email, "UPDATE_INQUIRY", `Marked inquiry ${id} as ${status}`);
    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    await db.delete(inquiries).where(eq(inquiries.id, Number(id)));
    await logAdminAction(admin.email, "DELETE_INQUIRY", `Deleted inquiry ID: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete inquiry" }, { status: 500 });
  }
}
