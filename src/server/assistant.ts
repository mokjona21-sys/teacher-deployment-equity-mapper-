import { generateText, gateway } from 'ai';

const SYSTEM_PROMPT = `You are the Teacher Deployment Equity Mapper assistant. Answer the user's question helpfully and clearly.

For questions about this dashboard, analyze only the supplied dashboard context for numbers, names, filters, KPIs, shortages, surpluses, school/district/subject comparisons, redeployment recommendations, charts, scenarios, and CSV export. Never invent dashboard values; if a requested value is missing, say so. For general questions, answer normally when you can, and connect the answer to staffing equity when relevant. For unsafe or impossible requests, explain the limitation briefly. Use plain text, short headings or bullets when useful, and show calculations step by step when helpful. Do not return JSON, markdown code fences, or empty output.`;

export async function answerAssistantQuestion(question: string, context: string) {
  const result = await generateText({
    model: gateway('openai/gpt-5.4-mini'),
    system: SYSTEM_PROMPT,
    prompt: `Dashboard context (authoritative; use it only for dashboard-specific facts):\n${context}\n\nUser question:\n${question}`,
    maxOutputTokens: 800,
    temperature: 0.2,
  });

  const answer = result.text.trim();
  if (!answer) throw new Error('The AI Gateway returned an empty answer.');
  return answer;
}
