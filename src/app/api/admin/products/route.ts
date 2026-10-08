import { NextResponse } from "next/server";
import { checkAdminOrThrow, logAdminAction } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAllowedMediaUrl } from "@/lib/media";

export async function GET() {
  try {
    await checkAdminOrThrow();
    const list = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id));
    return NextResponse.json({ products: list });
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
    const {
      id,
      categoryId,
      name,
      slug,
      description,
      longDescription,
      price,
      priceDisplay,
      priceOnRequest,
      unit,
      image,
      additionalImages,
      ingredients,
      featured,
      status,
      sortOrder,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Product name and category are required" }, { status: 400 });
    }

    let extraImageUrls: unknown[] = [];
    try {
      extraImageUrls = typeof additionalImages === "string"
        ? JSON.parse(additionalImages)
        : Array.isArray(additionalImages) ? additionalImages : [];
    } catch {
      return NextResponse.json({ error: "Additional product images must be a valid image list." }, { status: 400 });
    }
    if (!isAllowedMediaUrl(image) || extraImageUrls.some((url) => !isAllowedMediaUrl(url))) {
      return NextResponse.json({ error: "Product media must be local or stored in this project's Supabase Storage bucket." }, { status: 400 });
    }

    const prodSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const formattedPrice = priceOnRequest ? null : (price !== "" && price !== null ? Number(price) : null);
    
    // Format price display e.g. "Rs. 1,200" if price is present
    let finalPriceDisplay = priceDisplay || "";
    if (!priceOnRequest && formattedPrice !== null) {
      finalPriceDisplay = `Rs. ${formattedPrice.toLocaleString()}`;
    } else if (priceOnRequest) {
      finalPriceDisplay = "Price on Request";
    }

    const payload = {
      categoryId: Number(categoryId),
      name,
      slug: prodSlug,
      description: description || "",
      longDescription: longDescription || "",
      price: formattedPrice,
      priceDisplay: finalPriceDisplay,
      priceOnRequest: Boolean(priceOnRequest),
      unit: unit || "Per kg",
      image: image || "",
      additionalImages: typeof additionalImages === "string" ? additionalImages : JSON.stringify(additionalImages || []),
      ingredients: ingredients || "",
      featured: Boolean(featured),
      status: status || "available",
      sortOrder: Number(sortOrder) || 0,
      updatedAt: new Date(),
    };

    if (id) {
      // Update
      const [updated] = await db.update(products)
        .set(payload)
        .where(eq(products.id, Number(id)))
        .returning();

      await logAdminAction(admin.email, "UPDATE_PRODUCT", `Updated product: ${name}`);
      revalidatePath("/");
      revalidatePath("/api/public/data");
      return NextResponse.json({ success: true, product: updated });
    } else {
      // Create
      const [created] = await db.insert(products)
        .values({
          ...payload,
          createdAt: new Date(),
        })
        .returning();

      await logAdminAction(admin.email, "CREATE_PRODUCT", `Created product: ${name}`);
      revalidatePath("/");
      revalidatePath("/api/public/data");
      return NextResponse.json({ success: true, product: created });
    }
  } catch (error: any) {
    console.error("Product save error:", error);
    return NextResponse.json({ error: error.message || "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await checkAdminOrThrow();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const [deleted] = await db.delete(products)
      .where(eq(products.id, Number(id)))
      .returning();

    await logAdminAction(admin.email, "DELETE_PRODUCT", `Deleted product ID: ${id} (${deleted?.name || ""})`);
    revalidatePath("/");
    revalidatePath("/api/public/data");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
