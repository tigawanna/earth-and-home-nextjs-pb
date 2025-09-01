import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Building2, CheckCircle, Mail, MapPin, Phone, Star, User } from "lucide-react";
import Link from "next/link";

interface AgentCardProps {
  agent: AgentsResponse & { expand?: { user_id?: UsersResponse } };
}

export function AgentCard({ agent }: AgentCardProps) {
  const user = agent.expand?.user_id;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={`/dashboard/agents/${agent.id}`} className="hover:text-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg">{agent.agency_name || "Unnamed Agency"}</CardTitle>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                {user?.name || user?.email || "Unknown Agent"}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className="text-xs">
                Agent
              </Badge>
              {agent.is_verified && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {agent.specialization && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{agent.specialization}</span>
            </div>
          )}

          {user?.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{user.email}</span>
            </div>
          )}

          {user?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}

          {agent.service_areas && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{agent.service_areas}</span>
            </div>
          )}

          {typeof agent.years_experience === 'number' && agent.years_experience > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>{agent.years_experience} years experience</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Created {new Date(agent.created).toLocaleDateString()}
            </span>
            {user?.is_admin && (
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
