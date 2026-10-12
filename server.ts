import 'dotenv/config';
import express from 'express';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
const app = express();
const httpServer = createHttpServer(app);
const port = Number(process.env.PORT ?? 3000);

const vite = await createViteServer({
  server: {
    middlewareMode: true,
    ws: {
      server: httpServer,
    },
  },
  appType: 'spa',
});

app.use(vite.middlewares);

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`[v0] Vite server listening on port ${port}`);
});

const closeServers = async () => {
  await vite.close();
  httpServer.close();
};

process.once('SIGTERM', closeServers);
process.once('SIGINT', closeServers);

export default app;

