"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import type { DirectMessageResponse } from "@/types/domain-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";

interface DirectMessageThreadProps {
  conversationId: string;
  currentUserId: string;
}

interface ThreadApiResponse {
  success: boolean;
  result: DirectMessageResponse[];
}

export function DirectMessageThread({ conversationId, currentUserId }: DirectMessageThreadProps) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeyPrefixes.direct_messages, "thread", conversationId] as const,
    queryFn: async (): Promise<ThreadApiResponse> => {
      const res = await fetch(`/api/direct-messages/${encodeURIComponent(conversationId)}`);
      if (!res.ok) {
        throw new Error("Failed to load messages");
      }
      return (await res.json()) as ThreadApiResponse;
    },
    refetchInterval: 5000,
  });

  const messages = data?.result ?? [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const sendMutation = useMutation({
    mutationFn: async (body: string) => {
      const res = await fetch("/api/direct-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId, body }),
      });
      if (!res.ok) {
        throw new Error("Failed to send");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyPrefixes.direct_messages, "thread", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: [queryKeyPrefixes.direct_messages, "list"] });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) {
      return;
    }
    sendMutation.mutate(text);
    setDraft("");
    setTimeout(scrollToBottom, 100);
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12 text-muted-foreground">
        Loading messages…
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col flex-1 min-h-0">
      <ul className="w-full flex flex-col gap-2 max-h-[70vh] overflow-y-auto mb-4 px-2 flex-1">
        {messages.map((message) => {
          const mine = message.sender_user_id === currentUserId;
          return (
            <div
              key={message.id}
              data-mine={mine}
              className="chat chat-start data-[mine=true]:chat-end"
            >
              <div className="chat-header">
                <time className="text-xs opacity-50">
                  {formatDistanceToNow(new Date(message.created), { addSuffix: true })}
                </time>
              </div>
              <div
                data-mine={mine}
                className="chat-bubble bg-muted p-4 data-[mine=true]:bg-primary/30"
              >
                {message.body}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ul>

      <form onSubmit={onSubmit} className="w-full mt-auto flex gap-2 border-t pt-4">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message…"
          className="flex-1"
        />
        <Button type="submit" disabled={!draft.trim() || sendMutation.isPending}>
          Send
        </Button>
      </form>
    </div>
  );
}
