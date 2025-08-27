"use client";
import {
  pbMessagesCollection,
  pbMessagesCollectionFilter,
  pbMessagesCollectionSelect,
  propertiesMessageCollection,
} from "@/data-access-layer/messages/messages-collection";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { useLiveQuery } from "@tanstack/react-db";
import { useEffect } from "react";

interface AllPropertiesMessagesProps {}

export default function AllPropertiesMessages({}: AllPropertiesMessagesProps) {
  const { data: messages, isLoading } = useLiveQuery((q) =>
    q.from({ messages: propertiesMessageCollection })
  );
  useEffect(() => {
    pbMessagesCollection.subscribe(
      "*",
      function (e) {
        if (e.action === "create") {
          propertiesMessageCollection.utils.writeInsert(e.record);
        }
        if (e.action === "delete") {
          propertiesMessageCollection.utils.writeDelete(e.record.id);
        }
        if (e.action === "update") {
          propertiesMessageCollection.utils.writeUpdate(e.record);
        }
      },
      {
        /* other options like: filter, expand, custom headers, etc. */
        filter: pbMessagesCollectionFilter,
        select: pbMessagesCollectionSelect,
      }
    );
    return () => {
      // @ts-expect-error TODO fix this in typed pocketbase
      messagesCollection.unsubscribe();
    };
  }, []);

  if (!messages.length) {
    return <p>No interactions found.</p>;
  }
  return (
    <div className="w-full h-full gap-2 flex flex-col items-center justify-center">
      {messages.map((msg) => (
        <div key={msg.id} className="p-2 bg-muted border-b w-full">
          <div>{msg.expand?.property_id?.title}</div>
        </div>
      ))}
    </div>
  );
}
