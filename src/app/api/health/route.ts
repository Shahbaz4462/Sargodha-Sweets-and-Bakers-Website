import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Health check database query failed");
    if (error instanceof Error) {
      console.error(error.message);
    }
    return Response.json({ ok: false }, { status: 500 });
  }
}
