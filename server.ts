import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: '.env.development.local' });
dotenv.config();
import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import { answerAssistantQuestion } from './src/server/assistant';
const app = express();
app.use(express.json({ limit: '48kb' }));

app.post('/api/assistant', async (req, res) => {
  res.type('application/json').setHeader('Cache-Control', 'no-store');
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  const context = typeof req.body?.context === 'string' ? req.body.context.slice(0, 24000) : '';

  if (!question || question.length > 500) {
    res.status(400).json({ error: 'Enter a question up to 500 characters.' });
    return;
  }

  try {
    res.json({ answer: await answerAssistantQuestion(question, context || 'No dashboard context supplied.') });
  } catch (error) {
    console.error('[v0] Assistant request failed:', error);
    const message = error instanceof Error ? error.message : '';
    const needsBilling = /credit card|customer_verification_required|billing/i.test(message);
    res.status(needsBilling ? 402 : 503).json({
      error: needsBilling
        ? 'Vercel AI Gateway needs billing verification before it can answer. Add a valid credit card to the connected Vercel team, then try again.'
        : 'The AI assistant is temporarily unavailable. Please try again.',
    });
  }
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

