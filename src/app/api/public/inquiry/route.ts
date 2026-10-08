import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, productName, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Name, phone, and message are required" }, { status: 400 });
    }

    const [newInquiry] = await db.insert(inquiries).values({
      name,
      phone,
      email: email || "",
      productName: productName || "",
      message,
      status: "new",
    }).returning();

    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
