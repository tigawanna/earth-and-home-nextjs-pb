
import { PropertyDashboard } from "../../../components/property/PropertyDashboard";
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
        <span>Loading properties...</span>
      </CardContent>
    </Card>
  );
}

export default async function PropertiesPage({
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
      <PropertyDashboard
        searchParams={params}
        userId={session.user.id}
        showActions={true}
        showFavorite={false}
        title="My Properties"
        showStatusFilter={true}
        agentFilter={true} // Filter by user's properties only
      />
    </Suspense>
  );
}
