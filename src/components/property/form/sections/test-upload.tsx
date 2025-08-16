"use client"; // For Next.js

import { useUploadFile } from "better-upload/client";
import { UploadButton } from "@/components/ui/upload-button";

export function Uploader() {
  const { control } = useUploadFile({
    route: "propertyImages",
  });

  return <UploadButton control={control} accept="image/*" />;
}
