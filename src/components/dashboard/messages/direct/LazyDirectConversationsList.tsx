"use client";
import dynamic from "next/dynamic";

export const LazyDirectConversationsList = dynamic(
  () => import("@/components/dashboard/messages/direct/DirectConversationsList"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center py-6">
        <p className="text-muted-foreground">Loading direct messages…</p>
      </div>
    ),
  },
);
