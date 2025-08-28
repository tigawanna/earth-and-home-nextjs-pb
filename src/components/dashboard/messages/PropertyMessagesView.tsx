"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  createPropertyMessage,
  getPropertyMessages
} from "@/data-access-layer/messages/properties-messages-collection";
import { useLocalViewer } from "@/data-access-layer/user/auth";
import { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ConversationThread } from "./cards/chat-cards";
import { PropertyMessagesLoading } from "./query-states/loading-states";

interface PropertyMessagesViewProps {
  propertyId: string;
  property?: PropertiesResponse;
  onBack?: () => void;
}

export  function PropertyMessagesView({
  propertyId,
  property,
  onBack,
}: PropertyMessagesViewProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: viewerData } = useLocalViewer();
  const currentUser = viewerData?.viewer;

  // Fetch messages for this property
  const {
    data: messages,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["property_messages", propertyId],
    queryFn: () => getPropertyMessages(propertyId),
    refetchInterval: 10000, // Refetch every 10 seconds for real-time feel
  });

  // Real-time message updates
  // useEffect(() => {
  //   const filter = pbMessagesCollection.createFilter(pBeq("property_id", propertyId));

  //   const unsubscribe = pbMessagesCollection.subscribe(
  //     "*",
  //     function (e) {
  //       if (e.action === "create" || e.action === "update") {
  //         refetch(); // Refetch when new messages arrive
  //       }
  //     },
  //     {
  //       filter,
  //       select: pbMessagesCollectionSelect,
  //     }
  //   );

  //   return () => {
  //     // @ts-expect-error TODO fix this in typed pocketbase
  //     pbMessagesCollection.unsubscribe();
  //   };
  // }, [propertyId, refetch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const message = await createPropertyMessage({
        property_id: propertyId,
        user_id: currentUser.id,
        body: newMessage.trim(),
        type: "parent", // For now, all messages are parent messages
      });

      if (message) {
        setNewMessage("");
        refetch(); // Refresh the message list
        toast.success("Message sent successfully");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return <PropertyMessagesLoading />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className="rounded-b-none border-b-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1">
                {property?.title || "Property Messages"}
              </CardTitle>
              {property && (
                <p className="text-sm text-muted-foreground">
                  {property.city}, {property.state}
                </p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {messages?.length || 0} {messages?.length === 1 ? "message" : "messages"}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 rounded-t-none rounded-b-none border-t-0 border-b-0 overflow-hidden">
        <CardContent className="h-full overflow-y-auto p-4">
          <ConversationThread
            messages={messages || []}
            currentUserId={currentUser?.id}
            property={property}
          />
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      {/* Message Input */}
      {currentUser && (
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                disabled={isSubmitting}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSubmitting}
                size="icon"
                className="self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
