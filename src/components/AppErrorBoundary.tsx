import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <section className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">EduMap</p>
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              The dashboard could not render this view. Reload the page to try again.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Reload dashboard
          </button>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;
