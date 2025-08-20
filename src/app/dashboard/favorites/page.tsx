"use client";
import { FavoriteProperties } from "@/components/property/dashboard/favorites/FavoriteProperties";
import { Input } from "@/components/ui/input";
import { browserPB } from "@/lib/pocketbase/browser-client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default function FavoritesPage({}: {}) {
  const router = useRouter();
  const user = browserPB.authStore.record;
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    q: parseAsString.withDefault(""),
  });

  if (!user) {
    router.push("/auth/signin");
    return null; // Prevent rendering if user is not authenticated
  }

  return (
    <div className="space-y-6">
      <div className="relative flex gap-2 justify-center">
        <h1 className="text-3xl">Favorites</h1>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search favorites by property, location or user..."
          value={queryStates.q ?? ""}
          onChange={(e) => setQueryStates({ page: 1, q: e.target.value })}
          className="pl-10 mb-2"
        />
      </div>

      <FavoriteProperties />
    </div>
  );
}
