'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ArrowLeft, Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please check and try again.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        'Supabase credentials are not configured yet. Please upload your credentials to .env.local to enable live registration.'
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        // Immediate login
        router.push('/');
        router.refresh();
      } else {
        // Confirmation email sent
        setSuccessMessage(
          'Account created successfully! Please check your email to confirm your account and begin your sanctuary journey.'
        );
        setLoading(false);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during registration. Please try again.');
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

      {/* Main Registration Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sanctuary-text-primary tracking-tight">
              Create your sanctuary
            </h1>
            <p className="text-xs sm:text-sm text-sanctuary-text-secondary max-w-sm">
              Your mindful haven for personal reflection, mood insights, and peaceful pause.
            </p>
          </div>

          <Card variant="white" className="p-6 sm:p-8 border border-sanctuary-border shadow-sanctuary-sm">
            {successMessage ? (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-sanctuary-text-primary">
                  Welcome to Renew You
                </h3>
                <p className="text-xs sm:text-sm text-sanctuary-text-secondary leading-relaxed">
                  {successMessage}
                </p>
                <Link href="/auth/login" className="w-full pt-2">
                  <Button variant="primary" fullWidth>
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
                  id="register-name"
                  type="text"
                  label="Your Name or Nickname"
                  placeholder="How should we address you?"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  id="register-email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  autoComplete="email"
                />

                <Input
                  id="register-password"
                  type="password"
                  label="Password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                  autoComplete="new-password"
                  helperText="Minimum 6 characters"
                />

                <Input
                  id="register-confirm-password"
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                  autoComplete="new-password"
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            )}

            <div className="pt-6 mt-6 border-t border-sanctuary-border/80 text-center">
              <p className="text-xs text-sanctuary-text-secondary">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-bold text-brand-purple hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-2 text-[11px] text-sanctuary-text-muted text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-mint shrink-0" />
            <span>Strict Row-Level Security ensures only you can view your personal wellness entries</span>
          </div>
        </div>
      </main>
    </div>
  );
}
