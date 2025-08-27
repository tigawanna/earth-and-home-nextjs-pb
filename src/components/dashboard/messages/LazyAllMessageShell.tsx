"use client";
import dynamic from "next/dynamic";

export const AllPropertyMessagesShell = dynamic(() => import("@/components/dashboard/messages/AllPropertiesMessages"), {
  ssr: false,
  loading: () => <p>Loading property messages...</p>,
});
