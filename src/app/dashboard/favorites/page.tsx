import { FavoritesDashboard } from "../../../components/property/FavoritesDashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading favorites...</span>
      </CardContent>
    </Card>
  );
}

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const params = await searchParams;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <FavoritesDashboard
        searchParams={params}
        userId={session.user.id}
      />
    </Suspense>
  );
}
