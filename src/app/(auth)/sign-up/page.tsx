'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Sparkles,
  User,
} from 'lucide-react';
import * as z from 'zod';

import { Button } from '../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { toast } from '../../../components/ui/use-toast';
import { ApiResponse } from '../../../types/ApiResponse';

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be at most 20 characters'),

    email: z
      .string()
      .email('Please enter a valid email'),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);

    try {
      // Don't send confirmPassword to backend
      const { confirmPassword, ...signupData } = data;

      const response = await axios.post<ApiResponse>(
        '/api/sign-up',
        signupData
      );

      if (!response.data.success) {
        toast({
          title: 'Registration failed',
          description:
            response.data.message ||
            'Unable to create account.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Account created! 🎉',
        description:
          response.data.message ||
          'Please verify your account.',
      });

      // Go to verification page
      window.location.href = `/verify/${data.username}`;
    } catch (error) {
  if (axios.isAxiosError(error)) {
    console.log("❌ STATUS:", error.response?.status);
    console.log("❌ SERVER ERROR:", error.response?.data);
  } else {
    console.log("❌ ERROR:", error);
  }
} finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-pink-600/15 blur-3xl" />

        <div className="absolute top-1/2 left-1/2 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

      </div>

      {/* Main card */}
      <div className="relative w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/10">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">

            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>

            <span className="text-2xl font-bold text-white">
              True Feedback
            </span>

          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Create your
            <br />
            anonymous
            <br />
            <span className="text-purple-400">
              message board.
            </span>
          </h1>

          <p className="mt-6 text-gray-400 max-w-md leading-relaxed">
            Share your profile with friends and receive
            honest anonymous messages.
          </p>

          <div className="mt-8 space-y-4">

            <Feature text="Anonymous messages" />

            <Feature text="Personal message board" />

            <Feature text="AI message suggestions" />

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-7 sm:p-10 md:p-12">

          {/* Mobile logo */}
          <div className="md:hidden flex justify-center items-center gap-3 mb-8">

            <div className="h-11 w-11 rounded-xl bg-purple-600 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>

            <span className="text-xl font-bold text-white">
              True Feedback
            </span>

          </div>

          {/* Heading */}
          <div className="mb-8">

            <div className="inline-flex items-center gap-2 text-purple-300 text-sm mb-3">
              <Sparkles className="h-4 w-4" />
              Start for free
            </div>

            <h2 className="text-3xl font-bold text-white">
              Create account 🚀
            </h2>

            <p className="mt-2 text-gray-400">
              Create your anonymous message board.
            </p>

          </div>

          <Form {...form}>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* USERNAME */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="text-gray-300">
                      Username
                    </FormLabel>

                    <FormControl>

                      <div className="relative">

                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />

                        <Input
                          {...field}
                          placeholder="Choose a username"
                          autoComplete="username"
                          className="h-12 pl-11 bg-black/20 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500"
                        />

                      </div>

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="text-gray-300">
                      Email
                    </FormLabel>

                    <FormControl>

                      <div className="relative">

                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />

                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-12 pl-11 bg-black/20 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500"
                        />

                      </div>

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="text-gray-300">
                      Password
                    </FormLabel>

                    <FormControl>

                      <div className="relative">

                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />

                        <Input
                          {...field}
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          placeholder="Create a password"
                          autoComplete="new-password"
                          className="h-12 pl-11 pr-11 bg-black/20 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          className="absolute right-3 top-3 text-gray-500 hover:text-white transition"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>

                      </div>

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* CONFIRM PASSWORD */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="text-gray-300">
                      Confirm Password
                    </FormLabel>

                    <FormControl>

                      <div className="relative">

                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />

                        <Input
                          {...field}
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          className="h-12 pl-11 pr-11 bg-black/20 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-3 top-3 text-gray-500 hover:text-white transition"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>

                      </div>

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* CREATE ACCOUNT */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-[1.01]"
              >

                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}

              </Button>

            </form>

          </Form>

          {/* SIGN IN */}
          <p className="text-center text-sm text-gray-400 mt-7">

            Already have an account?{' '}

            <Link
              href="/sign-in"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign in
            </Link>

          </p>

          <p className="text-center text-xs text-gray-600 mt-6">
            🔒 We respect your privacy.
          </p>

        </div>
      </div>
    </main>
  );
}


/* Feature component */
function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-300">

      <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
        <Check className="h-4 w-4 text-green-400" />
      </div>

      <span>{text}</span>

    </div>
  );
}