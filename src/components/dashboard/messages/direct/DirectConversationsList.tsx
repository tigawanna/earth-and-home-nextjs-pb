"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDirectConversations } from "@/data-access-layer/actions/message-actions";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import type { DirectConversationListItem } from "@/types/domain-types";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function DirectConversationsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeyPrefixes.direct_messages, "list"] as const,
    queryFn: async () => {
      const result = await fetchDirectConversations();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-8 text-muted-foreground">
        Loading direct messages…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Could not load direct conversations.
      </div>
    );
  }

  const items = data ?? [];
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <MessageCircle className="mx-auto h-10 w-10 opacity-50 mb-2" />
        <p>No direct conversations yet. Message an agent from the Agents directory.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map(({ conversation, other_user, last_message }) => (
        <Link key={conversation.id} href={`/dashboard/messages/direct/${conversation.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={other_user.avatar} alt={other_user.name} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg truncate">{other_user.name}</CardTitle>
                  <CardDescription className="truncate">{other_user.email}</CardDescription>
                </div>
                {last_message && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(last_message.created), { addSuffix: true })}
                  </span>
                )}
              </div>
            </CardHeader>
            {last_message && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">{last_message.body}</p>
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}
