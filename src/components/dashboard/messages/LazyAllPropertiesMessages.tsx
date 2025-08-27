"use client";
import dynamic from "next/dynamic";

export const LazyMessagesManager = dynamic(
  () => import("@/components/dashboard/messages/MessagesManager"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading messages...</p>
      </div>
    ),
  }
);

// Keep the old component for backward compatibility
export const LazyAllPropertiesMessages = dynamic(
  () => import("@/components/dashboard/messages/AllPropertiesMessages"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading property messages...</p>
      </div>
    ),
  }
);
