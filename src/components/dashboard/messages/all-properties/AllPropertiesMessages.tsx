"use client";
import { fetchParentMessages } from "@/data-access-layer/actions/message-actions";
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
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeyPrefixes.property_messages] as const,
    queryFn: async () => {
      const result = await fetchParentMessages();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <AllPropertiesMessagesLoading />;
  }

  if (error) {
    return <PropertyMessagesError />;
  }

  const messages = data ?? [];

  if (!messages || messages.length === 0) {
    return <NoPropertyMessages />;
  }

  return (
    <div className="w-full h-full space-y-4">
      <div className="grid gap-4">
        {messages.map((msg) => {
          const property = msg.expand?.property_id;
          if (!property) return null;
          return (
            <Link href={`/dashboard/messages/${msg.id}`} key={msg.id}>
              <PropertyMessageCard
                key={msg.id}
                message={msg}
                onViewMessages={() => onViewPropertyMessages?.(property.id)}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
