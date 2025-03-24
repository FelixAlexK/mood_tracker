import { Hono } from 'hono';
import { logger } from 'hono/logger'
import { moodsRoute } from './routes/moods'
import { authRoute } from './routes/auth'


const app = new Hono();
app.use("*", logger())

const apiRoutes = app.basePath("/api").route("/moods", moodsRoute).route("/", authRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;