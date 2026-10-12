import { FormEvent, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2, School, UserPlus } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseAuth } from '../lib/firebase';

type LoginPageProps = {
  onAuthenticated: () => void;
};

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'sign-in') {
        await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      }
      onAuthenticated();
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : '';
      const messages: Record<string, string> = {
        'Firebase: Error (auth/invalid-credential).': 'The email or password is incorrect.',
        'Firebase: Error (auth/email-already-in-use).': 'An account already exists for this email.',
        'Firebase: Error (auth/weak-password).': 'Use a password with at least 6 characters.',
        'Firebase: Error (auth/invalid-email).': 'Enter a valid email address.',
      };
      setError(messages[code] ?? 'Authentication failed. Check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-slate-100">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <section className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-7 shadow-2xl shadow-black/30 backdrop-blur sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20">
            <School className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">Teacher Equity Mapper</p>
            <p className="text-xs text-slate-400">Deployment intelligence</p>
          </div>
        </div>

        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-teal-300">{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">{mode === 'sign-in' ? 'Sign in to your workspace' : 'Start mapping equity'}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Access staffing insights, redeployment recommendations, and district-level equity tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-200">
            Email address
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10"
              placeholder="you@school.org"
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Password
            <span className="relative mt-2 block">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          {error && <p role="alert" className="rounded-xl border border-rose-900/70 bg-rose-950/50 px-4 py-3 text-sm text-rose-200">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'sign-in' ? <KeyRound className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isSubmitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); setError(''); }} className="mt-6 w-full text-center text-sm text-slate-400 transition hover:text-teal-300">
          {mode === 'sign-in' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  );
}
