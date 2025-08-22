import { EditProperty } from "@/components/property/dashboard/EditProperty";
import { SinglePropertyLoadingFallback } from "@/components/property/single/single-property-query-states";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/properties/$id/edit")({
  component: EditPropertyPage,
});

function EditPropertyPage() {
  const { id } = Route.useParams();
  
  return (
    <section className="w-full h-full flex flex-col items-center justify-center">
      <Suspense fallback={<SinglePropertyLoadingFallback />}>
        <EditProperty id={id} />
      </Suspense>
    </section>
  );
}
