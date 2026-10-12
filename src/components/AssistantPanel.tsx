import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, X } from 'lucide-react';

type AssistantPanelProps = {
  context: string;
  onClose: () => void;
};

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export function AssistantPanel({ context, onClose }: AssistantPanelProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const nextMessageId = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || isLoading) return;

    const submittedQuestion = question.trim();
    const userMessage = { id: nextMessageId.current++, role: 'user' as const, content: submittedQuestion };
    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: submittedQuestion, context }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'The assistant could not respond.');
      setMessages((current) => [...current, { id: nextMessageId.current++, role: 'assistant', content: payload.answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The assistant could not respond.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside id="mapper-assistant-panel" className="fixed inset-x-3 top-[4.25rem] z-[60] flex max-h-[calc(100dvh-5.5rem)] w-auto flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-md dark:border-slate-700/90 dark:bg-slate-900/95 sm:left-auto sm:right-5 sm:w-[min(390px,calc(100vw-2rem))]" aria-label="Equity mapper AI assistant">
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

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-slate-500 dark:text-slate-400">Ask about the current dashboard, staffing gaps, or redeployment recommendations.</p>
            <div className="flex flex-wrap gap-2">
              {['Largest shortages?', 'How does redeployment work?', 'Explain these KPIs'].map((prompt) => (
                <button key={prompt} type="button" onClick={() => setQuestion(prompt)} className="rounded-full border border-teal-200 px-2.5 py-1.5 text-left text-xs font-medium text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-950/40">{prompt}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'ml-8 rounded-2xl rounded-br-sm bg-teal-600 px-3 py-2 text-white' : 'mr-4 rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 leading-6 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {isLoading && <div className="mr-4 flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-500 dark:bg-slate-800"><Loader2 className="h-4 w-4 animate-spin" />Analyzing the dashboard…</div>}
        {error && <div role="alert" className="space-y-2 text-rose-600 dark:text-rose-400"><p>{error}</p><button type="button" onClick={() => setError('')} className="text-xs font-semibold underline">Dismiss</button></div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
        <label className="sr-only" htmlFor="assistant-question">Ask the assistant</label>
        <input id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question…" maxLength={500} autoComplete="off" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" disabled={isLoading} />
        <button type="submit" disabled={isLoading || !question.trim()} aria-label="Send question" className="rounded-lg bg-teal-600 px-3 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /></button>
      </form>
    </aside>
  );
}
