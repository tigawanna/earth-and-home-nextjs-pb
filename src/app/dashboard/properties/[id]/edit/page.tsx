import { EditProperty } from "@/components/dashboard/EditProperty";
import { AgentPendingModal } from "@/components/property/modals/AgentPendingModal";
import { AgentRejectedModal } from "@/components/property/modals/AgentRejectedModal";
import {
  SinglePropertyLoadingFallback,
  SinglePropertyNotFound,
} from "@/components/property/single/single-property-query-states";
import { getServerSidePropertyById } from "@/data-access-layer/properties/server-side-property-queries";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { canCreatePropertyListings } from "@/lib/agent/can-create-property-listings";
import { canManageProperty } from "@/lib/property/can-manage-property";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const { user, agent } = await getServerSideUserwithAgent();
  if (!user) {
    throw redirect("/auth/signin");
  }

  const { property } = await getServerSidePropertyById(id, user.id);

  if (!property) {
    return <SinglePropertyNotFound />;
  }

  if (!canManageProperty(user, agent, property)) {
    throw redirect("/dashboard/properties");
  }

  if (!canCreatePropertyListings(user, agent)) {
    if (!agent) {
      throw redirect(
        `/dashboard/agents/new?returnTo=${encodeURIComponent(`/dashboard/properties/${id}/edit`)}`,
      );
    }
    if (agent.approval_status === "pending") {
      return <AgentPendingModal open />;
    }
    if (agent.approval_status === "rejected") {
      return <AgentRejectedModal open />;
    }
    throw redirect("/dashboard");
  }
  if (!agent) {
    throw redirect(
      `/dashboard/agents/new?returnTo=${encodeURIComponent(`/dashboard/properties/${id}/edit`)}`,
    );
  }

  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      <Suspense fallback={<SinglePropertyLoadingFallback />}>
        <EditProperty id={id} user={user} agent={agent} property={property} />
      </Suspense>
    </section>
  );
}
