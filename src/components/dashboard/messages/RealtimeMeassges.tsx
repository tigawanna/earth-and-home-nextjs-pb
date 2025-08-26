"use client";

import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { PropertyMessagesResponse } from "@/lib/pocketbase/types/pb-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface RealtimeMeassgesProps {}

const messagesCollection = browserPB.from("property_messages");
export function RealtimeMeassges({}: RealtimeMeassgesProps) {
  const [messages, setMessages] = useState<PropertyMessagesResponse[]>([]);
  const qc = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const result = await messagesCollection.getList(1, 50, {
        sort: "-created",
      });
      return result;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    messagesCollection.subscribe(
      "*",
      function (e) {
        e.action === "create" && setMessages((prev) => [e.record, ...prev]);
        e.action === "delete" &&
          setMessages((prev) => prev.filter((msg) => msg.id !== e.record.id));
        setMessages((prev) => prev.filter((msg) => msg.id !== e.record.id));
        if (e.action === "update") {
          setMessages((prev) => {
            const index = prev.findIndex((msg) => msg.id === e.record.id);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = e.record;
              return updated;
            }
            return prev;
          });
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
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">RealtimeMessages</div>
  );
}
