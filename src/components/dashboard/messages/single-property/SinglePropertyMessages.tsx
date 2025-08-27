import { pbMessagesCollection, pbMessagesCollectionFilter, pbMessagesCollectionSelect, singlePropertyMessagesCollection } from "@/data-access-layer/messages/single-property-messages";
import { useLiveQuery } from "@tanstack/react-db";
import { useMemo,useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

interface SinglePropertyMessagesProps {
  propertyId: string;
}

export default function SinglePropertyMessages({ propertyId }: SinglePropertyMessagesProps) {

  const sourceParams = useMemo(() => ({ propertyId }), [propertyId]);
  const propertyMessagesCollection = singlePropertyMessagesCollection(sourceParams);
  const { data: liveMessages } = useLiveQuery((q) =>
    q.from({
      messages: propertyMessagesCollection,
    })
  );

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
          filter: pbMessagesCollectionFilter(propertyId),
          select: pbMessagesCollectionSelect,
        }
      );

      return () => {
        // @ts-expect-error TODO fix this in typed pocketbase
        pbMessagesCollection.unsubscribe();
      };
    }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ul className="w-full flex flex-col gap-">
        {liveMessages?.toReversed().map((message) => (
          <div
            data-admin={!!message?.admin_id}
            className="chat chat-end data-[admin=true]:chat-start"
            key={message.id}>
            <div className="chat-header">
              <time className="text-xs opacity-50">
                {formatDistanceToNow(new Date(message?.created), { addSuffix: true })}
              </time>
            </div>
            <div data-admin={!!message?.admin_id} 
            className="chat-bubble bg-primary/30 p-4 data-[admin=true]:bg-accent/30">
              {message?.body}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
