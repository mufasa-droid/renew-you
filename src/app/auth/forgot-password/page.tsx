'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ArrowLeft, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        'Supabase credentials are not configured yet. Please upload your credentials to .env.local to enable password recovery.'
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sanctuary-bg text-sanctuary-text-primary flex flex-col selection:bg-brand-purple-light selection:text-brand-purple">
      {/* Top Header Bar */}
      <header className="w-full bg-[#FBF9FD]/95 border-b border-sanctuary-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 text-xs font-semibold text-sanctuary-text-secondary hover:text-brand-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>

          <Logo size="sm" showText={true} showTagline={false} orientation="horizontal" />

          <div className="w-24" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-tight">
              Reset your password
            </h1>
            <p className="text-xs sm:text-sm text-sanctuary-text-secondary max-w-sm">
              Enter your email address and we will send you a secure link to reset your sanctuary access.
            </p>
          </div>

          <Card variant="white" className="p-6 sm:p-8 border border-sanctuary-border shadow-sanctuary-sm">
            {success ? (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-sanctuary-text-primary">
                  Check your inbox
                </h3>
                <p className="text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed">
                  We sent a recovery link to <strong>{email}</strong>. Follow the link in the email to set a new password.
                </p>
                <Link href="/auth/login" className="w-full pt-2">
                  <Button variant="secondary" fullWidth>
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-4">
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
                  id="reset-email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  autoComplete="email"
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Send Recovery Link
                  </Button>
                </div>
              </form>
            )}

            <div className="pt-6 mt-6 border-t border-sanctuary-border/80 text-center">
              <Link
                href="/auth/login"
                className="text-xs font-semibold text-brand-purple hover:underline"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
