import { PropertyDashboard } from "@/components/property/dashboard/PropertyDashboard";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

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
  const params = await searchParams;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PropertyDashboard
        searchParams={params}
        // userId={session.user.id}
        showActions={true}
        showFavorite={false}
        title="My Properties"
        showStatusFilter={true}
        agentFilter={true} // Filter by user's properties only
      />
    </Suspense>
  );
}
