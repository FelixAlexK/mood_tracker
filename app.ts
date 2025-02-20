import { Hono } from 'hono';
import { logger } from 'hono/logger'
import {moodsRoute} from './routes/moods'


const app = new Hono();
app.use("*", logger())


app.get('/test', context => {
    return context.json({ message: 'Hello from Bun server!' });
})

app.route('/api/moods', moodsRoute)

export default app;