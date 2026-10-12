import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { SchoolRecord } from '../types';

type AddRosterRecordFormProps = {
  onAdd: (record: SchoolRecord) => void;
};

const initialForm = { district: '', school: '', subject: 'Mathematics', pupils: '', required: '', available: '', km: '' };

export const AddRosterRecordForm: React.FC<AddRosterRecordFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const update = (field: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const required = Number(form.required);
    const available = Number(form.available);
    if (!form.district.trim() || !form.school.trim() || !form.subject.trim() || !Number.isInteger(required) || required < 0 || !Number.isInteger(available) || available < 0) return;

    onAdd({
      id: `user-${Date.now()}`,
      district: form.district.trim(),
      school: form.school.trim(),
      subject: form.subject.trim(),
      required,
      available,
      km: Number(form.km) >= 0 ? Number(form.km) : 0,
      studentCount: Number(form.pupils) > 0 ? Number(form.pupils) : undefined,
      isNew: true,
    });
    setForm(initialForm);
    setIsOpen(false);
  };

  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800/80">
      {!isOpen ? (
        <button type="button" onClick={() => setIsOpen(true)} className="m-4 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
          <Plus className="h-4 w-4" /> Add roster entry
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="m-4 rounded-xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/30">
          <div className="mb-3 flex items-center justify-between">
            <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Add district staffing record</h3><p className="text-xs text-slate-600 dark:text-slate-400">The shortage or surplus is calculated from required minus available teachers.</p></div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close add roster form" className="rounded-md p-1 text-slate-500 hover:bg-white dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {([['district', 'District name', 'e.g. Kampala'], ['school', 'School name', 'e.g. Kansaga Primary'], ['subject', 'Subject', 'e.g. Social Studies'], ['pupils', 'Pupils', 'e.g. 450'], ['required', 'Required teachers', 'e.g. 4'], ['available', 'Available teachers', 'e.g. 2'], ['km', 'Distance (km)', 'e.g. 5']] as const).map(([field, label, placeholder]) => (
              <label key={field} className={field === 'school' || field === 'subject' ? 'sm:col-span-2' : ''}>
                <span className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
                <input required={['district', 'school', 'subject', 'required', 'available'].includes(field)} type={['pupils', 'required', 'available', 'km'].includes(field) ? 'number' : 'text'} min="0" value={form[field]} onChange={(event) => update(field, event.target.value)} placeholder={placeholder} className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </label>
            ))}
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">Add to roster</button>
        </form>
      )}
    </div>
  );
};
