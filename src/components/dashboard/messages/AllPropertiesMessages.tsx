"use client";
import {
    getPropertyMessageSummaries,
    pbMessagesCollection,
    pbMessagesCollectionFilter,
    pbMessagesCollectionSelect,
    propertyMessagesCollection,
    PropertyMessageSummary,
} from "@/data-access-layer/messages/messages-collection";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { useLiveQuery } from "@tanstack/react-db";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
    AllPropertiesMessagesLoading,
    NoPropertyMessages,
    PropertyMessageCard
} from "./query-states";

interface AllPropertiesMessagesProps {
  onViewPropertyMessages?: (propertyId: string) => void;
}

export default function AllPropertiesMessages({ onViewPropertyMessages }: AllPropertiesMessagesProps) {
  // Use TanStack Query for better caching and state management
  const { data: messageSummaries, isLoading, error } = useQuery({
    queryKey: [queryKeyPrefixes.property_messages, "summaries"] as const,
    queryFn: getPropertyMessageSummaries,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Real-time updates using TanStack DB
  const { data: liveMessages } = useLiveQuery((q) =>
    q.from({ messages: propertyMessagesCollection })
  );

  useEffect(() => {
    const unsubscribe = pbMessagesCollection.subscribe(
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
        filter: pbMessagesCollectionFilter,
        select: pbMessagesCollectionSelect,
      }
    );

    return () => {
      // @ts-expect-error TODO fix this in typed pocketbase
      pbMessagesCollection.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <AllPropertiesMessagesLoading />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-destructive">Error Loading Messages</h3>
          <p className="text-sm text-muted-foreground">
            Failed to load property messages. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!messageSummaries || messageSummaries.length === 0) {
    return <NoPropertyMessages />;
  }

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Property Messages</h2>
        <span className="text-sm text-muted-foreground">
          {messageSummaries.length} {messageSummaries.length === 1 ? "conversation" : "conversations"}
        </span>
      </div>
      
      <div className="grid gap-4">
        {messageSummaries.map((summary: PropertyMessageSummary) => (
          <PropertyMessageCard
            key={summary.property.id}
            property={summary.property}
            latestMessage={summary.latestMessage}
            messageCount={summary.messageCount}
            onViewMessages={() => onViewPropertyMessages?.(summary.property.id)}
          />
        ))}
      </div>
    </div>
  );
}
