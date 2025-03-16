import db from "./db";
import { fakeMoods, type Mood } from "./types";
import { moods as moodsTable } from './db/schema/moods'


async function seedDatabase() {
    for (const mood of fakeMoods) {
        await db.insert(moodsTable).values(mood).execute();
    }
    console.log('Database seeded successfully');
}

seedDatabase().catch((error) => {
    console.error('Error seeding database:', error);
});