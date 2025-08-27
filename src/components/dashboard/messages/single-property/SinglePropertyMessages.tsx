import { singlePropertyMessagesCollection } from "@/data-access-layer/messages/single-property-messages";
import { useLiveQuery } from "@tanstack/react-db";
import { useMemo } from "react";

interface SinglePropertyMessagesProps {
  propertyId: string;
}

export default function SinglePropertyMessages({ propertyId }: SinglePropertyMessagesProps) {
  const sourceParams = useMemo(() => ({ propertyId }), [propertyId]);

  const { data: liveMessages } = useLiveQuery((q) =>
    q.from({
      messages: singlePropertyMessagesCollection(sourceParams),
    })
  );
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ul className="w-full">
        {liveMessages?.map((message) => (
          <li key={message.id}>{message.body}</li>
        ))}
      </ul>
    </div>
  );
}
