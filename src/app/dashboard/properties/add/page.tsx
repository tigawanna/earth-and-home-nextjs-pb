import PropertyForm from "@/components/property/form/PropertyForm";
import { AgentRequiredModal } from "@/components/property/modals/AgentRequiredModal";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function NewPropertyPage() {
  const { user, agent } = await getServerSideUserwithAgent();
  // console.log("User:", user);
  // console.log("Agent:", agent);
  if (!user) {
    throw redirect("/auth/signin");
  }
  if (!agent) {
    // throw redirect("/dashboard/agents");
    return <AgentRequiredModal open/>
  }
 return (
    <div className="container max-w-4xl mx-auto">
      <PropertyForm isEdit={false} user={user} agent={agent} />
    </div>
  );
}
