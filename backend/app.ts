import type { Context } from "hono";

import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { z } from "zod";

import { authRoute } from "./routes/auth";
import { moodsRoute } from "./routes/moods";
import { statsRoute } from "./routes/stats";

const app = new Hono();
app.use("*", logger());

export function errorHandler(err: Error | HTTPException, c: Context) {
  console.log("=== Caught Error ===");
  if (err instanceof HTTPException) {
    return c.text(err.message, err.status);
  }
  if (err instanceof z.ZodError) {
    return c.text(err.errors.map(err => err.message).join(",\n"), 400);
  }
  console.error(err);
  return c.text("Something went wrong", 500);
}

const _apiRoutes = app.basePath("/api").route("/moods", moodsRoute).route("/", authRoute).route("/stats", statsRoute);
app.onError(errorHandler);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof _apiRoutes;
