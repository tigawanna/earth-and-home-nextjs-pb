
import { ServersideSingleProperty } from "@/components/property/single/ServersideSingleProperty";
import { SinglePropertyLoadingFallback } from "@/components/property/single/single-property-query-states";
import { Suspense } from "react";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SinglePropertyPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <section className="w-full min-h-screen">
      <Suspense fallback={<SinglePropertyLoadingFallback />}>
        <ServersideSingleProperty propertyId={id} />
      </Suspense>
    </section>
  );
}
