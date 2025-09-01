import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSideAgents } from "@/data-access-layer/admin/agents-management";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AgentCard } from "./AgentCard";
import { AgentsSearch } from "./AgentsSearch";

interface AgentsListProps {
  currentUser: UsersResponse;
  searchQuery?: string;
}

async function AgentsGrid({ searchQuery }: { searchQuery?: string }) {
  const agentsResult = await getServerSideAgents({
    q: searchQuery,
    limit: 50,
  });

  const agents = agentsResult.success ? agentsResult.result?.items || [] : [];

  if (agents.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? "No matching agents found" : "No Agents Found"}
          </h3>
          <p className="text-muted-foreground text-center">
            {searchQuery ? "Try adjusting your search terms." : "No agents have been created yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </>
  );
}

export function AgentsGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function AgentsList({ currentUser, searchQuery }: AgentsListProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 @container">
      <AgentsSearch currentUser={currentUser} />

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={<AgentsGridSkeleton />}>
          <AgentsGrid searchQuery={searchQuery} />
        </Suspense>
      </div>
    </div>
  );
}
