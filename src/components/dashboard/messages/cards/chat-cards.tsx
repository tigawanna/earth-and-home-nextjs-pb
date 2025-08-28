import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageWithProperty } from "@/data-access-layer/messages/properties-messages-collection";
import {
  PropertiesResponse,
  PropertyMessagesResponse,
  UsersResponse,
} from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Clock, Home, MessageCircle, User } from "lucide-react";
import Image from "next/image";


// ====================================================
// CHAT-STYLE MESSAGE CARDS
// ====================================================

interface ChatMessageProps {
  message: PropertyMessagesResponse & {
    expand?: {
      user_id?: UsersResponse;
    };
  };
  currentUserId?: string;
}

export function ChatMessage({ message, currentUserId }: ChatMessageProps) {
  const isCurrentUser = message.user_id === currentUserId;
  const user = message.expand?.user_id;

  return (
    <div className={cn("flex gap-3 mb-4", isCurrentUser && "justify-end")}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[70%] space-y-1", isCurrentUser && "order-first")}>
        {!isCurrentUser && (
          <div className="text-sm font-medium text-muted-foreground">
            {user?.name || "Anonymous User"}
          </div>
        )}

        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isCurrentUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
          )}>
          {message.body}
        </div>

        <div
          className={cn(
            "text-xs text-muted-foreground flex items-center gap-1",
            isCurrentUser && "justify-end"
          )}>
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(message.created), { addSuffix: true })}
        </div>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// ====================================================
// CONVERSATION THREAD
// ====================================================

interface ConversationThreadProps {
  messages: (PropertyMessagesResponse & {
    expand?: {
      user_id?: UsersResponse;
    };
  })[];
  currentUserId?: string;
  property?: PropertiesResponse;
}

export function ConversationThread({ messages, currentUserId, property }: ConversationThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No Messages Yet</h3>
          <p className="text-muted-foreground max-w-md">
            No messages for {property?.title || "this property"} yet. Messages from interested users
            will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {property && (
        <div className="pb-4 mb-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Home className="w-4 h-4" />
            {property.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {property.city}, {property.state}
          </p>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
