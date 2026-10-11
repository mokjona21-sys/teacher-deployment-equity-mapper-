import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
const app = express();
const port = Number(process.env.PORT ?? 3000);

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});
app.use(vite.middlewares);

app.listen(port, '0.0.0.0', () => {
  console.log(`[v0] Vite server listening on port ${port}`);
});

process.on('SIGTERM', () => vite.close());
process.on('SIGINT', () => vite.close());

export default app;

