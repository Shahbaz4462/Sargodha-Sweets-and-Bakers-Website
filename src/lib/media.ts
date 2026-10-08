export function isPexelsMediaUrl(value: unknown): boolean {
  return typeof value === "string" && value.toLowerCase().includes("pexels.com");
}

export function isAllowedMediaUrl(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string") return false;
  const mediaUrl = value.trim();

  if (!mediaUrl) return true;
  if (isPexelsMediaUrl(mediaUrl)) return false;
  if (mediaUrl.startsWith("/images/") && !mediaUrl.startsWith("//")) return true;

  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!configuredUrl) return false;

  try {
    const candidate = new URL(mediaUrl);
    const project = new URL(configuredUrl);
    return candidate.protocol === "https:"
      && candidate.origin === project.origin
      && candidate.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

export function resolveMediaUrl(value: unknown, fallback = ""): string {
  if (typeof value !== "string" || !isAllowedMediaUrl(value) || !value.trim()) {
    return fallback;
  }

  return value.trim();
}