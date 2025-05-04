
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content?: string;
  loading?: boolean;
}

export function ChatMessage({ role, content, loading = false }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        role === 'user'
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
      {loading ? (
        <div className="flex h-5 items-center">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span className="ml-2">L'assistant est en train d'écrire...</span>
        </div>
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
}
