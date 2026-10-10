"use client";

export type MediaFolder = "brand" | "hero" | "products" | "categories" | "gallery" | "team";

const mediaTypes: Record<string, (header: Uint8Array) => boolean> = {
  "image/jpeg": (header) => header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff,
  "image/png": (header) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => header[index] === byte),
  "image/webp": (header) => String.fromCharCode(...header.slice(0, 4)) === "RIFF" && String.fromCharCode(...header.slice(8, 12)) === "WEBP",
  "image/avif": (header) => String.fromCharCode(...header.slice(4, 12)).includes("ftyp") && /avif|avis/.test(String.fromCharCode(...header.slice(8, 16))),
  "image/gif": (header) => ["GIF87a", "GIF89a"].includes(String.fromCharCode(...header.slice(0, 6))),
  "video/mp4": (header) => String.fromCharCode(...header.slice(4, 8)) === "ftyp",
  "video/webm": (header) => [0x1a, 0x45, 0xdf, 0xa3].every((byte, index) => header[index] === byte),
};

export async function uploadAdminMedia(file: File, folder: MediaFolder): Promise<string> {
  const validateSignature = mediaTypes[file.type];
  if (!validateSignature) {
    throw new Error("Unsupported file type. Upload JPEG, PNG, WebP, AVIF, GIF, MP4, or WebM files.");
  }

  const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size === 0 || file.size > maxSize) {
    throw new Error(file.type.startsWith("video/")
      ? "Video files must be smaller than 50 MB."
      : "Image files must be smaller than 10 MB.");
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!validateSignature(header)) {
    throw new Error("The file contents do not match the selected media type.");
  }

  const signedResponse = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type, size: file.size, folder }),
  });
  const signedUpload = await signedResponse.json();

  if (!signedResponse.ok) {
    throw new Error(signedUpload.error || "Could not prepare the media upload.");
  }

  const uploadResponse = await fetch(signedUpload.signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
      "Cache-Control": "31536000",
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload failed. Please try again with a valid file.");
  }

  return signedUpload.publicUrl as string;
}