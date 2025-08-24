import { PropertyFilters } from "@/components/property/list/PropertyFilters";
import { PublicPropertiesList } from "@/components/property/list/PublicPropertiesList";
import { PropertiesListLoading } from "@/components/property/query-states/PropertiesListLoading";
import { Suspense } from "react";

export default async function PublicPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="container mx-auto py-8">
      <PropertyFilters showStatusFilter={false} />
      <Suspense fallback={<PropertiesListLoading />}>
        <PublicPropertiesList searchParams={params} showPages />
      </Suspense>
    </div>
  );
}
