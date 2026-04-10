import PropertyForm from "@/components/property/form/PropertyForm";
import { AgentPendingModal } from "@/components/property/modals/AgentPendingModal";
import { AgentRejectedModal } from "@/components/property/modals/AgentRejectedModal";
import { AgentRequiredModal } from "@/components/property/modals/AgentRequiredModal";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { canCreatePropertyListings } from "@/lib/agent/can-create-property-listings";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const { user, agent } = await getServerSideUserwithAgent();
  if (!user) {
    throw redirect("/auth/signin");
  }
  if (!canCreatePropertyListings(user, agent)) {
    if (!agent) {
      return <AgentRequiredModal open />;
    }
    if (agent.approval_status === "pending") {
      return <AgentPendingModal open />;
    }
    if (agent.approval_status === "rejected") {
      return <AgentRejectedModal open />;
    }
    return <AgentRequiredModal open />;
  }
  if (!agent) {
    return <AgentRequiredModal open />;
  }
  return (
    <div className="container max-w-4xl mx-auto">
      <PropertyForm isEdit={false} user={user} agent={agent} />
    </div>
  );
}
