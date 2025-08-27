"use client";
import dynamic from "next/dynamic";


// Keep the old component for backward compatibility
export const LazyAllPropertiesMessages = dynamic(
  () => import("@/components/dashboard/messages/all-properties/AllPropertiesMessages"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading property messages...</p>
      </div>
    ),
  }
);
