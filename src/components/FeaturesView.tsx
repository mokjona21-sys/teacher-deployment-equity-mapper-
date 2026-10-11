import React from 'react';
import {
  ArrowLeftRight,
  BarChart3,
  FileSpreadsheet,
  GraduationCap,
  MapPin,
  School,
  Users,
} from 'lucide-react';
import { ViewMode } from '../types';

interface FeaturesViewProps {
  onNavigate: (view: ViewMode) => void;
}

const features = [
  { title: 'School Directory', description: 'Review school staffing, enrollment, subject coverage, and local gaps.', icon: School, view: 'roster' as ViewMode },
  { title: 'Teacher Deployment', description: 'Match available teachers to schools with the greatest need.', icon: Users, view: 'redeployment' as ViewMode },
  { title: 'District Planning', description: 'Compare district-wide parity and understand where resources are concentrated.', icon: MapPin, view: 'map' as ViewMode },
  { title: 'Equity Analytics', description: 'Explore trends, subject deficits, and coverage ratios at a glance.', icon: BarChart3, view: 'visualizations' as ViewMode },
  { title: 'Scenario Planning', description: 'Adjust staffing levels and test the impact before making a decision.', icon: ArrowLeftRight, view: 'overview' as ViewMode },
  { title: 'Reports & Audit', description: 'Export a clear record of staffing decisions and equity methodology.', icon: FileSpreadsheet, view: 'audit' as ViewMode },
];

export const FeaturesView: React.FC<FeaturesViewProps> = ({ onNavigate }) => (
  <section className="space-y-6" aria-labelledby="features-heading">
    <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-6 dark:border-teal-900/70 dark:from-teal-950/50 dark:to-slate-900">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
          <GraduationCap className="size-6" />
        </div>
        <div>
          <h2 id="features-heading" className="text-xl font-bold text-slate-900 dark:text-white">One workspace for equitable deployment</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Move from school-level data to district-wide action with connected tools for staffing, planning, analysis, and reporting.</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {features.map(({ title, description, icon: Icon, view }) => (
        <button key={title} onClick={() => onNavigate(view)} className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
          <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-teal-700 transition-colors group-hover:bg-teal-100 dark:bg-slate-800 dark:text-teal-300 dark:group-hover:bg-teal-950/70">
            <Icon className="size-5" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{description}</p>
          <span className="mt-4 inline-block text-xs font-semibold text-teal-700 dark:text-teal-300">Open workflow →</span>
        </button>
      ))}
    </div>
  </section>
);
