'use client';

import { MessageCard } from '../../../components/MessageCard';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/seperator';
import { Switch } from '../../../components/ui/switch';
import { useToast } from '../../../components/ui/use-toast';
import { Message } from '../../../model/user';
import { ApiResponse } from '../../../types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';

import axios, { AxiosError } from 'axios';

import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  Moon,
  RefreshCcw,
  Sparkles,
  Sun,
} from 'lucide-react';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '../../../schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] =
    useState(false);

  const [isCopied, setIsCopied] = useState(false);

  const [isDark, setIsDark] = useState(true);

  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  /* --------------------------------
     THEME
  -------------------------------- */

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      'true-feedback-theme'
    );

    if (savedTheme === 'light') {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;

    setIsDark(newTheme);

    localStorage.setItem(
      'true-feedback-theme',
      newTheme ? 'dark' : 'light'
    );
  };

  /* --------------------------------
     DELETE MESSAGE
  -------------------------------- */

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter(
        (message) => message._id !== messageId
      )
    );
  };

  /* --------------------------------
     FETCH ACCEPT MESSAGES
  -------------------------------- */

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>(
        '/api/accept-messages'
      );

      setValue(
        'acceptMessages',
        response.data.isAcceptingMessages
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  /* --------------------------------
     FETCH MESSAGES
  -------------------------------- */

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);

      try {
        const response = await axios.get<ApiResponse>(
          '/api/get-messages'
        );

        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: 'Messages refreshed ✨',
            description: 'Showing your latest messages.',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ??
            'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  /* --------------------------------
     INITIAL LOAD
  -------------------------------- */

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [
    session,
    fetchMessages,
    fetchAcceptMessages,
  ]);

  /* --------------------------------
     ACCEPT MESSAGE SWITCH
  -------------------------------- */

  const handleSwitchChange = async () => {
    const newValue = !acceptMessages;

    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponse>(
        '/api/accept-messages',
        {
          acceptMessages: newValue,
        }
      );

      setValue('acceptMessages', newValue);

      toast({
        title: newValue
          ? 'Messages are now ON 💬'
          : 'Messages are now OFF',
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  /* --------------------------------
     LOADING
  -------------------------------- */

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  const profileUrl = `${baseUrl}/u/${username}`;

  /* --------------------------------
     COPY LINK
  -------------------------------- */

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);

      setIsCopied(true);

      toast({
        title: 'Link copied! 🔗',
        description:
          'Your profile link is ready to share.',
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? 'bg-[#050817] text-white'
          : 'bg-[#f7f8ff] text-slate-900'
      }`}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl ${
            isDark
              ? 'bg-purple-600/10'
              : 'bg-purple-300/30'
          }`}
        />

        <div
          className={`absolute top-1/3 -right-40 h-96 w-96 rounded-full blur-3xl ${
            isDark
              ? 'bg-blue-600/10'
              : 'bg-blue-300/20'
          }`}
        />

        <div
          className={`absolute bottom-0 left-1/3 h-96 w-96 rounded-full blur-3xl ${
            isDark
              ? 'bg-pink-600/10'
              : 'bg-pink-300/20'
          }`}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-10">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>

            <span className="font-bold text-lg">
              True Feedback
            </span>
          </div>

          {/* Theme */}
          <div
            className={`flex items-center gap-2 p-1 rounded-full border ${
              isDark
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (!isDark) return;
                toggleTheme();
              }}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                !isDark
                  ? 'bg-purple-600 text-white'
                  : isDark
                    ? 'text-gray-400 hover:text-white'
                    : ''
              }`}
              aria-label="Light mode"
            >
              <Sun className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (isDark) return;
                toggleTheme();
              }}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                isDark
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500'
              }`}
              aria-label="Dark mode"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-7">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />

              <span
                className={
                  isDark
                    ? 'text-purple-300'
                    : 'text-purple-600'
                }
              >
                Your private space
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, @{username} 👋
            </h1>

            <p
              className={`mt-2 ${
                isDark
                  ? 'text-gray-400'
                  : 'text-slate-500'
              }`}
            >
              Manage your anonymous messages from here.
            </p>
          </div>

          {/* MESSAGE COUNT */}
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl ${
              isDark
                ? 'bg-white/[0.05] border-white/10'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="h-11 w-11 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-purple-500" />
            </div>

            <div>
              <p className="text-2xl font-bold">
                {messages.length}
              </p>

              <p
                className={`text-xs ${
                  isDark
                    ? 'text-gray-500'
                    : 'text-slate-500'
                }`}
              >
                Messages received
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE LINK */}
        <section
          className={`relative rounded-3xl p-6 mb-6 border overflow-hidden ${
            isDark
              ? 'border-purple-500/20'
              : 'border-purple-200'
          }`}
        >
          <div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-gradient-to-r from-purple-500/20 via-blue-500/15 to-pink-500/20'
                : 'bg-gradient-to-r from-purple-100 via-blue-50 to-pink-100'
            }`}
          />

          <div className="relative">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-purple-500" />
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    Your Anonymous Profile
                  </h2>

                  <p
                    className={`text-sm ${
                      isDark
                        ? 'text-gray-400'
                        : 'text-slate-500'
                    }`}
                  >
                    Share this link to receive messages
                  </p>
                </div>
              </div>

              <Button
                onClick={copyToClipboard}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              >
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">

              <div
                className={`flex-1 rounded-xl px-4 py-3 border ${
                  isDark
                    ? 'bg-black/20 border-white/10'
                    : 'bg-white/70 border-slate-200'
                }`}
              >
                <p
                  className={`text-sm truncate ${
                    isDark
                      ? 'text-gray-300'
                      : 'text-slate-600'
                  }`}
                >
                  {profileUrl}
                </p>
              </div>

              <a
                href={`/u/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition ${
                  isDark
                    ? 'border-white/10 bg-white/5 hover:bg-white/10'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <ExternalLink className="h-4 w-4" />
                View Profile
              </a>
            </div>
          </div>
        </section>

        {/* ACCEPT MESSAGES */}
        <section
          className={`rounded-3xl p-5 md:p-6 mb-8 border ${
            isDark
              ? 'bg-white/[0.04] border-white/10'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  acceptMessages
                    ? 'bg-green-500/15'
                    : 'bg-gray-500/10'
                }`}
              >
                <MessageCircle
                  className={
                    acceptMessages
                      ? 'text-green-500'
                      : 'text-gray-500'
                  }
                />
              </div>

              <div>
                <h2 className="font-semibold">
                  Accept Anonymous Messages
                </h2>

                <p
                  className={`text-sm mt-1 ${
                    isDark
                      ? 'text-gray-500'
                      : 'text-slate-500'
                  }`}
                >
                  {acceptMessages
                    ? 'People can currently send you messages.'
                    : 'Your profile is not accepting messages.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">

              <span
                className={`text-sm font-bold ${
                  acceptMessages
                    ? 'text-green-500'
                    : 'text-gray-500'
                }`}
              >
                {acceptMessages ? 'ON' : 'OFF'}
              </span>

              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
            </div>
          </div>
        </section>

        <Separator
          className={
            isDark
              ? 'bg-white/10 mb-7'
              : 'bg-slate-200 mb-7'
          }
        />

        {/* MESSAGE HEADER */}
        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-2xl font-bold">
              Your Messages
            </h2>

            <p
              className={`text-sm mt-1 ${
                isDark
                  ? 'text-gray-500'
                  : 'text-slate-500'
              }`}
            >
              Anonymous messages sent to you
            </p>
          </div>

          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={isLoading}
            className={`rounded-xl ${
              isDark
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}

            <span className="ml-2">
              Refresh
            </span>
          </Button>
        </div>

        {/* MESSAGES */}
        {isLoading && messages.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`h-36 rounded-2xl animate-pulse ${
                  isDark
                    ? 'bg-white/5'
                    : 'bg-slate-200'
                }`}
              />
            ))}

          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {messages.map((message, index) => (
              <div
                key={message._id}
                className="transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                  cardIndex={index}
                  isDark={isDark}
                />
              </div>
            ))}

          </div>
        ) : (
          <div
            className={`rounded-3xl border border-dashed p-12 text-center ${
              isDark
                ? 'border-white/10 bg-white/[0.03]'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5">
              <MessageCircle className="h-8 w-8 text-purple-500" />
            </div>

            <h3 className="text-xl font-semibold">
              No messages yet
            </h3>

            <p
              className={`mt-2 ${
                isDark
                  ? 'text-gray-500'
                  : 'text-slate-500'
              }`}
            >
              Share your profile link with your friends and
              start receiving anonymous messages.
            </p>

            <Button
              onClick={copyToClipboard}
              className="mt-6 rounded-xl bg-purple-600 hover:bg-purple-500"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Profile Link
            </Button>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center mt-12 pb-6">
          <p
            className={`text-xs ${
              isDark
                ? 'text-gray-600'
                : 'text-slate-400'
            }`}
          >
            🔒 True Feedback • Your identity stays private
          </p>
        </div>
      </div>
    </main>
  );
}

export default UserDashboard;