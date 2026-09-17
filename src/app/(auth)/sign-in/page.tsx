'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageCircle,
  Plus,
  Sparkles,
  User,
  X,
  Loader2,
} from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { toast } from '../../../components/ui/use-toast';

type SavedAccount = {
  identifier: string;
  username?: string;
};

export default function SignInPage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<SavedAccount | null>(null);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved accounts
  useEffect(() => {
    const saved = localStorage.getItem('true-feedback-accounts');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setAccounts(parsed);
        }
      } catch {
        localStorage.removeItem('true-feedback-accounts');
      }
    }
  }, []);

  const saveAccount = (account: SavedAccount) => {
    const updatedAccounts = [
      account,
      ...accounts.filter(
        (item) => item.identifier !== account.identifier
      ),
    ].slice(0, 5);

    setAccounts(updatedAccounts);

    localStorage.setItem(
      'true-feedback-accounts',
      JSON.stringify(updatedAccounts)
    );
  };

  const handleAccountSelect = (account: SavedAccount) => {
    setSelectedAccount(account);
    setIdentifier(account.identifier);
    setShowLogin(true);
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIdentifier('');
    setPassword('');
    setShowLogin(true);
  };

  const handleRemoveAccount = (
    event: React.MouseEvent,
    account: SavedAccount
  ) => {
    event.stopPropagation();

    const updatedAccounts = accounts.filter(
      (item) => item.identifier !== account.identifier
    );

    setAccounts(updatedAccounts);

    localStorage.setItem(
      'true-feedback-accounts',
      JSON.stringify(updatedAccounts)
    );
  };

  const handleBack = () => {
    setShowLogin(false);
    setPassword('');
    setSelectedAccount(null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!identifier.trim()) {
      toast({
        title: 'Enter your email or username',
        variant: 'destructive',
      });
      return;
    }

    if (!password) {
      toast({
        title: 'Enter your password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier,
        password,
      });

      if (result?.error) {
        toast({
          title: 'Sign in failed',
          description: 'Invalid username/email or password.',
          variant: 'destructive',
        });
        return;
      }

      saveAccount({
        identifier,
      });

      toast({
        title: 'Welcome back! 👋',
        description: 'You have successfully signed in.',
      });

      router.replace('/dashboard');
    } catch (error) {
      console.error(error);

      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />

        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />

        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/10">

          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>

            <span className="text-2xl font-bold text-white">
              True Feedback
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Say what you
            <br />
            really think.
            <br />
            <span className="text-purple-400">
              Stay anonymous.
            </span>
          </h1>

          <p className="mt-6 text-gray-400 leading-relaxed max-w-md">
            Connect with friends and your community through
            honest anonymous messages.
          </p>

          <div className="flex items-center gap-3 mt-8 text-gray-300">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <span>Simple • Private • Anonymous</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-7 sm:p-10 md:p-12">

          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-xl bg-purple-600 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold text-white">
              True Feedback
            </span>
          </div>

          {!showLogin ? (
            <>
              {/* Account Selection */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-purple-300 text-sm mb-3">
                  <Sparkles className="h-4 w-4" />
                  Welcome back
                </div>

                <h2 className="text-3xl font-bold text-white">
                  Choose an account
                </h2>

                <p className="mt-2 text-gray-400">
                  Select an account to continue.
                </p>
              </div>

              <div className="space-y-3">

                {accounts.map((account) => (
                  <div
                    key={account.identifier}
                    className="group w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-purple-500/50 transition-all duration-300"
                  >
                    {/* Account selection button */}
                    <button
                      type="button"
                      onClick={() => handleAccountSelect(account)}
                      className="flex items-center gap-4 flex-1 min-w-0 text-left"
                    >
                      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {account.username || account.identifier}
                        </p>

                        <p className="text-sm text-gray-500 truncate">
                          {account.identifier}
                        </p>
                      </div>
                    </button>

                    {/* Remove account button */}
                    <button
                      type="button"
                      onClick={(event) =>
                        handleRemoveAccount(event, account)
                      }
                      className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition"
                      aria-label="Remove account"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add Account */}
                <button
                  type="button"
                  onClick={handleAddAccount}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/20 hover:border-purple-500/60 hover:bg-purple-500/5 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-purple-300" />
                  </div>

                  <div className="text-left">
                    <p className="font-semibold text-white">
                      Add another account
                    </p>

                    <p className="text-sm text-gray-500">
                      Sign in with a different account
                    </p>
                  </div>
                </button>

              </div>

              {accounts.length === 0 && (
                <div className="text-center mt-6 text-sm text-gray-500">
                  No saved accounts yet.
                  <br />
                  Add your first account below.
                </div>
              )}

              <Button
                type="button"
                onClick={handleAddAccount}
                className="w-full h-12 mt-7 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:scale-[1.01]"
              >
                {accounts.length === 0
                  ? 'Sign In'
                  : 'Use another account'}
              </Button>
            </>
          ) : (
            <>
              {/* Login Form */}
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-gray-400 hover:text-white transition mb-6"
              >
                ← Back to accounts
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Sign in
                </h2>

                <p className="mt-2 text-gray-400">
                  Continue to your True Feedback account.
                </p>
              </div>

              {/* Selected Account */}
              {selectedAccount && (
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {selectedAccount.identifier}
                    </p>

                    <p className="text-xs text-gray-500">
                      Selected account
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email or Username
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />

                    <Input
                      value={identifier}
                      onChange={(event) =>
                        setIdentifier(event.target.value)
                      }
                      placeholder="Enter email or username"
                      autoComplete="username"
                      className="h-12 pl-11 rounded-xl bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />

                    <Input
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 pl-11 pr-11 rounded-xl bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-3 text-gray-500 hover:text-white transition"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:scale-[1.01]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-slate-950 px-4 text-xs text-gray-500">
                    OR
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddAccount}
                className="w-full h-11 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Use another account
              </Button>
            </>
          )}

          {/* Signup */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link
              href="/sign-up"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Create one
            </Link>
          </p>

          <p className="text-center text-xs text-gray-600 mt-5">
            🔒 Your identity stays private.
          </p>
        </div>
      </div>
    </main>
  );
}