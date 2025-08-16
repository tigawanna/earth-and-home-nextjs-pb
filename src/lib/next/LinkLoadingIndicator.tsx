"use client";

import { Loader } from "lucide-react";
import { useLinkStatus } from "next/link";

export default function LinkLoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? <Loader className="animate-spin mr-2 h-4 w-4" /> : null;
}
