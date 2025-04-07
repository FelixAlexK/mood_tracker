import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

import { authRoute } from "./routes/auth";
import { moodsRoute } from "./routes/moods";
import { statsRoute } from "./routes/stats";

const app = new Hono();
app.use("*", logger());

const _apiRoutes = app.basePath("/api").route("/moods", moodsRoute).route("/", authRoute).route("/stats", statsRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof _apiRoutes;
