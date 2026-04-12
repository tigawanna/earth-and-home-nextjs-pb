"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPropertyMessage,
  fetchMessageReplies,
} from "@/data-access-layer/actions/message-actions";
import {
  PropertyMessagesCreate,
  PropertyMessagesResponse,
  UsersResponse,
} from "@/types/domain-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";

interface SinglePropertyMessagesProps {
  propertyId: string;
  user: UsersResponse;
  messageParent: PropertyMessagesResponse;
}

export default function SinglePropertyMessages({
  propertyId,
  user,
  messageParent,
}: SinglePropertyMessagesProps) {
  const parentId = messageParent.id;
  const queryClient = useQueryClient();

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["property_messages", parentId],
    queryFn: async () => {
      const result = await fetchMessageReplies(parentId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    refetchInterval: 5000,
  });

  const allMessages: PropertyMessagesResponse[] = [
    messageParent,
    ...(data ?? []),
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (allMessages.length > 0) {
      scrollToBottom();
    }
  }, [allMessages.length]);

  const sendMessageMutation = useMutation({
    mutationFn: async (payload: PropertyMessagesCreate) => {
      const result = await createPropertyMessage(payload);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property_messages", parentId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lastMessage = allMessages[allMessages.length - 1];
    const replyParentId = lastMessage
      ? lastMessage.parent || lastMessage.id
      : undefined;
    const messageType = lastMessage?.type === "parent" ? "reply" : "parent";

    const messagePayload: PropertyMessagesCreate = {
      id: crypto.randomUUID(),
      body: newMessage,
      property_id: propertyId,
      parent: replyParentId,
      user_id: user.is_admin ? messageParent.user_id : user.id,
      admin_id: user.is_admin ? user.id : undefined,
      type: messageType,
    };

    sendMessageMutation.mutate(messagePayload);
    setNewMessage("");

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ul className="w-full flex flex-col gap-2 max-h-[80vh] overflow-y-auto mb-4 px-2">
        {allMessages.map((message) => (
          <div
            key={message.id}
            data-admin={!!message?.admin_id}
            className="chat chat-end data-[admin=true]:chat-start"
          >
            <div className="chat-header">
              <time className="text-xs opacity-50">
                {formatDistanceToNow(new Date(message?.created), { addSuffix: true })}
              </time>
            </div>
            <div
              data-admin={!!message?.admin_id}
              className="chat-bubble bg-primary/30 p-4 data-[admin=true]:bg-accent/30"
            >
              {message?.body}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ul>

      <form onSubmit={handleSubmit} className="w-full mt-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim() || sendMessageMutation.isPending}>
          Send
        </Button>
      </form>
    </div>
  );
}
