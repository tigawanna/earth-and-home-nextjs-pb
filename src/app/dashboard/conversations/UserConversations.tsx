"use client";

import { useUserConversationsWithRealtime } from "@/hooks/use-realtime-queries";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";

interface UserConversationsProps {
  userId?: string;
}

export function UserConversations({ userId }: UserConversationsProps) {
  // Get current user if no userId provided
  const currentUserId = userId || browserPB.authStore.model?.id;
  
  const { data, isPending, isSubscribed, unsubscribe } = useUserConversationsWithRealtime(currentUserId);
  
  const messages = data?.items || [];
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Realtime status indicator */}
        <div className="mb-4 p-2 bg-muted rounded-lg flex items-center justify-between">
          <span className="text-sm">
            Realtime Status: 
            <span className={`ml-2 font-medium ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
              {isSubscribed ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </span>
          {isSubscribed && (
            <button
              onClick={unsubscribe}
              className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Messages list */}
        <ul className="w-full space-y-2">
          {isPending && <p className="text-muted-foreground">Loading conversations...</p>}
          {!isPending && messages.length === 0 && (
            <p className="text-muted-foreground">No conversations found.</p>
          )}
          {messages.map((message) => (
            <li key={message.id} className="p-4 border rounded-lg hover:bg-muted/50">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">
                    {message.expand?.property_id?.title || 'Unknown Property'}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {message.body}
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    From: {message.expand?.user_id?.name || message.expand?.user_id?.email || 'Unknown User'}
                  </span>
                  <span className="capitalize">
                    Type: {message.type}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
