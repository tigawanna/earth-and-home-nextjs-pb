"use client";
import dynamic from "next/dynamic";

export const LazyAllPropertiesMessages = dynamic(
  () => import("@/components/dashboard/messages/AllPropertiesMessages"),
  {
    ssr: false,
    loading: () => <p>Loading property messages...</p>,
  }
);
