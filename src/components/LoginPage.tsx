import { FormEvent, useState } from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';

type LoginPageProps = { onAuthenticated: () => void };

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Invalid username or password.');
      onAuthenticated();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center">
        <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <LockKeyhole aria-hidden="true" />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">EduMap</p>
        <h1 className="text-3xl font-semibold tracking-tight">Sign in to your dashboard</h1>
        <p className="mt-3 text-muted-foreground">Use your administrator credentials to manage districts, schools, and teachers.</p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="username">
            Username
            <input id="username" name="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="password">
            Password
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-lg border border-input bg-background px-3 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            {!isSubmitting && <ArrowRight aria-hidden="true" />}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
