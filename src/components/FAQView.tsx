import React, { useState } from 'react';
import { BookOpen, ChevronDown, Lightbulb, Search, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';

const faqs = [
  { question: 'What does the equity score mean?', answer: 'The equity score summarizes how evenly teacher availability meets requirements across the filtered schools. A higher score indicates fewer imbalances; use it as a planning signal alongside local context, not as a standalone decision.' },
  { question: 'How are shortages and surpluses calculated?', answer: 'For each school and subject, the mapper compares available teachers with required teachers. A negative balance is a shortage, a positive balance is a surplus, and zero is balanced. The dashboard recalculates these values whenever you change filters or apply a simulation.' },
  { question: 'How does the redeployment engine choose a move?', answer: 'Recommendations match a surplus in one school to a shortage in another school for the same subject, while respecting the maximum travel distance. Review each proposed move before applying it; the engine is decision support, not an automatic placement system.' },
  { question: 'What happens when I apply a move?', answer: 'Applying a move updates the current in-memory planning scenario and refreshes the KPIs, tables, charts, and recommendations. Use Reset Simulation to return to the original dataset. Export the scenario if you need to preserve a record of your analysis.' },
  { question: 'Why do the numbers change when I filter?', answer: 'KPIs and visualizations describe the records currently in view. District, subject, search, and status filters narrow the dataset so you can investigate a specific planning question without changing the underlying records.' },
  { question: 'How should I use the audit export?', answer: 'Use Audit & Reports to review the current scope, methodology, and generated recommendations. Export CSV creates a portable snapshot of the records and calculations currently visible in your planning scenario.' },
];

const tips = [
  { icon: SlidersHorizontal, title: 'Start broad, then narrow', text: 'Review the full overview before filtering to a district or subject. This gives you context for local shortages and prevents isolated numbers from being misread.' },
  { icon: ShieldCheck, title: 'Validate before acting', text: 'Treat recommendations as a shortlist. Confirm teacher qualifications, availability, safeguarding requirements, and local travel constraints before making a real assignment.' },
  { icon: Sparkles, title: 'Compare scenarios', text: 'Adjust the distance threshold, apply feasible moves, and compare the KPI changes. Reset the simulation to test another scenario from the original baseline.' },
  { icon: BookOpen, title: 'Keep an audit trail', text: 'Use the audit view and CSV export after important planning sessions so decisions can be reviewed with the assumptions that produced them.' },
];

export const FAQView: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState(0);
  const [search, setSearch] = useState('');
  const filteredFaqs = faqs.filter(({ question, answer }) => `${question} ${answer}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-8">
      <section className="overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-slate-50 p-6 dark:border-teal-900/70 dark:from-teal-950/50 dark:via-slate-900 dark:to-slate-900 lg:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:border-teal-800 dark:bg-slate-900/70 dark:text-teal-200"><BookOpen className="h-3.5 w-3.5" /> Help centre</div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white lg:text-3xl">Plan with clarity and confidence</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Find quick answers about the mapper, understand how the calculations work, and use practical tips to turn the analysis into responsible staffing decisions.</p>
          <label className="relative mt-5 block max-w-xl"><span className="sr-only">Search frequently asked questions</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the FAQ" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none ring-teal-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:p-6" aria-labelledby="faq-heading">
          <div className="mb-4"><h3 id="faq-heading" className="text-base font-bold text-slate-900 dark:text-white">Frequently asked questions</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Transparent answers to the workflows you use most.</p></div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => { const isOpen = faqs.indexOf(faq) === openQuestion; return <div key={faq.question}><button type="button" onClick={() => setOpenQuestion(faqs.indexOf(faq))} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-slate-800 dark:text-slate-200"><span>{faq.question}</span><ChevronDown className={`h-4 w-4 shrink-0 text-teal-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <p className="-mt-1 pb-4 pr-8 text-sm leading-6 text-slate-600 dark:text-slate-400">{faq.answer}</p>}</div>; }) : <p className="py-8 text-center text-sm text-slate-500">No matching questions found.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/70 dark:bg-amber-950/20 lg:p-6" aria-labelledby="tips-heading">
          <div className="mb-4 flex items-start gap-3"><div className="rounded-xl bg-amber-100 p-2.5 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"><Lightbulb className="h-5 w-5" /></div><div><h3 id="tips-heading" className="text-base font-bold text-slate-900 dark:text-white">Helpful tips</h3><p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Small habits for better planning decisions.</p></div></div>
          <div className="space-y-4">{tips.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" /><div><h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h4><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{text}</p></div></div>)}</div>
        </section>
      </div>
    </div>
  );
};

export default FAQView;
