import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const mediaExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

type MediaFolder = "brand" | "hero" | "products" | "categories" | "gallery" | "team";

interface SignedUploadRequest {
  fileName: string;
  contentType: string;
  size: number;
  folder: MediaFolder;
}

const globalForStorage = globalThis as typeof globalThis & {
  __sargodhaSupabaseStorageAdmin?: SupabaseClient;
};

function storageConfiguration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!url || !serviceRoleKey || !bucket) {
    throw new Error(
      "Persistent media storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET."
    );
  }

  return { url, serviceRoleKey, bucket };
}

function getStorageAdminClient(url: string, serviceRoleKey: string): SupabaseClient {
  globalForStorage.__sargodhaSupabaseStorageAdmin ??= createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return globalForStorage.__sargodhaSupabaseStorageAdmin;
}

export async function createMediaUpload(request: SignedUploadRequest) {
  const extension = mediaExtensions[request.contentType];
  if (!extension) {
    throw new Error("Unsupported media type. Upload JPEG, PNG, WebP, AVIF, GIF, MP4, or WebM files.");
  }

  const maxSize = request.contentType.startsWith("video/") ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (!Number.isSafeInteger(request.size) || request.size <= 0 || request.size > maxSize) {
    throw new Error(request.contentType.startsWith("video/")
      ? "Video files must be smaller than 50 MB."
      : "Image files must be smaller than 10 MB.");
  }

  const { url, serviceRoleKey, bucket } = storageConfiguration();
  const storage = getStorageAdminClient(url, serviceRoleKey).storage.from(bucket);
  const safeFileName = request.fileName
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64) || "media";
  const path = `${request.folder}/${crypto.randomUUID()}-${safeFileName}.${extension}`;
  const { data, error } = await storage.createSignedUploadUrl(path, { upsert: false });

  if (error || !data) {
    throw new Error(error?.message || "Could not create a signed media upload URL.");
  }

  const { data: publicData } = storage.getPublicUrl(path);

  return {
    bucket,
    path: data.path,
    token: data.token,
    publicUrl: publicData.publicUrl,
  };
}