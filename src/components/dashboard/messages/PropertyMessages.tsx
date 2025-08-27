"use client";
import dynamic from "next/dynamic";

export const PropertyMessages = dynamic(() => import("@/components/dashboard/messages/RealtimeMessages"), {
  ssr: false,
  loading: () => <p>Loading messages...</p>,
});
