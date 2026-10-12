import React, { FormEvent, useState } from 'react';
import { Eye, EyeOff, Loader2, School, UserPlus } from 'lucide-react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: 'teacher-equity.firebaseapp.com',
  projectId: 'teacher-equity',
  storageBucket: 'teacher-equity.firebasestorage.app',
  messagingSenderId: '859100924582',
  appId: '1:859100924582:web:817f764401808721700267',
  measurementId: 'G-BRGKLKXQYF',
};

async function getFirebaseAuth() {
  const [{ initializeApp, getApps }, auth] = await Promise.all([
    import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),
    import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js'),
  ]);
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return { auth: auth.getAuth(app), functions: auth };
}

interface LoginPageProps {
  onAuthenticated: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (!firebaseConfig.apiKey) {
        throw new Error('Firebase API key is not configured. Add VITE_FIREBASE_API_KEY to the project environment.');
      }
      const { auth, functions } = await getFirebaseAuth();
      if (mode === 'signup') {
        await functions.createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await functions.signInWithEmailAndPassword(auth, email.trim(), password);
      }
      localStorage.setItem('teacher_equity_authenticated', 'true');
      onAuthenticated();
    } catch (cause) {
      const code = String((cause as { code?: string })?.code || '');
      setError(code.includes('invalid-credential') || code.includes('user-not-found') || code.includes('wrong-password')
        ? 'Invalid email or password.'
        : code.includes('email-already-in-use')
          ? 'An account with this email already exists.'
          : code.includes('weak-password')
            ? 'Password must be at least 6 characters.'
            : (cause as Error).message || 'Unable to authenticate. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
            <School className="size-7" aria-hidden="true" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">Teacher equity mapper</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{mode === 'login' ? 'Sign in to continue to your district dashboard.' : 'Create an account to access the planning workspace.'}</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-950" placeholder="you@example.com" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Password
            <span className="relative">
              <input required minLength={6} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 font-normal outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-950" placeholder="At least 6 characters" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-teal-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </span>
          </label>
          {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
          <button disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70">
            {busy ? <Loader2 className="size-5 animate-spin" /> : mode === 'login' ? 'Sign in' : <><UserPlus className="size-5" /> Create account</>}
          </button>
        </form>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="mt-6 w-full text-center text-sm font-semibold text-teal-700 hover:underline dark:text-teal-300">
          {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  );
};

export default LoginPage;

