import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/db";

const getJwtSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET || "local-development-only-secret");

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function checkAdminOrThrow(): Promise<AdminPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function logAdminAction(adminEmail: string, action: string, details: string = "") {
  try {
    const { auditLogs } = await import("@/db/schema");
    await db.insert(auditLogs).values({
      adminEmail,
      action,
      details,
    });
  } catch (err) {
    console.error("Failed to log admin action:", err);
  }
}
