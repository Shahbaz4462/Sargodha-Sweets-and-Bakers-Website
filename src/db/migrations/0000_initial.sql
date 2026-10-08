CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_email" text NOT NULL,
	"action" text NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text NOT NULL,
	"category" text DEFAULT 'All' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"product_name" text DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"long_description" text DEFAULT '' NOT NULL,
	"price" integer,
	"price_display" text DEFAULT '' NOT NULL,
	"price_on_request" boolean DEFAULT false NOT NULL,
	"unit" text DEFAULT 'Per kg' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"additional_images" text DEFAULT '[]' NOT NULL,
	"ingredients" text DEFAULT '' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" text DEFAULT 'Sargodha Sweets & Bakers' NOT NULL,
	"tagline" text DEFAULT 'Since 1990 — A Tradition of Taste, Quality & Sweetness' NOT NULL,
	"logo_url" text DEFAULT '/images/logo.png' NOT NULL,
	"favicon_url" text DEFAULT '/images/logo.png' NOT NULL,
	"primary_color" text DEFAULT '#6B1D2F' NOT NULL,
	"secondary_color" text DEFAULT '#D4AF37' NOT NULL,
	"hero_title" text DEFAULT 'A Tradition of Taste, Quality & Sweetness' NOT NULL,
	"hero_subtitle" text DEFAULT 'Since 1990' NOT NULL,
	"hero_description" text DEFAULT 'Discover the Pakistani sweets, artisanal cakes, and bakery creations that have been part of our family journey for generations.' NOT NULL,
	"hero_video_url" text DEFAULT 'https://videos.pexels.com/video-files/8478025/8478025-hd_1920_1080_24fps.mp4' NOT NULL,
	"hero_fallback_image" text DEFAULT '/images/hero-fallback.jpg' NOT NULL,
	"hero_video_enabled" boolean DEFAULT true NOT NULL,
	"intro_heading" text DEFAULT 'A Legacy of Taste Since 1990' NOT NULL,
	"intro_content" text DEFAULT 'Sargodha Sweets & Bakers began its journey in 1990 when Muhammad Gulzar established the bakery together with his brother Muhammad Riaz. Over the years, our business developed its distinct identity around traditional taste, pure ingredients, freshness, and unyielding customer trust.' NOT NULL,
	"about_title" text DEFAULT 'Our Story & Commitment' NOT NULL,
	"about_content" text DEFAULT 'Over three decades of dedication have made Sargodha Sweets & Bakers a household name across the region. Today, current management is led by Abdul Rehman, an M.Phil Food Scientist from CUVAS, bringing modern hygiene standards and scientific food expertise together with our traditional heritage recipes.' NOT NULL,
	"phone" text DEFAULT '+92 300 1234567' NOT NULL,
	"whatsapp" text DEFAULT '+923001234567' NOT NULL,
	"email" text DEFAULT 'info@sargodhasweets.com' NOT NULL,
	"address" text DEFAULT 'Main Bazaar, Near Clock Tower, Sargodha, Punjab, Pakistan' NOT NULL,
	"opening_hours" text DEFAULT 'Monday – Sunday: 7:00 AM – 11:00 PM' NOT NULL,
	"google_map_url" text DEFAULT 'https://maps.google.com/maps?q=Sargodha+Clock+Tower&t=&z=15&ie=UTF8&iwloc=&output=embed' NOT NULL,
	"latitude" text DEFAULT '32.0836' NOT NULL,
	"longitude" text DEFAULT '72.6711' NOT NULL,
	"facebook_url" text DEFAULT 'https://facebook.com/sargodhasweets' NOT NULL,
	"instagram_url" text DEFAULT 'https://instagram.com/sargodhasweets' NOT NULL,
	"youtube_url" text DEFAULT 'https://youtube.com/sargodhasweets' NOT NULL,
	"footer_text" text DEFAULT '© 1990 - 2026 Sargodha Sweets & Bakers. All rights reserved.' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"qualification" text DEFAULT '' NOT NULL,
	"biography" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;