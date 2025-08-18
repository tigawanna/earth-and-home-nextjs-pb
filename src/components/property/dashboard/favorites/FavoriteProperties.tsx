"use client";
import { browserPB } from "@/lib/pocketbase/browser-client";
import { FavoritePropertiesList } from "./FavoritePropertiesList";
import { useRouter } from "next/navigation";

interface FavoritePropertiesProps {}

export function FavoriteProperties({}: FavoritePropertiesProps) {
  const router = useRouter();
  const user = browserPB.authStore.record;

  if (!user) {
    router.push("/auth/signin");
    return null; // Prevent rendering if user is not authenticated
  }

  return (
    <div className="space-y-6">
      <FavoritePropertiesList />
    </div>
  );
}
