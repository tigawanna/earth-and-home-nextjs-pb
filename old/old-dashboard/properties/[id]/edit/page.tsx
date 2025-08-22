import { EditProperty } from "@/components/property/dashboard/EditProperty";
import { SinglePropertyLoadingFallback } from "@/components/property/single/single-property-query-states";
import { Suspense } from "react";


interface EditPropertyPageProps {
  params: { id: string };
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      <Suspense fallback={<SinglePropertyLoadingFallback />}>
        <EditProperty id={id} />
      </Suspense>
    </section>
  );
}
