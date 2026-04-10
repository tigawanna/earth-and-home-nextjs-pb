import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function AgentPendingBanner() {
  return (
    <Card className="border-amber-500/40 bg-amber-500/5">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <CardTitle className="text-base">Application under review</CardTitle>
          <CardDescription>
            Your agent request is pending admin approval. You will be able to add property listings
            after you are approved.
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
