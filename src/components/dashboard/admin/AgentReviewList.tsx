"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgentsResponse, UsersResponse } from "@/types/domain-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";

type PendingItem = { agent: AgentsResponse; user: UsersResponse };

async function fetchPending(): Promise<PendingItem[]> {
  const res = await fetch("/api/admin/pending-agents");
  if (!res.ok) throw new Error("Failed to load");
  const json = (await res.json()) as { success?: boolean; items?: PendingItem[] };
  return json.items ?? [];
}

export function AgentReviewList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "pending-agents"],
    queryFn: fetchPending,
  });

  const approveMutation = useMutation({
    mutationFn: async (agentId: string) => {
      const res = await fetch(`/api/admin/agents/${agentId}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Approve failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-agents"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (agentId: string) => {
      const res = await fetch(`/api/admin/agents/${agentId}/reject`, { method: "POST" });
      if (!res.ok) throw new Error("Reject failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-agents"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading applications…
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Could not load applications.</p>;
  }

  const items: PendingItem[] = data ?? [];

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          No pending agent applications.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(({ agent, user: applicant }) => (
        <Card key={agent.id}>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-lg">{agent.agency_name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {applicant.name} · {applicant.email}
              </p>
              {agent.license_number ? (
                <p className="text-xs text-muted-foreground mt-1">License: {agent.license_number}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                size="sm"
                variant="default"
                disabled={approveMutation.isPending || rejectMutation.isPending}
                onClick={() => approveMutation.mutate(agent.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={approveMutation.isPending || rejectMutation.isPending}
                onClick={() => rejectMutation.mutate(agent.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Deny
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
