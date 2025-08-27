"use client";
import { PropertyMessagesLoading } from "@/components/dashboard/messages/query-states/loading-states";
import dynamic from "next/dynamic";

export const LazySinglePropertyMessagesShell = dynamic(
  () => import("@/components/dashboard/messages/single-property/SinglePropertyMessages"),
  {
    ssr: false,
    loading: () => <PropertyMessagesLoading />,
  }
);
