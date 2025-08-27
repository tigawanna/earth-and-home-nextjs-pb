"use client";

import { messageCollection } from "@/data-access-layer/messages/messages-collection";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { createCollection, eq, liveQueryCollectionOptions } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { useEffect } from "react";

interface RealtimeMessagesProps {}

export default function RealtimeMessages({}: RealtimeMessagesProps) {
  const messagesCollection = browserPB.from("property_messages");

  const { data: messages } = useLiveQuery((q) => q.from({ todo: messageCollection }));
  useEffect(() => {
    messagesCollection.subscribe(
      "*",
      function (e) {
        if (e.action === "create") {
          messageCollection.utils.writeInsert(e.record);
        }
        if (e.action === "delete") {
          messageCollection.utils.writeDelete(e.record.id);
        }
        if (e.action === "update") {
          messageCollection.utils.writeUpdate(e.record);
        }
      },
      {
        /* other options like: filter, expand, custom headers, etc. */
      }
    );
    return () => {
      // @ts-expect-error TODO fix this in typed pocketbase
      messagesCollection.unsubscribe();
    };
  }, []);
  console.log("messages", messages);
  if (!messages.length) {
    return <p>No messages found.</p>;
  }
  return (
    <div className="w-full h-full gap-2 flex flex-col items-center justify-center">
      {messages.map((msg) => (
        <div key={msg.id} className="p-2 bg-muted border-b w-full">
          {msg.body}
        </div>
      ))}
    </div>
  );
}
