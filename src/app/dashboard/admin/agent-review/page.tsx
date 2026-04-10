import { AgentReviewList } from "@/components/dashboard/admin/AgentReviewList";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

export default async function AgentReviewPage() {
  const user = await getServerSideUser();
  if (!user) {
    throw redirect("/auth/signin");
  }
  if (!user.is_admin) {
    throw redirect("/dashboard");
  }

  return (
    <section className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent applications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve or deny requests to list properties as an agent.
        </p>
      </div>
      <AgentReviewList />
    </section>
  );
}
