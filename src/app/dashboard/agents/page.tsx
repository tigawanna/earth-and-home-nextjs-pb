import { AgentsGridSkeleton, AgentsList } from "@/components/dashboard/agents/list/AgentsList";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface AgentsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const user = await getServerSideUser();
  if (!user) {
    throw redirect("/auth/signin");
  }
  if (!user.is_admin) {
    throw redirect("/dashboard");
  }

  const { q: searchQuery } = await searchParams;

  return (
    <section className="w-full h-full flex flex-col">
      <Suspense fallback={<AgentsGridSkeleton />}>
        <AgentsList currentUser={user} searchQuery={searchQuery} />
      </Suspense>
    </section>
  );
}
