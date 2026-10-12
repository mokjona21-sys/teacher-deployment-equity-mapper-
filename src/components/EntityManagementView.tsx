import React, { useMemo, useState } from 'react';
import { Building2, Check, GraduationCap, MapPinned, Plus, Search, Trash2, Users } from 'lucide-react';

type EntityType = 'district' | 'school' | 'teacher';

export type Entity = {
  id: string;
  type: EntityType;
  name: string;
  detail: string;
  meta: string;
};

export const INITIAL_ENTITIES: Entity[] = [
  { id: 'd-1', type: 'district', name: 'North Valley District', detail: 'NVD-001', meta: '4 schools' },
  { id: 'd-2', type: 'district', name: 'Lakeside District', detail: 'LSD-014', meta: '3 schools' },
  { id: 's-1', type: 'school', name: 'North Valley High School', detail: 'North Valley District', meta: '842 students' },
  { id: 's-2', type: 'school', name: 'Lakeside Middle School', detail: 'Lakeside District', meta: '516 students' },
  { id: 't-1', type: 'teacher', name: 'Jordan Williams', detail: 'Mathematics · North Valley High', meta: 'Full-time' },
  { id: 't-2', type: 'teacher', name: 'Priya Shah', detail: 'Science · Lakeside Middle', meta: 'Full-time' },
];

const TYPE_META: Record<EntityType, { label: string; singular: string; icon: typeof Building2 }> = {
  district: { label: 'Districts', singular: 'District', icon: MapPinned },
  school: { label: 'Schools', singular: 'School', icon: Building2 },
  teacher: { label: 'Teachers', singular: 'Teacher', icon: GraduationCap },
};

type EntityManagementViewProps = {
  entities: Entity[];
  onEntitiesChange: (entities: Entity[]) => void;
};

export const EntityManagementView: React.FC<EntityManagementViewProps> = ({ entities, onEntitiesChange }) => {
  const [activeType, setActiveType] = useState<EntityType>('district');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', detail: '', meta: '' });
  const [saved, setSaved] = useState(false);

  const visibleEntities = useMemo(() => entities.filter((entity) => entity.type === activeType && `${entity.name} ${entity.detail}`.toLowerCase().includes(search.toLowerCase())), [activeType, entities, search]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.detail.trim()) return;
    onEntitiesChange([{ id: `${activeType}-${Date.now()}`, type: activeType, name: form.name.trim(), detail: form.detail.trim(), meta: form.meta.trim() || 'Active' }, ...entities]);
    setForm({ name: '', detail: '', meta: '' });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const removeEntity = (id: string) => onEntitiesChange(entities.filter((entity) => entity.id !== id));
  const ActiveIcon = TYPE_META[activeType].icon;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">System directory</p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Add schools, teachers, and districts</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Keep your planning directory current. Add the organizations and people that power staffing analysis and equity recommendations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(Object.keys(TYPE_META) as EntityType[]).map((type) => {
          const Icon = TYPE_META[type].icon;
          const count = entities.filter((entity) => entity.type === type).length;
          return <button key={type} onClick={() => setActiveType(type)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${activeType === type ? 'border-teal-300 bg-teal-50 text-teal-950 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-100' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'}`}><span className="flex size-10 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm dark:bg-slate-800 dark:text-teal-300"><Icon className="size-5" /></span><span><span className="block text-sm font-semibold">{TYPE_META[type].label}</span><span className="block text-xs text-slate-500 dark:text-slate-400">{count} in directory</span></span></button>;
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><div><h3 className="font-semibold text-slate-950 dark:text-white">{TYPE_META[activeType].label}</h3><p className="text-xs text-slate-500 dark:text-slate-400">Manage directory records and assignments</p></div><label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><span className="sr-only">Search {TYPE_META[activeType].label.toLowerCase()}</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-500 sm:w-56 dark:border-slate-700 dark:bg-slate-950" /></label></div>
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">{visibleEntities.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">No matching records yet.</div> : visibleEntities.map((entity) => <div key={entity.id} className="flex items-center justify-between gap-4 p-4"><div className="flex min-w-0 items-center gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><ActiveIcon className="size-4" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{entity.name}</p><p className="truncate text-xs text-slate-500 dark:text-slate-400">{entity.detail} · {entity.meta}</p></div></div><button onClick={() => removeEntity(entity.id)} aria-label={`Remove ${entity.name}`} className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"><Trash2 className="size-4" /></button></div>)}</div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="mb-5 flex items-start gap-3"><div className="flex size-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><Plus className="size-5" /></div><div><h3 className="font-semibold text-slate-950 dark:text-white">Add {TYPE_META[activeType].singular.toLowerCase()}</h3><p className="text-xs leading-5 text-slate-500 dark:text-slate-400">New records appear in the directory immediately.</p></div></div><div className="flex flex-col gap-4"><label className="flex flex-col gap-1.5 text-sm font-medium">{activeType === 'teacher' ? 'Teacher name' : `${TYPE_META[activeType].singular} name`}<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={activeType === 'teacher' ? 'e.g. Taylor Morgan' : activeType === 'school' ? 'e.g. Riverside Elementary' : 'e.g. East Ridge District'} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="flex flex-col gap-1.5 text-sm font-medium">{activeType === 'teacher' ? 'Subject and school' : activeType === 'school' ? 'District' : 'District code'}<input required value={form.detail} onChange={(event) => setForm({ ...form, detail: event.target.value })} placeholder={activeType === 'teacher' ? 'e.g. English · Riverside Elementary' : activeType === 'school' ? 'e.g. East Ridge District' : 'e.g. ERD-022'} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950" /></label><label className="flex flex-col gap-1.5 text-sm font-medium">{activeType === 'teacher' ? 'Employment status' : activeType === 'school' ? 'Enrollment' : 'Notes'}<input value={form.meta} onChange={(event) => setForm({ ...form, meta: event.target.value })} placeholder={activeType === 'teacher' ? 'Full-time' : activeType === 'school' ? 'e.g. 650 students' : 'Optional'} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950" /></label><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-800"><Plus className="size-4" />Add {TYPE_META[activeType].singular}</button>{saved && <p role="status" className="flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-300"><Check className="size-3.5" />Added to directory</p>}</div></form>
      </div>
    </section>
  );
};

void Users;
void MapPinned;
void Building2;
void GraduationCap;
