import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useMemo, useRef, useState } from "react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (messageParent) {
      // propertyMessagesCollection.utils.writeInsert(messageParent);
      propertyMessagesCollection.utils.writeUpsert(messageParent);
    }
  }, [messageParent.id]);

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
    const messageType = mostPreviousMessage?.type === "parent" ? "reply" : "parent";
    const messagePayload = {
      body: newMessage,
      property_id: propertyId,
      parent: parentId,
      user_id: user.is_admin ? messageParent.user_id : user.id,
      admin_id: user.is_admin ? user.id : undefined,
      type: messageType,
    } satisfies PropertyMessagesCreate;

    propertyMessagesCollection.insert(addLocalfirstPocketbaseMetadata(messagePayload) as any);

    setNewMessage("");

    // Scroll to bottom when user sends a message
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ul className="w-full flex flex-col gap-2 max-h-[80vh] overflow-y-auto mb-4 px-2">
        {liveMessages?.toReversed().map((message) => (
          <div
            key={message.id}
            data-admin={!!message?.admin_id}
            className="chat chat-end data-[admin=true]:chat-start">
            <div className="chat-header">
              <time className="text-xs opacity-50">
                {formatDistanceToNow(new Date(message?.created), { addSuffix: true })}
              </time>
            </div>
            <div
              data-admin={!!message?.admin_id}
              className="chat-bubble bg-primary/30 p-4 data-[admin=true]:bg-accent/30">
              {message?.body}
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
