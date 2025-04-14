import type { Config } from "drizzle-kit";

import { defineConfig } from "drizzle-kit";
import process from "node:process";

export default defineConfig({
  out: "./drizzle",
  schema: "./backend/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,

  },
}) satisfies Config;
