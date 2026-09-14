'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Shield, Lock, Mail, AlertCircle, CheckCircle2, LogOut, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/ingestion';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    async function checkExistingSession() {
      if (!isSupabaseConfigured) {
        // Check for local cookie
        const match = document.cookie.match(/(?:^|;\s*)paimana_officer_session=([^;]*)/);
        if (match) {
          setCurrentUser('Authorized Local Officer');
        }
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user.email || 'Authorized Officer');
        }
      } catch (err) {
        console.error('Session check failed', err);
      }
    }
    checkExistingSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!isSupabaseConfigured) {
        // Fallback for local testing when Supabase env vars are not set
        document.cookie = `paimana_officer_session=local_dev_token; path=/; max-age=86400; SameSite=Lax`;
        setCurrentUser(email || 'local-officer@pragati.gov.in');
        router.push(nextPath);
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'officer',
              organization: 'MoSPI / IPMD',
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          document.cookie = `paimana_officer_session=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax`;
          setCurrentUser(data.session.user.email || 'Authorized Officer');
          router.push(nextPath);
        } else {
          setSuccessMessage('Officer account created successfully! Please sign in with your credentials.');
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          document.cookie = `paimana_officer_session=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax`;
          setCurrentUser(data.session.user.email || 'Authorized Officer');
          router.push(nextPath);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      document.cookie = 'paimana_officer_session=; path=/; max-age=0; SameSite=Lax';
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Logout error', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">प्रगति • PRAGATI</div>
            <h1 className="text-xl font-bold text-slate-900">Officer Authorization Portal</h1>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Restricted access for MoSPI, IPMD, and designated project monitoring officers. Unauthenticated public
          visitors can browse published portfolio and risk views without signing in.
        </p>

        {!isSupabaseConfigured && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <span className="font-semibold">Notice:</span> Supabase environment variables are not yet configured.
            You can sign in using local verification mode or connect your Supabase project in Vercel settings.
          </div>
        )}

        {currentUser ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Active Session Detected
              </div>
              <p className="mt-1 text-xs text-emerald-700">Signed in as: <span className="font-mono">{currentUser}</span></p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => router.push(nextPath)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-800"
              >
                Continue to Ingestion Pipeline <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMessage(null); setSuccessMessage(null); }}
                className={`rounded-lg py-2 transition ${!isSignUp ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMessage(null); setSuccessMessage(null); }}
                className={`rounded-lg py-2 transition ${isSignUp ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Create Account
              </button>
            </div>

            {successMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Officer Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@mospi.gov.in"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-800 disabled:opacity-50"
            >
              {loading
                ? (isSignUp ? 'Creating Account...' : 'Authenticating...')
                : (isSignUp ? 'Register Officer Account' : 'Sign In as Officer')}
            </button>

            <div className="pt-2 text-center space-y-2">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(null); setSuccessMessage(null); }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 block w-full"
              >
                {isSignUp
                  ? 'Already have an officer account? Sign in'
                  : "Don't have an account? Register as an officer"}
              </button>
              <a href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-700 block">
                ← Return to Public PRAGATI Dashboard
              </a>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm font-medium text-slate-600">
          Loading officer authorization portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
