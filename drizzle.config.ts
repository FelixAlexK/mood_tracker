import type { Config } from "drizzle-kit";

import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
config({ path: envFile });

export default defineConfig({
  out: "./drizzle",
  schema: "./backend/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,

  },
}) satisfies Config;
