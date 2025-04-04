import { reset, seed } from "drizzle-seed";

import db from "./db";
import { moods as moodsTable } from "./db/schema/moods";

async function seedDB() {
  await reset(db, { moodsTable });
  await seed(db, { moodsTable }, { count: 1000 }).refine(f => ({
    moodsTable: {
      columns: {
        emoji: f.valuesFromArray({ values: ["😀", "😢", "😡", "😱", "😴", "😎"] }),
        type: f.valuesFromArray({ values: ["happy", "sad", "angry", "scared", "tired", "cool"] }),

      },
    },
  }));
}

seedDB();
