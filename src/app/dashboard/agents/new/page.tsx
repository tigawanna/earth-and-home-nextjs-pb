import { AgentForm } from "@/components/dashboard/agents/forms/AgentForm";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function NewAgentPage() {
  const { user, agent } = await getServerSideUserwithAgent();
  if (!user) {
    throw redirect("/auth/signin");
  }
  if (!user.is_admin && agent && agent.approval_status !== "rejected") {
    throw redirect("/dashboard/agents");
  }

  return (
    <section className="w-full h-full flex flex-col">
      <Suspense fallback={null}>
        <AgentForm
          currentUser={user}
          initialAgent={agent && agent.approval_status === "rejected" ? agent : undefined}
        />
      </Suspense>
    </section>
  );
}
