'use client';

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';

import { X, MessageCircle } from 'lucide-react';

import { Message } from '../model/user';

import {
  Card,
  CardContent,
} from '../components/ui/card';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

import { Button } from './ui/button';
import { useToast } from '../components/ui/use-toast';
import { ApiResponse } from '../types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  cardIndex?: number;
  isDark?: boolean;
};

const cardStyles = [
  {
    dark: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
    light: 'from-purple-50 to-white border-purple-200',
    icon: 'bg-purple-500/15 text-purple-500',
  },
  {
    dark: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
    light: 'from-blue-50 to-white border-blue-200',
    icon: 'bg-blue-500/15 text-blue-500',
  },
  {
    dark: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    light: 'from-emerald-50 to-white border-emerald-200',
    icon: 'bg-emerald-500/15 text-emerald-500',
  },
  {
    dark: 'from-orange-500/20 to-orange-500/5 border-orange-500/20',
    light: 'from-orange-50 to-white border-orange-200',
    icon: 'bg-orange-500/15 text-orange-500',
  },
];

export function MessageCard({
  message,
  onMessageDelete,
  cardIndex = 0,
  isDark = true,
}: MessageCardProps) {
  const { toast } = useToast();

  const style = cardStyles[cardIndex % cardStyles.length];

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      toast({
        title: 'Message deleted',
        description: response.data.message,
      });

      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card
      className={`
        relative overflow-hidden rounded-2xl
        border
        bg-gradient-to-br
        transition-all duration-300
        hover:shadow-xl
        ${
          isDark
            ? `${style.dark} text-white`
            : `${style.light} text-slate-900`
        }
      `}
    >
      {/* Accent line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          cardIndex % 4 === 0
            ? 'bg-purple-500'
            : cardIndex % 4 === 1
              ? 'bg-blue-500'
              : cardIndex % 4 === 2
                ? 'bg-emerald-500'
                : 'bg-orange-500'
        }`}
      />

      <CardContent className="p-6">

        <div className="flex items-start gap-4">

          {/* Icon */}
          <div
            className={`flex-shrink-0 h-11 w-11 rounded-full flex items-center justify-center ${style.icon}`}
          >
            <MessageCircle className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-8">

            <p
              className={`text-lg md:text-xl font-semibold leading-tight break-words ${
                isDark
                  ? 'text-white'
                  : 'text-slate-900'
              }`}
            >
              {message.content}
            </p>

            <p
              className={`mt-3 text-sm ${
                isDark
                  ? 'text-gray-400'
                  : 'text-slate-500'
              }`}
            >
              {dayjs(message.createdAt).format(
                'MMM D, YYYY h:mm A'
              )}
            </p>
          </div>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="absolute top-5 right-5 h-9 w-9 p-0 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this message?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. The anonymous
                  message will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </CardContent>
    </Card>
  );
}