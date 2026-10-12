import 'dotenv/config';
import express from 'express';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import { answerAssistantQuestion } from './src/server/assistant';

const app = express();
app.use(express.json({ limit: '32kb' }));

app.post('/api/assistant', async (req, res) => {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  const context = typeof req.body?.context === 'string' ? req.body.context.slice(0, 12000) : '';

  if (!question || question.length > 500) {
    res.status(400).json({ error: 'Enter a question up to 500 characters.' });
    return;
  }

  try {
    const answer = await answerAssistantQuestion(question, context);
    res.json({ answer });
  } catch (error) {
    console.error('[v0] Assistant request failed:', error);
    res.status(500).json({ error: 'The assistant is temporarily unavailable.' });
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

