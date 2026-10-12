import { generateText, gateway } from 'ai';

const SYSTEM_PROMPT = `You are the Teacher Deployment Equity Mapper assistant. You help users understand this dashboard and analyze teacher staffing equity.

Only answer questions about: staffing requirements and availability, shortages and surpluses, school/district/subject comparisons, redeployment recommendations, dashboard filters, KPIs, charts, scenarios, and CSV export.
Use only the supplied dashboard context for numbers and names. Never invent data. If a detail is missing, say it is not available in the current dashboard data. For unrelated questions, politely redirect to the dashboard's staffing and equity workflows. Be concise, analytical, and show calculations when useful.`;

export async function answerAssistantQuestion(question: string, context: string) {
  const result = await generateText({
    model: gateway('openai/gpt-5.4-mini'),
    system: SYSTEM_PROMPT,
    prompt: `Dashboard context (authoritative):\n${context}\n\nUser question:\n${question}`,
    maxOutputTokens: 600,
    temperature: 0.1,
  });

  return result.text.trim();
}
