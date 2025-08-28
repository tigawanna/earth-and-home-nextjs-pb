import { AgentForm } from "@/components/dashboard/agents/AgentsForm";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function NewAgentPage() {
  const user = await getServerSideUser();
  if (!user) {
    return redirect("/auth/signin");
  }
  if (!user.is_admin) {
    return redirect("/dashboard");
  }

  return (
    <section className="w-full h-full flex flex-col">
      <AgentForm 
        currentUser={{ is_admin: user.is_admin, id: user.id }}
      />
    </section>
  );
}
