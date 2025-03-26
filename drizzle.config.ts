import type { Config } from "drizzle-kit";

import { defineConfig } from "drizzle-kit";
import process from "node:process";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema/*",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,

  },
}) satisfies Config;
