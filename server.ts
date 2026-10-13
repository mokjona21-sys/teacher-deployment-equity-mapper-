import express from 'express';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
const app = express();

app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Content-Security-Policy-Report-Only', "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; img-src 'self' data: blob: https://*.tile.openstreetmap.org; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.tile.openstreetmap.org");
  next();
});

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

