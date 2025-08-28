import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Mail, Phone, User } from "lucide-react";
import Link from "next/link";

interface AgentCardProps {
  agent: AgentsResponse & { expand?: { user_id?: UsersResponse } };
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={`/dashboard/agents/${agent.id}`} className="hover:text-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{agent.name || "Unnamed Agent"}</CardTitle>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                {agent.expand?.user_id?.name || agent.expand?.user_id?.email || "Unknown User"}
              </div>
            </div>

            <Badge variant="secondary" className="text-xs">
              Agent
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {agent.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{agent.email}</span>
            </div>
          )}

          {agent.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{agent.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Created {new Date(agent.created).toLocaleDateString()}
            </span>
            {agent.expand?.user_id?.is_admin && (
              <Badge variant="outline" className="text-xs">
                Admin User
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
