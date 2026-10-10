import { config } from "dotenv";

config({ path: ".env.local" });
config();

async function main() {
  const { seedDatabase } = await import("./seed");
  await seedDatabase();
  console.log("Controlled database seed finished.");
}

main().catch((error) => {
  console.error("Controlled database seed failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
});
