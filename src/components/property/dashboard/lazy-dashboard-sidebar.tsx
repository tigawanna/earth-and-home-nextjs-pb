"use client";
import dynamic from "next/dynamic";

export const LazyDashboardSidebar = dynamic(() => import("./dashboard-sidebar"), {
  ssr: false,
});


