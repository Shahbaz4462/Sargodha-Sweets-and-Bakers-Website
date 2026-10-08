import type { NextConfig } from "next";

const imageRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET;

if (supabaseUrl && storageBucket) {
	try {
		const storageHost = new URL(supabaseUrl);
		imageRemotePatterns.push({
			protocol: storageHost.protocol.replace(":", "") as "http" | "https",
			hostname: storageHost.hostname,
			pathname: `/storage/v1/object/public/${storageBucket}/**`,
		});
	} catch {
		throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL");
	}
}

const nextConfig: NextConfig = {
	serverExternalPackages: ["@electric-sql/pglite"],
	images: {
		remotePatterns: imageRemotePatterns,
	},
};

export default nextConfig;
