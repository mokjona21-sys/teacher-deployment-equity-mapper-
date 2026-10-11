import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'node:crypto';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const sessionToken = crypto.randomBytes(32).toString('hex');

app.use(express.json());

function isAuthenticated(request: Request) {
  return request.headers.cookie?.split(';').some((cookie) => cookie.trim() === `edumap_session=${sessionToken}`) ?? false;
}

function protectDashboard(request: Request, response: Response, next: NextFunction) {
  if (request.path === '/' && !isAuthenticated(request)) {
    response.redirect('/login');
    return;
  }
  next();
}

app.post('/api/login', (request, response) => {
  const { username, password } = request.body as { username?: string; password?: string };
  const expectedUsername = process.env.ADMIN_NAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword || username !== expectedUsername || password !== expectedPassword) {
    response.status(401).json({ message: 'Invalid username or password.' });
    return;
  }

  response.setHeader('Set-Cookie', `edumap_session=${sessionToken}; HttpOnly; Path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  response.json({ authenticated: true });
});

app.get('/api/session', (request, response) => {
  response.status(isAuthenticated(request) ? 200 : 401).json({ authenticated: isAuthenticated(request) });
});

app.use(protectDashboard);

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});
app.use(vite.middlewares);

app.listen(port, '0.0.0.0', () => {
  console.log(`[v0] Auth-enabled Vite server listening on port ${port}`);
});

process.on('SIGTERM', () => vite.close());
process.on('SIGINT', () => vite.close());

export default app;

