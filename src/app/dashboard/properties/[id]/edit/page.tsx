import { EditProperty } from "@/components/dashboard/EditProperty";
import {
    SinglePropertyLoadingFallback,
    SinglePropertyNotFound,
} from "@/components/property/single/single-property-query-states";
import { baseGetPropertyById } from "@/data-access-layer/properties/base-property-queries";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const { user, agent, client } = await getServerSideUserwithAgent();
  if (!user) {
    throw redirect("/auth/signin");
  }
  if (!agent) {
    throw redirect("/dashboard/agents/new");
  }

  const { result: property } = await baseGetPropertyById({
    client,
    propertyId: id,
    userId: user.id,
  });

  if (!property) {
    return <SinglePropertyNotFound />;
  }
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      <Suspense fallback={<SinglePropertyLoadingFallback />}>
        <EditProperty id={id} user={user} agent={agent} property={property} />
      </Suspense>
    </section>
  );
}
