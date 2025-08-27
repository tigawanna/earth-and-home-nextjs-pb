"use client";
import {
    getPropertyMessageSummaries,
    PropertyMessageSummary
} from "@/data-access-layer/messages/messages-collection";
import { queryKeyPrefixes } from "@/lib/tanstack/query/get-query-client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PropertyMessageCard } from "./cards";
import { PropertyMessagesError } from "./query-states/error-states";
import { AllPropertiesMessagesLoading, NoPropertyMessages } from "./query-states/loading-states";

interface AllPropertiesMessagesProps {
  onViewPropertyMessages?: (propertyId: string) => void;
}

export default function AllPropertiesMessages({
  onViewPropertyMessages,
}: AllPropertiesMessagesProps) {
  // Use TanStack Query for better caching and state management
  const {
    data: messageSummaries,
    isLoading,
    error,
  } = useQuery({
    queryKey: [queryKeyPrefixes.property_messages, "summaries"] as const,
    queryFn: getPropertyMessageSummaries,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Real-time updates using TanStack DB
//   const { data: liveMessages } = useLiveQuery((q) =>
//     q.from({ messages: propertyMessagesCollection })
//   );

//   useEffect(() => {
//     pbMessagesCollection.subscribe(
//       "*",
//       function (e) {
//         if (e.action === "create") {
//           propertyMessagesCollection.utils.writeInsert(e.record);
//         }
//         if (e.action === "delete") {
//           propertyMessagesCollection.utils.writeDelete(e.record.id);
//         }
//         if (e.action === "update") {
//           propertyMessagesCollection.utils.writeUpdate(e.record);
//         }
//       },
//       {
//         filter: pbMessagesCollectionFilter,
//         select: pbMessagesCollectionSelect,
//       }
//     );

//     return () => {
//       // @ts-expect-error TODO fix this in typed pocketbase
//       pbMessagesCollection.unsubscribe();
//     };
//   }, []);

  if (isLoading) {
    return <AllPropertiesMessagesLoading />;
  }

  if (error) {
    return <PropertyMessagesError />;
  }

  if (!messageSummaries || messageSummaries.length === 0) {
    return <NoPropertyMessages />;
  }

  return (
    <div className="w-full h-full space-y-4">
      <div className="grid gap-4">
        {messageSummaries.map((summary: PropertyMessageSummary) => (
          <Link href={`/dashboard/messages/${summary.property.id}`} key={summary.property.id}>
            <PropertyMessageCard
              key={summary.property.id}
              property={summary.property}
              latestMessage={summary.latestMessage}
              messageCount={summary.messageCount}
              onViewMessages={() => onViewPropertyMessages?.(summary.property.id)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
