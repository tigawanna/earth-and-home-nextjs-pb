import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import Link from "next/link";

const resubmitHref = `/dashboard/agents/new?returnTo=${encodeURIComponent("/dashboard")}`;

export function AgentRejectedBanner() {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">Application not approved</CardTitle>
          <CardDescription>
            Your agent application was not approved. Update your details and submit again for
            review.
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href={resubmitHref}>
            <UserPlus className="mr-2 h-4 w-4" />
            Resubmit
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
}
