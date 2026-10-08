import { NextResponse } from "next/server";
import { checkAdminOrThrow, logAdminAction } from "@/lib/auth";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    await checkAdminOrThrow();
    const list = await db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));
    return NextResponse.json({ team: list });
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
    const { id, name, role, qualification, biography, image, status, sortOrder } = body;

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const payload = {
      name,
      role,
      qualification: qualification || "",
      biography: biography || "",
      image: image || "",
      status: status || "active",
      sortOrder: Number(sortOrder) || 0,
    };

    if (id) {
      const [updated] = await db.update(teamMembers)
        .set(payload)
        .where(eq(teamMembers.id, Number(id)))
        .returning();

      await logAdminAction(admin.email, "UPDATE_TEAM", `Updated team member: ${name}`);
      return NextResponse.json({ success: true, teamMember: updated });
    } else {
      const [created] = await db.insert(teamMembers)
        .values(payload)
        .returning();

      await logAdminAction(admin.email, "CREATE_TEAM", `Added team member: ${name}`);
      return NextResponse.json({ success: true, teamMember: created });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save team member" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Team member ID is required" }, { status: 400 });
    }

    const [deleted] = await db.delete(teamMembers)
      .where(eq(teamMembers.id, Number(id)))
      .returning();

    await logAdminAction(admin.email, "DELETE_TEAM", `Removed team member ID: ${id} (${deleted?.name || ""})`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete team member" }, { status: 500 });
  }
}
