import { Hono } from "hono";
import { logger } from "hono/logger";

import { authRoute } from "./routes/auth";
import { moodsRoute } from "./routes/moods";

const app = new Hono();
app.use("*", logger());

const _apiRoutes = app.basePath("/api").route("/moods", moodsRoute).route("/", authRoute);

export default app;
export type ApiRoutes = typeof _apiRoutes;
