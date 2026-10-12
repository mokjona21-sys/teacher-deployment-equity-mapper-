import React, { FormEvent, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, School, UserRound } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const expectedUser = import.meta.env.vite_app_name || 'Mapper';
    const expectedPass = import.meta.env.vite_app_password || '1234';

    window.setTimeout(() => {
      if (username.trim() === expectedUser && password === expectedPass) {
        localStorage.setItem('teacher_mapper_authenticated', 'true');
        onLogin();
      } else {
        setError('Invalid username or password');
        setIsSubmitting(false);
      }
    }, 350);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <section className="w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-teal-950/30 sm:p-8" aria-labelledby="login-title">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/20">
              <School aria-hidden="true" className="size-8" />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Teacher Deployment Equity Mapper</p>
            <h1 id="login-title" className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">Sign in to access your school staffing dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              Username
              <span className="relative">
                <UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  placeholder="Enter your username"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-200">
              Password
              <span className="relative">
                <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                </button>
              </span>
            </label>

            {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2.5 text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-500 px-4 text-sm font-bold text-slate-950 transition-colors hover:bg-teal-400 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in to dashboard'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};
