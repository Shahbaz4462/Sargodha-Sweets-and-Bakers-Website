import { NextResponse } from "next/server";
import { getAdminSession, logAdminAction } from "@/lib/auth";

export async function POST() {
  const session = await getAdminSession();
  if (session) {
    await logAdminAction(session.email, "ADMIN_LOGOUT", "Logged out of admin panel");
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_token");
  return response;
}
