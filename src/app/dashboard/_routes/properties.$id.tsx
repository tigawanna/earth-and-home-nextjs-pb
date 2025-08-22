import { ClientSideSingleProperty } from "@/components/property/single/ClientSideSingleProperty";
import { SinglePropertyLoadingFallback } from "@/components/property/single/single-property-query-states";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/properties/$id")({
  component: SinglePropertyPage,
});

function SinglePropertyPage() {
  const { id } = Route.useParams();
  
  return (
    <section className="w-full min-h-screen">
      <Suspense fallback={<SinglePropertyLoadingFallback />}>
        <ClientSideSingleProperty propertyId={id} />
      </Suspense>
    </section>
  );
}
