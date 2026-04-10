"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AgentsResponse, UsersResponse } from "@/types/domain-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownUp, Check, Search, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useTransition } from "react";
import ResponsivePagination from "react-responsive-pagination";

type PendingItem = { agent: AgentsResponse; user: UsersResponse };

type PendingAgentsResponse = {
  success?: boolean;
  items: PendingItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

async function fetchPending(
  search: string,
  page: number,
  sortOrder: "asc" | "desc",
): Promise<PendingAgentsResponse> {
  const params = new URLSearchParams({
    search,
    page: String(page),
    limit: "10",
    sortOrder,
  });
  const res = await fetch(`/api/admin/pending-agents?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

function AgentReviewTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
        <div className="flex flex-col gap-1.5 w-full sm:w-56 shrink-0">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[22%]">Agency</TableHead>
              <TableHead className="w-[26%]">Applicant</TableHead>
              <TableHead className="w-[14%]">License</TableHead>
              <TableHead className="w-[18%]">Submitted</TableHead>
              <TableHead className="text-right w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[85%]" />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-3 w-[90%]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex justify-end gap-2">
                    <Skeleton className="h-8 w-[5.5rem] rounded-md" />
                    <Skeleton className="h-8 w-[4.5rem] rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/50">
        <Skeleton className="h-4 w-56" />
        <div className="flex flex-col items-center gap-2 sm:items-end w-full sm:w-auto">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-48 max-w-full" />
        </div>
      </div>
    </div>
  );
}

export function AgentReviewList() {
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  const [queryState, setQueryState] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      sortOrder: parseAsString.withDefault("desc"),
    },
    {
      shallow: false,
      throttleMs: 400,
      startTransition,
    },
  );

  const search = queryState.search ?? "";
  const page = queryState.page ?? 1;
  const sortOrder =
    queryState.sortOrder === "asc" || queryState.sortOrder === "desc"
      ? queryState.sortOrder
      : "desc";

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["admin", "pending-agents", search, page, sortOrder],
    queryFn: () => fetchPending(search, page, sortOrder),
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

  const busy = approveMutation.isPending || rejectMutation.isPending;

  if (isLoading) {
    return <AgentReviewTableSkeleton rows={6} />;
  }

  if (error) {
    return <p className="text-sm text-destructive">Could not load applications.</p>;
  }

  const items: PendingItem[] = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.totalItems ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by agency, license, applicant name or email…"
            value={search}
            onChange={(e) => {
              setQueryState((prev) => ({
                ...prev,
                search: e.target.value || "",
                page: 1,
              }));
            }}
            className="pl-10 h-10 text-sm border-border/50 focus:border-primary rounded-lg"
            aria-label="Search agent applications"
          />
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-56 shrink-0">
          <Label htmlFor="agent-review-sort" className="text-xs text-muted-foreground flex items-center gap-1.5">
            <ArrowDownUp className="h-3.5 w-3.5" />
            Sort by submitted
          </Label>
          <Select
            value={sortOrder}
            onValueChange={(value) => {
              const next = value === "asc" || value === "desc" ? value : "desc";
              setQueryState((prev) => ({
                ...prev,
                sortOrder: next,
                page: 1,
              }));
            }}
          >
            <SelectTrigger id="agent-review-sort" className="h-10" aria-label="Sort by submission date">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            {search.trim()
              ? "No applications match your search."
              : "No pending agent applications."}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[22%]">Agency</TableHead>
                  <TableHead className="w-[26%]">Applicant</TableHead>
                  <TableHead className="w-[14%]">License</TableHead>
                  <TableHead className="w-[18%]">Submitted</TableHead>
                  <TableHead className="text-right w-[20%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(({ agent, user: applicant }) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium align-top">
                      {agent.agency_name || "—"}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-0.5">
                        <span>{applicant.name || "—"}</span>
                        <span className="text-xs text-muted-foreground">{applicant.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground align-top">
                      {agent.license_number?.trim() ? agent.license_number : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm align-top whitespace-nowrap">
                      {new Date(agent.created).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      <div className="inline-flex flex-row flex-nowrap items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="shrink-0"
                          disabled={busy}
                          onClick={() => approveMutation.mutate(agent.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="shrink-0"
                          disabled={busy}
                          onClick={() => rejectMutation.mutate(agent.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              {totalItems === 0
                ? "No results"
                : `Showing ${items.length} of ${totalItems} pending application${totalItems === 1 ? "" : "s"}`}
            </p>
            {totalItems > 0 ? (
              <div className="flex flex-col items-center gap-2 sm:items-end w-full sm:w-auto">
                <span className="text-xs text-muted-foreground tabular-nums">
                  Page {page} of {totalPages}
                </span>
                <div className="flex w-full justify-center sm:justify-end min-h-[2.25rem] items-center">
                  <ResponsivePagination
                    current={page}
                    total={totalPages}
                    onPageChange={(newPage) => {
                      setQueryState((prev) => ({ ...prev, page: newPage }));
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
