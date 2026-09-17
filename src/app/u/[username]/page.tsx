'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Sparkles, Send, MessageCircle, Check } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/seperator';
import {
  CardHeader,
  CardContent,
  Card,
} from '../../../components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';

import { Textarea } from '../../../components/ui/textarea';
import { toast } from '../../../components/ui/use-toast';

import { ApiResponse } from '../../../types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { messageSchema } from '../../../schemas/messageSchema';
import * as z from 'zod';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString
    .split(specialChar)
    .map((message) => message.trim())
    .filter((message) => message.length > 0);
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isSending, setIsSending] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [suggestError, setSuggestError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
    setSelectedMessage(message);

    toast({
      title: 'Message selected ✨',
      description: 'You can edit it before sending.',
    });
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);

    try {
      const response = await axios.post<ApiResponse>(
        '/api/send-message',
        {
          ...data,
          username,
        }
      );

      toast({
        title: 'Message sent! 🎉',
        description: response.data.message,
      });

      form.reset({
        content: '',
      });

      setSelectedMessage('');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError('');
    setSuggestedMessages([]);

    try {
      const response = await axios.post<ApiResponse>(
        '/api/suggest-messages',
        {
          prompt:
            'Generate three friendly anonymous message suggestions.',
        }
      );

      console.log('Suggestion response:', response.data);

      if (!response.data.success) {
        setSuggestError(
          response.data.message ||
            'Failed to generate suggestions'
        );
        return;
      }

      const messages = parseStringMessages(
        response.data.message
      );

      if (messages.length === 0) {
        setSuggestError(
          'No suggestions were generated. Please try again.'
        );
        return;
      }

      setSuggestedMessages(messages);
    } catch (error) {
      console.error('Suggestion error:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      setSuggestError(
        axiosError.response?.data.message ??
          'Failed to generate suggestions'
      );
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />

        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative container mx-auto max-w-4xl px-4 py-10 md:py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-yellow-300" />

            <span className="text-sm text-gray-300">
              100% Anonymous
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Send a Message
          </h1>

          <p className="mt-4 text-gray-400 text-lg">
            Send something anonymously to
          </p>

          <div className="mt-2 text-2xl font-bold text-purple-300">
            @{username}
          </div>
        </div>

        {/* Message Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur opacity-20" />

          <Card className="relative bg-white/[0.07] backdrop-blur-xl border-white/10 rounded-3xl text-white shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/20">
                  <MessageCircle className="h-6 w-6 text-purple-300" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Write your message
                  </h2>

                  <p className="text-sm text-gray-400">
                    They won't know it's you
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Anonymous Message
                        </FormLabel>

                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Write something nice, funny, or interesting..."
                              className="min-h-[160px] resize-none rounded-2xl bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/30 transition-all duration-300 pr-4 pb-10"
                              {...field}
                              value={field.value ?? ''}
                              maxLength={300}
                            />

                            <span className="absolute bottom-3 right-4 text-xs text-gray-500">
                              {messageContent?.length ?? 0}/300
                            </span>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={
                      !messageContent?.trim() || isSending
                    }
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Anonymously
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions */}
        <section className="mt-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />

              <h2 className="text-2xl font-bold">
                Need Inspiration?
              </h2>
            </div>

            <p className="text-gray-400 mt-2">
              Let AI suggest something you can send
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              type="button"
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="h-12 px-6 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI is thinking...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-300" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </div>

          <Card className="bg-white/[0.05] backdrop-blur-xl border-white/10 rounded-3xl text-white">
            <CardContent className="p-5 md:p-7">

              {suggestError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
                  {suggestError}
                </div>
              )}

              {/* Loading */}
              {isSuggestLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-16 rounded-2xl bg-white/5 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {!isSuggestLoading &&
                suggestedMessages.length > 0 && (
                  <div className="space-y-4">
                    {suggestedMessages.map(
                      (message, index) => {
                        const isSelected =
                          selectedMessage === message;

                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              handleMessageClick(message)
                            }
                            className={`group w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                              isSelected
                                ? 'border-purple-400 bg-purple-500/20 scale-[1.02]'
                                : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-purple-400/50 hover:scale-[1.01]'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                {isSelected ? (
                                  <Check className="h-5 w-5 text-green-300" />
                                ) : (
                                  <MessageCircle className="h-5 w-5 text-purple-300" />
                                )}
                              </div>

                              <div className="flex-1">
                                <p className="text-gray-200 leading-relaxed">
                                  {message}
                                </p>

                                <p className="text-xs text-gray-500 mt-2 group-hover:text-purple-300 transition-colors">
                                  Click to use this message
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                )}

              {/* Empty State */}
              {!isSuggestLoading &&
                suggestedMessages.length === 0 &&
                !suggestError && (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-purple-300" />
                    </div>

                    <p className="text-gray-300 font-medium">
                      No suggestions yet
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                      Click the button above and let AI help you.
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </section>

        {/* Divider */}
        <Separator className="my-12 bg-white/10" />

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-block p-8 rounded-3xl bg-white/[0.05] border border-white/10 backdrop-blur-xl">
            <div className="text-2xl font-bold mb-2">
              Want your own message board?
            </div>

            <p className="text-gray-400 mb-6">
              Create your anonymous feedback page for free.
            </p>

            <Link href="/sign-up">
              <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 hover:scale-105">
                Create Your Account 🚀
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Your identity stays anonymous 🔒
        </p>
      </div>
    </main>
  );
}