"use client";
import dynamic from "next/dynamic";
import { PropertyMessageCardSkeleton } from "@/components/dashboard/messages/query-states/loading-states";

export const LazySinglePropertyMessagesShell = dynamic(
  () => import("@/components/dashboard/messages/single-property/SinglePropertyMessages"),
  {
    ssr: false,
    loading: () => <PropertyMessageCardSkeleton />,
  }
);
