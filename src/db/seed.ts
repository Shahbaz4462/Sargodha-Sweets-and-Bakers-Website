import { db, initializeDatabase } from "./index";
import { users, siteSettings, categories, products, teamMembers, timelines, gallery } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  await initializeDatabase();

  const adminEmail = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === "production" ? "" : "admin@sargodhasweets.com");
  const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin123");

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the production admin");
  }

  try {
    // 1. Seed Admin User
    const normalizedAdminEmail = adminEmail.trim().toLowerCase();
    const existingUser = await db.select().from(users).where(eq(users.email, normalizedAdminEmail)).limit(1);
    if (existingUser.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await db.insert(users).values({
        name: "Sargodha Sweets Admin",
        email: normalizedAdminEmail,
        passwordHash,
        role: "admin",
      });
      console.log(`Seeded admin user: ${normalizedAdminEmail}`);
    }

    // 2. Seed Site Settings
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({
        businessName: "Sargodha Sweets & Bakers",
        tagline: "Since 1990 — A Tradition of Taste, Quality & Sweetness",
        logoUrl: "/images/brand-seal.png",
        faviconUrl: "/images/brand-seal.png",
        primaryColor: "#6B1D2F",
        secondaryColor: "#D4AF37",
        heroTitle: "A Tradition of Taste, Quality & Sweetness",
        heroSubtitle: "Since 1990",
        heroDescription: "Discover the authentic Pakistani sweets, artisanal cakes, and bakery creations that have been part of our family journey for generations.",
        heroVideoUrl: "https://videos.pexels.com/video-files/8478025/8478025-hd_1920_1080_24fps.mp4",
        heroFallbackImage: "/images/cat-sweets.jpg",
        heroVideoEnabled: false,
        introHeading: "A Legacy of Taste Since 1990",
        introContent: "Sargodha Sweets & Bakers began its journey in 1990 when Muhammad Gulzar established the bakery together with his brother Muhammad Riaz. Over the years, our business developed its distinct identity around traditional taste, pure ingredients, freshness, and unyielding customer trust.",
        aboutTitle: "Our Story & Commitment",
        aboutContent: "Over three decades of dedication have made Sargodha Sweets & Bakers a household name across the region. Today, current management is led by Abdul Rehman, an M.Phil Food Scientist from CUVAS, bringing modern hygiene standards and scientific food expertise together with our traditional heritage recipes.",
        phone: "+92 300 1234567",
        whatsapp: "+923001234567",
        email: "info@sargodhasweets.com",
        address: "Main Bano Bazaar, Near Clock Tower, Sargodha, Punjab, Pakistan",
        openingHours: "Monday – Sunday: 7:00 AM – 11:00 PM",
        googleMapUrl: "https://maps.google.com/maps?q=Sargodha+Clock+Tower&t=&z=15&ie=UTF8&iwloc=&output=embed",
        latitude: "32.0836",
        longitude: "72.6711",
        facebookUrl: "https://facebook.com/sargodhasweets",
        instagramUrl: "https://instagram.com/sargodhasweets",
        youtubeUrl: "https://youtube.com/sargodhasweets",
        footerText: "© 1990 - 2026 Sargodha Sweets & Bakers. All rights reserved.",
      });
      console.log("Seeded default site settings");
    }

    // 3. Seed Categories
    const existingCats = await db.select().from(categories);
    let catMap: Record<string, number> = {};

    if (existingCats.length === 0) {
      const insertedCats = await db.insert(categories).values([
        {
          name: "Traditional Sweets",
          slug: "sweets",
          description: "Handcrafted authentic Pakistani mithai made with pure desi ghee and khoya.",
          image: "/images/cat-sweets.jpg",
          sortOrder: 1,
        },
        {
          name: "Cakes",
          slug: "cakes",
          description: "Custom birthday cakes, cream cakes, and rich chocolate creations for all events.",
          image: "/images/cat-cakes.jpg",
          sortOrder: 2,
        },
        {
          name: "Bakery",
          slug: "bakery",
          description: "Freshly baked bread, rusks, butter biscuits, cookies, and tea cakes.",
          image: "/images/cat-bakery.jpg",
          sortOrder: 3,
        },
        {
          name: "Desserts",
          slug: "desserts",
          description: "Decadent pastries, brownies, puddings, donuts, and dessert cups.",
          image: "/images/hero-fallback.jpg",
          sortOrder: 4,
        },
        {
          name: "Snacks & Savouries",
          slug: "snacks",
          description: "Golden crispy samosas, chicken patties, spring rolls, and savory treats.",
          image: "/images/cat-snacks.jpg",
          sortOrder: 5,
        },
        {
          name: "Special Items",
          slug: "special",
          description: "Royal luxury gift boxes, wedding mithai trays, and seasonal delicacies.",
          image: "/images/hero-fallback.jpg",
          sortOrder: 6,
        },
      ]).returning();

      insertedCats.forEach(c => {
        catMap[c.slug] = c.id;
      });
      console.log("Seeded categories");
    } else {
      existingCats.forEach(c => {
        catMap[c.slug] = c.id;
      });
    }

    // 4. Seed Products
    const existingProds = await db.select().from(products);
    if (existingProds.length === 0 && Object.keys(catMap).length > 0) {
      await db.insert(products).values([
        // Sweets
        {
          categoryId: catMap["sweets"] || 1,
          name: "Special Desi Ghee Gulab Jamun",
          slug: "special-desi-ghee-gulab-jamun",
          description: "Warm, soft gulab jamuns prepared in pure desi ghee and scented cardamom syrup.",
          longDescription: "Our flagship sweet recipe since 1990. Prepared daily with fresh khoya (condensed milk solids) kneaded to perfection and slow-cooked in pure desi ghee until rich golden brown, then soaked in aromatic saffron and cardamom syrup.",
          price: 1200,
          priceDisplay: "Rs. 1,200",
          priceOnRequest: false,
          unit: "Per kg",
          image: "/images/cat-sweets.jpg",
          additionalImages: JSON.stringify(["/images/cat-sweets.jpg", "/images/hero-fallback.jpg"]),
          ingredients: "Fresh Khoya, Pure Desi Ghee, Milk, Saffron, Cardamom, Sugar Syrup",
          featured: true,
          status: "available",
          sortOrder: 1,
        },
        {
          categoryId: catMap["sweets"] || 1,
          name: "Pistachio Royal Barfi",
          slug: "pistachio-royal-barfi",
          description: "Traditional square cut barfi topped with crushed Iranian pistachios and almonds.",
          longDescription: "Rich and creamy barfi made from pure condensed milk, gently sweetened and topped with fine Iranian pistachios and silver edible foil.",
          price: 1400,
          priceDisplay: "Rs. 1,400",
          priceOnRequest: false,
          unit: "Per kg",
          image: "/images/hero-fallback.jpg",
          additionalImages: JSON.stringify(["/images/hero-fallback.jpg"]),
          ingredients: "Pure Milk Khoya, Sugar, Pistachios, Almonds, Silver Leaf",
          featured: true,
          status: "available",
          sortOrder: 2,
        },
        {
          categoryId: catMap["sweets"] || 1,
          name: "Motichoor Desi Ghee Laddu",
          slug: "motichoor-desi-ghee-laddu",
          description: "Melt-in-mouth tiny boondi laddus crafted in pure desi ghee.",
          longDescription: "Hand-crafted delicate motichoor laddus made from fine gram flour droplets fried in pure desi ghee and infused with melon seeds and cardamom.",
          price: 1100,
          priceDisplay: "Rs. 1,100",
          priceOnRequest: false,
          unit: "Per kg",
          image: "/images/cat-sweets.jpg",
          additionalImages: JSON.stringify(["/images/cat-sweets.jpg"]),
          ingredients: "Gram Flour (Besan), Pure Desi Ghee, Melon Seeds, Cardamom, Sugar",
          featured: false,
          status: "available",
          sortOrder: 3,
        },
        {
          categoryId: catMap["sweets"] || 1,
          name: "Crispy Saffron Jalebi",
          slug: "crispy-saffron-jalebi",
          description: "Crispy spirals soaked in warm saffron sugar syrup, made fresh every evening.",
          longDescription: "Traditional fermented flour batter piped into piping hot ghee, fried till golden crispy and submerged in fragrant saffron sugar syrup.",
          price: 800,
          priceDisplay: "Rs. 800",
          priceOnRequest: false,
          unit: "Per kg",
          image: "/images/cat-sweets.jpg",
          additionalImages: JSON.stringify(["/images/cat-sweets.jpg"]),
          ingredients: "Flour, Pure Ghee, Saffron, Cardamom, Sugar Syrup",
          featured: false,
          status: "available",
          sortOrder: 4,
        },

        // Cakes
        {
          categoryId: catMap["cakes"] || 2,
          name: "Royal Chocolate Fudge Cake",
          slug: "royal-chocolate-fudge-cake",
          description: "Dense, moist chocolate cake with rich dark chocolate fudge frosting.",
          longDescription: "Three layers of soft Belgian chocolate sponge cake filled with creamy chocolate fudge ganache and topped with hand-rolled truffles.",
          price: 2200,
          priceDisplay: "Rs. 2,200",
          priceOnRequest: false,
          unit: "Per cake",
          image: "/images/cat-cakes.jpg",
          additionalImages: JSON.stringify(["/images/cat-cakes.jpg"]),
          ingredients: "Dark Belgian Chocolate, Cocoa, Fresh Cream, Butter, Flour, Eggs",
          featured: true,
          status: "available",
          sortOrder: 1,
        },
        {
          categoryId: catMap["cakes"] || 2,
          name: "Fresh Strawberry & Pineapple Cream Cake",
          slug: "fresh-strawberry-pineapple-cream-cake",
          description: "Light vanilla sponge cake with real fruit slices and light whipped cream.",
          longDescription: "Delicate vanilla sponge cake layered with fresh fruit whipped cream, pineapple chunks, and strawberry glaze garnish.",
          price: 1800,
          priceDisplay: "Rs. 1,800",
          priceOnRequest: false,
          unit: "Per cake",
          image: "/images/cat-cakes.jpg",
          additionalImages: JSON.stringify(["/images/cat-cakes.jpg"]),
          ingredients: "Vanilla Sponge, Whipped Cream, Fresh Pineapples, Strawberries, Egg",
          featured: true,
          status: "available",
          sortOrder: 2,
        },
        {
          categoryId: catMap["cakes"] || 2,
          name: "Custom Celebration Tier Cake",
          slug: "custom-celebration-tier-cake",
          description: "Customized multi-tier fondant or cream cakes for weddings and big celebrations.",
          longDescription: "Custom handcrafted designer cakes crafted to order for weddings, engagements, anniversaries, and grand corporate events.",
          price: null,
          priceDisplay: "Price on Request",
          priceOnRequest: true,
          unit: "Custom",
          image: "/images/cat-cakes.jpg",
          additionalImages: JSON.stringify(["/images/cat-cakes.jpg"]),
          ingredients: "Custom flavor base, Fondant / Cream decoration, Edible gold accents",
          featured: false,
          status: "available",
          sortOrder: 3,
        },

        // Bakery
        {
          categoryId: catMap["bakery"] || 3,
          name: "Crispy Traditional Tea Rusks",
          slug: "crispy-traditional-tea-rusks",
          description: "Double-baked golden rusks, the perfect companion for Pakistani evening chai.",
          longDescription: "Our signature crispy tea rusks baked to perfection with pure butter and subtle fennel seed notes. Stays crunchy for weeks.",
          price: 350,
          priceDisplay: "Rs. 350",
          priceOnRequest: false,
          unit: "Per box",
          image: "/images/cat-bakery.jpg",
          additionalImages: JSON.stringify(["/images/cat-bakery.jpg"]),
          ingredients: "Wheat Flour, Pure Butter, Milk, Fennel Seeds, Sugar, Yeast",
          featured: true,
          status: "available",
          sortOrder: 1,
        },
        {
          categoryId: catMap["bakery"] || 3,
          name: "Almond & Butter Biscuits",
          slug: "almond-butter-biscuits",
          description: "Rich melt-in-the-mouth butter cookies loaded with roasted sliced almonds.",
          longDescription: "Hand-shaped butter cookies baked with real butter, topped generously with sliced almonds and vanilla extract.",
          price: 600,
          priceDisplay: "Rs. 600",
          priceOnRequest: false,
          unit: "Per box",
          image: "/images/cat-bakery.jpg",
          additionalImages: JSON.stringify(["/images/cat-bakery.jpg"]),
          ingredients: "Butter, Flour, Roasted Almonds, Sugar, Vanilla",
          featured: false,
          status: "available",
          sortOrder: 2,
        },

        // Desserts
        {
          categoryId: catMap["desserts"] || 4,
          name: "Belgian Chocolate Brownie",
          slug: "belgian-chocolate-brownie",
          description: "Rich, fudgy chocolate brownie with a glossy crackly top.",
          longDescription: "Authentic dark chocolate brownie baked fresh daily, packed with chocolate chunks and walnuts.",
          price: 250,
          priceDisplay: "Rs. 250",
          priceOnRequest: false,
          unit: "Per piece",
          image: "/images/hero-fallback.jpg",
          additionalImages: JSON.stringify(["/images/hero-fallback.jpg"]),
          ingredients: "Belgian Dark Chocolate, Butter, Walnuts, Cocoa, Eggs",
          featured: true,
          status: "available",
          sortOrder: 1,
        },

        // Snacks
        {
          categoryId: catMap["snacks"] || 5,
          name: "Special Spiced Potato Samosa",
          slug: "special-spiced-potato-samosa",
          description: "Crispy fried pastry cone filled with seasoned potatoes, green peas, and spices.",
          longDescription: "Freshly made crispy samosas stuffed with seasoned Pakistani spice potatoes, coriander, and mint.",
          price: 60,
          priceDisplay: "Rs. 60",
          priceOnRequest: false,
          unit: "Per piece",
          image: "/images/cat-snacks.jpg",
          additionalImages: JSON.stringify(["/images/cat-snacks.jpg"]),
          ingredients: "Flour, Potato, Peas, Cumin, Coriander, Green Chili, Oil",
          featured: true,
          status: "available",
          sortOrder: 1,
        },
        {
          categoryId: catMap["snacks"] || 5,
          name: "Chicken Puff Pastry Patty",
          slug: "chicken-puff-pastry-patty",
          description: "Flaky golden puff pastry filled with shredded spiced chicken breast.",
          longDescription: "Multi-layered flaky buttery pastry filled with tender spiced shredded chicken and black pepper gravy.",
          price: 90,
          priceDisplay: "Rs. 90",
          priceOnRequest: false,
          unit: "Per piece",
          image: "/images/cat-snacks.jpg",
          additionalImages: JSON.stringify(["/images/cat-snacks.jpg"]),
          ingredients: "Flour, Butter, Chicken, Black Pepper, Spices",
          featured: false,
          status: "available",
          sortOrder: 2,
        },

        // Special Items
        {
          categoryId: catMap["special"] || 6,
          name: "Royal Luxury Mithai Box",
          slug: "royal-luxury-mithai-box",
          description: "An exquisite velvet and gold foil box filled with 2kg assortment of top-tier sweets.",
          longDescription: "Curated collection of our finest sweets including Gulab Jamun, Pistachio Barfi, Motichoor Laddu, Chum Chum, and Akhrot Halwa in a luxury presentation box.",
          price: 3500,
          priceDisplay: "Rs. 3,500",
          priceOnRequest: false,
          unit: "Per box",
          image: "/images/hero-fallback.jpg",
          additionalImages: JSON.stringify(["/images/hero-fallback.jpg"]),
          ingredients: "Assorted Desi Ghee Sweets & Dry Fruits",
          featured: true,
          status: "available",
          sortOrder: 1,
        },
      ]);
      console.log("Seeded products");
    }

    // 5. Seed Team Members
    const existingTeam = await db.select().from(teamMembers);
    if (existingTeam.length === 0) {
      await db.insert(teamMembers).values([
        {
          name: "Muhammad Gulzar",
          role: "Founder",
          qualification: "Master Craftsman & Halwai",
          biography: "Founded Sargodha Sweets & Bakers in 1990 with a vision to preserve traditional Pakistani sweet recipes using only 100% pure desi ghee and natural ingredients. His dedication to quality laid the foundation for three decades of success.",
          image: "/images/team-gulzar.jpg",
          sortOrder: 1,
          status: "active",
        },
        {
          name: "Muhammad Riaz",
          role: "Co-Founder / Brother",
          qualification: "Operations & Recipe Specialist",
          biography: "Co-founded the business alongside his brother Muhammad Gulzar. Managed daily operations, customer relations, and perfected the signature crust and taste recipes of our bakery items.",
          image: "/images/team-riaz.jpg",
          sortOrder: 2,
          status: "active",
        },
        {
          name: "Abdul Rehman",
          role: "Current Management",
          qualification: "M.Phil Food Scientist — CUVAS",
          biography: "Leading current operations with a master's background in Food Science & Technology from CUVAS. Combines family heritage recipes with modern food safety, hygienic standards, and nutrition excellence.",
          image: "/images/team-rehman.jpg",
          sortOrder: 3,
          status: "active",
        },
      ]);
      console.log("Seeded team members");
    }

    // 6. Seed Timeline
    const existingTimeline = await db.select().from(timelines);
    if (existingTimeline.length === 0) {
      await db.insert(timelines).values([
        {
          year: "1990",
          title: "The Genesis",
          description: "Muhammad Gulzar together with his brother Muhammad Riaz opened the doors of Sargodha Sweets & Bakers in the heart of Sargodha.",
          sortOrder: 1,
        },
        {
          year: "1998",
          title: "Heritage Recipe Perfection",
          description: "Established a reputation as the finest halwai shop in Sargodha for pure desi ghee gulab jamuns, barfi, and halwa.",
          sortOrder: 2,
        },
        {
          year: "2010",
          title: "Bakery & Confectionery Expansion",
          description: "Expanded facility to introduce artisanal breads, customized birthday cakes, tea rusks, and savory snacks.",
          sortOrder: 3,
        },
        {
          year: "2022",
          title: "Food Science & Hygiene Innovation",
          description: "Abdul Rehman (M.Phil Food Scientist - CUVAS) took over current management, integrating strict food safety and scientific quality control.",
          sortOrder: 4,
        },
        {
          year: "Today",
          title: "A Beloved Household Brand",
          description: "Continuing to sweeten life's special moments for thousands of families with warmth, trust, and exceptional taste.",
          sortOrder: 5,
        },
      ]);
      console.log("Seeded timelines");
    }

    // 7. Seed Gallery
    const existingGallery = await db.select().from(gallery);
    if (existingGallery.length === 0) {
      await db.insert(gallery).values([
        {
          title: "Desi Ghee Gulab Jamuns",
          description: "Freshly fried hot gulab jamuns soaking in sweet saffron syrup.",
          image: "/images/cat-sweets.jpg",
          category: "Sweets",
          sortOrder: 1,
          status: "active",
        },
        {
          title: "Artisanal Celebration Cake",
          description: "Custom layered cake topped with fresh cream and berry glazes.",
          image: "/images/cat-cakes.jpg",
          category: "Cakes",
          sortOrder: 2,
          status: "active",
        },
        {
          title: "Golden Fresh Bakery Rusks",
          description: "Double baked crunchy rusks fresh out of the ovens.",
          image: "/images/cat-bakery.jpg",
          category: "Bakery",
          sortOrder: 3,
          status: "active",
        },
        {
          title: "Crispy Samosas & Savouries",
          description: "Golden fried savory snacks ready for tea time.",
          image: "/images/cat-snacks.jpg",
          category: "Production",
          sortOrder: 4,
          status: "active",
        },
        {
          title: "Royal Sweets Arrangement",
          description: "Premium selection of traditional Pakistani sweets.",
          image: "/images/hero-fallback.jpg",
          category: "Sweets",
          sortOrder: 5,
          status: "active",
        },
      ]);
      console.log("Seeded gallery");
    }

  } catch (err) {
    console.error("Error seeding database:", err);
  }
}
