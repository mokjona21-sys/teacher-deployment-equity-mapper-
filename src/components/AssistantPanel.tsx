import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, X } from 'lucide-react';

type ChatMessage = { id: number; role: 'user' | 'assistant'; content: string };

type AssistantPanelProps = { context: string; onClose: () => void };

const starterPrompts = ['Largest shortages?', 'How does redeployment work?', 'Explain these KPIs'];

export function AssistantPanel({ context, onClose }: AssistantPanelProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const nextId = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setMessages((current) => [...current, { id: nextId.current++, role: 'user', content: trimmed }]);
    setQuestion('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, context }),
      });
      const text = await response.text();
      let payload: { answer?: string; error?: string };
      try {
        payload = JSON.parse(text) as { answer?: string; error?: string };
      } catch {
        throw new Error('The assistant service returned an invalid response. Please try again.');
      }
      if (!response.ok) throw new Error(payload.error ?? 'The assistant could not respond.');
      if (!payload.answer) throw new Error('The assistant returned an empty response.');
      setMessages((current) => [...current, { id: nextId.current++, role: 'assistant', content: payload.answer! }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The assistant could not respond.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside id="mapper-assistant-panel" className="fixed inset-x-3 top-[4.25rem] z-[60] flex max-h-[calc(100dvh-5.5rem)] w-auto flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-md dark:border-slate-700/90 dark:bg-slate-900/95 sm:left-auto sm:right-5 sm:w-[min(390px,calc(100vw-2rem))]" aria-label="Equity mapper AI assistant">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><Bot className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Mapper Assistant</h2><p className="text-[11px] text-slate-500 dark:text-slate-400">Staffing equity analyst</p></div></div>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close assistant"><X className="h-4 w-4" /></button>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.length === 0 && <div className="space-y-3"><p className="text-slate-500 dark:text-slate-400">Ask about the current dashboard, staffing gaps, or redeployment recommendations.</p><div className="flex flex-wrap gap-2">{starterPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => setQuestion(prompt)} className="rounded-full border border-teal-200 px-2.5 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-950/40">{prompt}</button>)}</div></div>}
        {messages.map((message) => <div key={message.id} className={message.role === 'user' ? 'ml-8 rounded-2xl rounded-br-sm bg-teal-600 px-3 py-2 text-white' : 'mr-4 rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 leading-6 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}><p className="whitespace-pre-wrap">{message.content}</p></div>)}
        {isLoading && <div className="mr-4 flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-500 dark:bg-slate-800"><Loader2 className="h-4 w-4 animate-spin" />Analyzing the dashboard…</div>}
        {error && <p role="alert" className="text-rose-600 dark:text-rose-400">{error}</p>}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-700"><input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={500} autoComplete="off" placeholder="Ask about staffing equity…" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" aria-label="Ask the mapper assistant" disabled={isLoading} /><button type="submit" disabled={!question.trim() || isLoading} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send question"><Send className="h-4 w-4" /></button></form>
    </aside>
  );
}
