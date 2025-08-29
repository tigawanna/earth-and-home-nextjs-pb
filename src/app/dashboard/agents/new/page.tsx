import { AgentForm } from "@/components/dashboard/agents/forms/AgentForm";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function NewAgentPage() {
  const user = await getServerSideUser();
  if (!user) {
    throw redirect("/auth/signin");
  }
  if (!user.is_admin) {
    throw redirect("/dashboard");
  }

  return (
    <section className="w-full h-full flex flex-col">
      <AgentForm 
        currentUser={user}
      />
    </section>
  );
}
