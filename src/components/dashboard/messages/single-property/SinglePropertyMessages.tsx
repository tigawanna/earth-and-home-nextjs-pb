import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  pbMessagesCollection,
  pbMessagesCollectionFilter,
  pbMessagesCollectionSelect,
  singlePropertyMessagesCollection,
} from "@/data-access-layer/messages/single-property-messages";
import {
  PropertyMessagesCreate,
  PropertyMessagesResponse,
  UsersResponse,
} from "@/lib/pocketbase/types/pb-types";
import { addLocalfirstPocketbaseMetadata } from "@/lib/pocketbase/utils/local-first";
import { useLiveQuery } from "@tanstack/react-db";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  const [newMessage, setNewMessage] = useState("");
  const [lastReadTimestamp, setLastReadTimestamp] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLUListElement>(null);

  // Local storage key for tracking last read message
  const lastReadKey = `last-read-message-${parentId}-${user.id}`;

  // Load last read timestamp from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(lastReadKey);
    setLastReadTimestamp(stored);
  }, [lastReadKey]);

  const sourceParams = useMemo(() => ({ parentId }), [parentId]);
  const propertyMessagesCollection = singlePropertyMessagesCollection(sourceParams);
  const { data: liveMessages } = useLiveQuery((q) =>
    q
      .from({
        messages: propertyMessagesCollection,
      })
      .orderBy(({ messages }) => messages.created, "desc")
  );

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mark messages as read when user scrolls or interacts
  const markAsRead = useCallback(() => {
    if (liveMessages && liveMessages.length > 0) {
      const latestMessage = liveMessages[0]; // Since messages are ordered desc
      const timestamp = latestMessage.created;
      localStorage.setItem(lastReadKey, timestamp);
      setLastReadTimestamp(timestamp);
    }
  }, [liveMessages, lastReadKey]);

  // Handle scroll to mark messages as read when user scrolls near bottom
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // Within 100px of bottom

    if (isNearBottom) {
      markAsRead();
    }
  }, [markAsRead]);

  // Determine which messages are unread
  const getUnreadMessages = useMemo(() => {
    if (!liveMessages || !lastReadTimestamp) return new Set<string>();
    
    const unreadIds = new Set<string>();
    const lastReadDate = new Date(lastReadTimestamp);
    
    liveMessages.forEach(message => {
      const messageDate = new Date(message.created);
      if (messageDate > lastReadDate) {
        unreadIds.add(message.id);
      }
    });
    
    return unreadIds;
  }, [liveMessages, lastReadTimestamp]);

  // Find the index where to show the unread divider
  const unreadDividerIndex = useMemo(() => {
    if (!liveMessages || !lastReadTimestamp || getUnreadMessages.size === 0) return -1;
    
    const reversedMessages = liveMessages.toReversed();
    const lastReadDate = new Date(lastReadTimestamp);
    
    for (let i = 0; i < reversedMessages.length; i++) {
      const messageDate = new Date(reversedMessages[i].created);
      if (messageDate > lastReadDate) {
        return i; // First unread message index
      }
    }
    
    return -1;
  }, [liveMessages, lastReadTimestamp, getUnreadMessages]);

  // Attach scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (liveMessages && liveMessages.length > 0) {
      scrollToBottom();
    }
  }, [liveMessages?.length]);

  useEffect(() => {
    pbMessagesCollection.subscribe(
      "*",
      function (e) {
        if (e.action === "create") {
          propertyMessagesCollection.utils.writeInsert(e.record);
        }
        if (e.action === "delete") {
          propertyMessagesCollection.utils.writeDelete(e.record.id);
        }
        if (e.action === "update") {
          propertyMessagesCollection.utils.writeUpdate(e.record);
        }
      },
      {
        filter: pbMessagesCollectionFilter(parentId),
        select: pbMessagesCollectionSelect,
      }
    );

    return () => {
      // @ts-expect-error TODO fix this in typed pocketbase
      pbMessagesCollection.unsubscribe();
    };
  }, []);
  const mostPreviousMessage = liveMessages?.[liveMessages.length - 1];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = mostPreviousMessage
      ? mostPreviousMessage.parent || mostPreviousMessage.id
      : undefined;
    const messagePayload = {
      body: newMessage,
      property_id: propertyId,
      parent: parentId,
      user_id: user.is_admin ? messageParent.user_id : user.id,
      admin_id: user.is_admin ? user.id : undefined,
      type: mostPreviousMessage?.type === "reply" ? "reply" : "parent",
    } satisfies PropertyMessagesCreate;

    propertyMessagesCollection.insert(addLocalfirstPocketbaseMetadata(messagePayload) as any);

    setNewMessage("");

    // Mark as read when user sends a message
    setTimeout(() => {
      markAsRead();
      scrollToBottom();
    }, 100);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ul
        ref={messagesContainerRef}
        className="w-full flex flex-col gap-2 max-h-[80vh] overflow-y-auto mb-4 px-2">
        {liveMessages?.toReversed().map((message, index) => (
          <div key={message.id}>
            {/* Show unread divider before the first unread message */}
            {index === unreadDividerIndex && getUnreadMessages.size > 0 && (
              <div className="flex items-center justify-center my-4">
                <Separator className="flex-1" />
                <span className="px-3 text-xs text-muted-foreground bg-background">
                  {getUnreadMessages.size} new message{getUnreadMessages.size > 1 ? 's' : ''}
                </span>
                <Separator className="flex-1" />
              </div>
            )}
            
            <div
              data-admin={!!message?.admin_id}
              data-unread={getUnreadMessages.has(message.id)}
              className="chat chat-end data-[admin=true]:chat-start data-[unread=true]:opacity-100 data-[unread=false]:opacity-80">
              <div className="chat-header">
                <time className="text-xs opacity-50">
                  {formatDistanceToNow(new Date(message?.created), { addSuffix: true })}
                </time>
              </div>
              <div
                data-admin={!!message?.admin_id}
                data-unread={getUnreadMessages.has(message.id)}
                className="chat-bubble bg-primary/30 p-4 data-[admin=true]:bg-accent/30 data-[unread=true]:ring-1 data-[unread=true]:ring-primary/50">
                {message?.body}
              </div>
            </div>
          </div>
        ))}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </ul>

      <form onSubmit={handleSubmit} className="w-full mt-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
