'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ArrowLeft, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        'Supabase credentials are not configured yet. Please upload your credentials to .env.local to enable live sign in.'
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setErrorMessage('An unexpected error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col selection:bg-brand-purple-light selection:text-brand-purple">
      {/* Top Header Bar */}
      <header className="w-full bg-[#FBF9FD]/95 border-b border-sanctuary-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sanctuary</span>
          </Link>

          <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />

          <div className="w-24" />
        </div>
      </header>

      {/* Main Login Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-sanctuary-text-secondary max-w-sm">
              Sign in to your private sanctuary to continue your mindful journey and access your saved check-ins.
            </p>
          </div>

          <Card variant="white" className="p-6 sm:p-8 border border-sanctuary-border shadow-sanctuary-sm">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <Input
                id="login-email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
              />

              <div className="flex flex-col gap-1">
                <Input
                  id="login-password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                  autoComplete="current-password"
                />
                <div className="flex justify-end pt-0.5">
                  <Link
                    href="/auth/forgot-password"
                    className="text-[11px] font-semibold text-brand-purple hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In
                </Button>
              </div>
            </form>

            <div className="pt-6 mt-6 border-t border-sanctuary-border/80 text-center">
              <p className="text-xs text-sanctuary-text-secondary">
                Don&apos;t have an account yet?{' '}
                <Link
                  href="/auth/register"
                  className="font-bold text-brand-purple hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-2 text-[11px] text-sanctuary-text-muted text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-mint shrink-0" />
            <span>Encrypted transmission &amp; strictly confidential storage</span>
          </div>
        </div>
      </main>
    </div>
  );
}
