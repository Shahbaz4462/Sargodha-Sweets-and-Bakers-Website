import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull().default("Sargodha Sweets & Bakers"),
  tagline: text("tagline").notNull().default("Since 1990 — A Tradition of Taste, Quality & Sweetness"),
  logoUrl: text("logo_url").notNull().default("/images/brand-seal.png"),
  faviconUrl: text("favicon_url").notNull().default("/images/brand-seal.png"),
  primaryColor: text("primary_color").notNull().default("#6B1D2F"),
  secondaryColor: text("secondary_color").notNull().default("#D4AF37"),
  heroTitle: text("hero_title").notNull().default("A Tradition of Taste, Quality & Sweetness"),
  heroSubtitle: text("hero_subtitle").notNull().default("Since 1990"),
  heroDescription: text("hero_description").notNull().default("Discover the Pakistani sweets, artisanal cakes, and bakery creations that have been part of our family journey for generations."),
  heroVideoUrl: text("hero_video_url").notNull().default(""),
  heroFallbackImage: text("hero_fallback_image").notNull().default("/images/cat-sweets.jpg"),
  heroVideoEnabled: boolean("hero_video_enabled").notNull().default(false),
  introHeading: text("intro_heading").notNull().default("A Legacy of Taste Since 1990"),
  introContent: text("intro_content").notNull().default("Sargodha Sweets & Bakers began its journey in 1990 when Muhammad Gulzar established the bakery together with his brother Muhammad Riaz. Over the years, our business developed its distinct identity around traditional taste, pure ingredients, freshness, and unyielding customer trust."),
  aboutTitle: text("about_title").notNull().default("Our Story & Commitment"),
  aboutContent: text("about_content").notNull().default("Over three decades of dedication have made Sargodha Sweets & Bakers a household name across the region. Today, current management is led by Abdul Rehman, an M.Phil Food Scientist from CUVAS, bringing modern hygiene standards and scientific food expertise together with our traditional heritage recipes."),
  phone: text("phone").notNull().default("+92 300 1234567"),
  whatsapp: text("whatsapp").notNull().default("+923001234567"),
  email: text("email").notNull().default("info@sargodhasweets.com"),
  address: text("address").notNull().default("Main Bazaar, Near Clock Tower, Sargodha, Punjab, Pakistan"),
  openingHours: text("opening_hours").notNull().default("Monday – Sunday: 7:00 AM – 11:00 PM"),
  googleMapUrl: text("google_map_url").notNull().default("https://maps.google.com/maps?q=Sargodha+Clock+Tower&t=&z=15&ie=UTF8&iwloc=&output=embed"),
  latitude: text("latitude").notNull().default("32.0836"),
  longitude: text("longitude").notNull().default("72.6711"),
  facebookUrl: text("facebook_url").notNull().default("https://facebook.com/sargodhasweets"),
  instagramUrl: text("instagram_url").notNull().default("https://instagram.com/sargodhasweets"),
  youtubeUrl: text("youtube_url").notNull().default("https://youtube.com/sargodhasweets"),
  footerText: text("footer_text").notNull().default("© 1990 - 2026 Sargodha Sweets & Bakers. All rights reserved."),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  status: text("status").notNull().default("active"), // 'active', 'disabled'
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull().default(""),
  longDescription: text("long_description").notNull().default(""),
  price: integer("price"), // price in PKR (or null if price_on_request)
  priceDisplay: text("price_display").notNull().default(""),
  priceOnRequest: boolean("price_on_request").notNull().default(false),
  unit: text("unit").notNull().default("Per kg"), // 'Per kg', 'Per 500g', 'Per box', 'Per piece', 'Per dozen', 'Per cake', 'Per tray', 'Custom'
  image: text("image").notNull().default(""),
  additionalImages: text("additional_images").notNull().default("[]"), // JSON string of image URLs
  ingredients: text("ingredients").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("available"), // 'available', 'temporarily_unavailable', 'hidden'
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  qualification: text("qualification").notNull().default(""),
  biography: text("biography").notNull().default(""),
  image: text("image").notNull().default(""),
  status: text("status").notNull().default("active"), // 'active', 'hidden'
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timelines = pgTable("timelines", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  image: text("image").notNull(),
  category: text("category").notNull().default("All"), // 'Sweets', 'Cakes', 'Bakery', 'Interior', 'Production'
  status: text("status").notNull().default("active"), // 'active', 'hidden'
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  productName: text("product_name").notNull().default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // 'new', 'read', 'archived'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminEmail: text("admin_email").notNull(),
  action: text("action").notNull(),
  details: text("details").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
