import { AgentsList } from "@/components/dashboard/agents/AgentsList";
import { getServerSideAgents } from "@/data-access-layer/admin/agents-management";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function AgentsPage() {
  const user = await getServerSideUser();
  if (!user) {
    return redirect("/auth/signin");
  }
  if (!user.is_admin) {
    return redirect("/dashboard");
  }

  // Fetch agents with expanded user data
  const agentsResult = await getServerSideAgents({
    limit: 100, // Fetch all agents for now
  });

  const agents = agentsResult.success ? agentsResult.result?.items || [] : [];

  return (
    <section className="w-full h-full flex flex-col">
      <AgentsList 
        initialAgents={agents} 
        currentUser={{ is_admin: user.is_admin, id: user.id }}
      />
    </section>
  );
}
