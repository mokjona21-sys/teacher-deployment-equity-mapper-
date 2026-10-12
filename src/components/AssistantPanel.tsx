import { FormEvent, useState } from 'react';
import { Bot, Loader2, Send, X } from 'lucide-react';

type AssistantPanelProps = {
  context: string;
  onClose: () => void;
};

export function AssistantPanel({ context, onClose }: AssistantPanelProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), context }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'The assistant could not respond.');
      setAnswer(payload.answer);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The assistant could not respond.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside id="mapper-assistant-panel" className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-5 z-[60] flex max-h-[min(32rem,calc(100dvh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-md dark:border-slate-700/90 dark:bg-slate-900/95" aria-label="Equity mapper AI assistant">
      <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white dark:bg-teal-700">
        <div className="flex items-center gap-3">
          <Bot className="h-5 w-5 text-teal-300" />
          <div>
            <p className="text-sm font-bold">Mapper Assistant</p>
            <p className="text-[11px] text-slate-300">Ask about your staffing data</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close assistant" className="rounded-md p-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto p-4 text-sm">
        {!answer && !error && <p className="text-slate-500 dark:text-slate-400">Try “Which schools have the largest teacher shortages?”</p>}
        {isLoading && <div className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Analyzing the dashboard…</div>}
        {answer && <p className="whitespace-pre-wrap leading-6 text-slate-700 dark:text-slate-200">{answer}</p>}
        {error && <p role="alert" className="text-rose-600 dark:text-rose-400">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
        <label className="sr-only" htmlFor="assistant-question">Ask the assistant</label>
        <input id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" disabled={isLoading} />
        <button type="submit" disabled={isLoading || !question.trim()} aria-label="Send question" className="rounded-lg bg-teal-600 px-3 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /></button>
      </form>
    </aside>
  );
}
