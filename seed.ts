import db from "./db";
import { moods as moodsTable } from "./db/schema/moods";
import { fakeMoods } from "./types";

async function seedDatabase() {
  for (const mood of fakeMoods) {
    await db.insert(moodsTable).values({ ...mood, createdAt: undefined }).execute();
  }
  console.log("Database seeded successfully");
}

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
});
