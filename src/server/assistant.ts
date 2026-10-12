import { generateText } from 'ai';

export async function answerAssistantQuestion(question: string, context: string) {
  const result = await generateText({
    model: 'openai/gpt-oss-120b',
    system:
      'You are the Teacher Deployment Equity Mapper assistant. Answer concisely and clearly about teacher staffing equity, shortages, surpluses, redeployment, and interpreting the dashboard. Use only the supplied dashboard context for specific numbers. If the context does not contain an answer, say so instead of inventing data.',
    prompt: `Dashboard context:\n${context}\n\nUser question:\n${question}`,
  });

  return result.text;
}
