"use client";
import {
  getPropertyMessageSummaries
} from "@/data-access-layer/messages/properties-messages-collection";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PropertyMessageCard } from "../cards/property-cards";
import { PropertyMessagesError } from "../query-states/error-states";
import { AllPropertiesMessagesLoading, NoPropertyMessages } from "../query-states/loading-states";

interface AllPropertiesMessagesProps {
  onViewPropertyMessages?: (propertyId: string) => void;
}

export default function AllPropertiesMessages({
  onViewPropertyMessages,
}: AllPropertiesMessagesProps) {
  // Use TanStack Query for better caching and state management
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeyPrefixes.property_messages, "summaries"] as const,
    queryFn: getPropertyMessageSummaries,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  if (isLoading) {
    return <AllPropertiesMessagesLoading />;
  }
  
  if (error) {
    return <PropertyMessagesError />;
  }

  const messages = data?.result?.items || [];

  if (!messages || messages.length === 0) {
    return <NoPropertyMessages />;
  }


  return (
    <div className="w-full h-full space-y-4">
      <div className="grid gap-4">
        {messages.map((msg) => {
          const property = msg.expand?.property_id;
          if(!property) return null;
          return(
          <Link href={`/dashboard/messages/${msg.id}`} key={msg.id}>
            <PropertyMessageCard
              key={msg.id}
              message={msg}
              onViewMessages={() => onViewPropertyMessages?.(property.id)}
            />
          </Link>
        )})}
      </div>
    </div>
  );
}
