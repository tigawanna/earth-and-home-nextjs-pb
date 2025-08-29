import { EditAgentModal } from "@/components/dashboard/agents/forms/EditAgentModal";
import { SingleAgentDetails } from "@/components/dashboard/agents/single/SingleAgentDetails";
import { PropertyDashboard } from "@/components/property/PropertyDashboard";
import { Button } from "@/components/ui/button";
import { getSingleAgent } from "@/data-access-layer/admin/agents-management";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SingleAgentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SingleAgentPage({ params, searchParams }: SingleAgentPageProps) {
  const { user } = await getServerSideUserwithAgent();
  if (!user) {
    throw redirect("/auth/signin");
  }

  const agentId = (await params).id;
  const sp = await searchParams;

  // Fetch the specific agent
  const agentResult = await getSingleAgent(agentId);

  if (!agentResult.success || !agentResult.result) {
    throw redirect("/dashboard/agents");
  }

  const agent = agentResult.result;

  // // Check if user has permission to view this agent
  // if (!user.is_admin && user.id !== agent.user_id) {
  //   throw redirect("/dashboard/agents");
  // }

  return (
    <section className="w-full h-full flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/agents">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agents
              </Button>
            </Link>
          </div>

          {(user.is_admin || user.id === agent.user_id) && (
            <EditAgentModal agent={agent} currentUser={user} />
          )}
        </div>

        {/* Agent Details */}
        <SingleAgentDetails agent={agent} />
      </div>
      <PropertyDashboard user={user} searchParams={sp} agentId={agentId} />
    </section>
  );
}
