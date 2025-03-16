import { defineConfig, type Config } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './db/schema/*',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
}) satisfies Config;
