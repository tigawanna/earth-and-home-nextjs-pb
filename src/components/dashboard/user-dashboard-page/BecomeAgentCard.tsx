import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import Link from "next/link";

const becomeAgentHref = `/dashboard/agents/new?returnTo=${encodeURIComponent("/dashboard")}`;

export function BecomeAgentCard() {
  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg">Become a property agent</CardTitle>
          <CardDescription>
            Create your agent profile to list properties and reach buyers on Earth & Home.
          </CardDescription>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link href={becomeAgentHref}>
            <UserPlus className="mr-2 h-4 w-4" />
            Get started
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
}
