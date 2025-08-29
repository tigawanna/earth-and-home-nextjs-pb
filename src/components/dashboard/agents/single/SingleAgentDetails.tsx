import { CopyButton } from "@/components/shared/CopyButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Calendar, Mail, Phone, User, UserCheck } from "lucide-react";

interface SingleAgentDetailsProps {
  agent: AgentsResponse & {
    expand?:
      | {
          user_id?: UsersResponse | undefined;
        }
      | undefined;
  };
}

export function SingleAgentDetails({ agent }: SingleAgentDetailsProps) {
  const associatedUser = agent.expand?.user_id;
  const avatarSrc = agent.avatar
    ? getImageThumbnailUrl(agent, agent.avatar, "96x96")
    : undefined;
  const contactMethods = [agent.email, agent.phone].filter(Boolean).length;
  const profilePercent = Math.round(
    ([agent.name, agent.email, agent.phone].filter(Boolean).length / 3) * 100
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Overview */}
      <div className="lg:col-span-2">
        <Card className="animate-in fade-in-50">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                {avatarSrc ? (
                  <AvatarImage src={avatarSrc} alt={agent.name ?? "Agent avatar"} />
                ) : (
                  <AvatarFallback className="text-sm">{agent.name?.[0]?.toUpperCase() ?? "A"}</AvatarFallback>
                )}
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 text-xl">
                  {agent.name || "Unnamed Agent"}
                  <Badge variant="secondary" className="ml-1">
                    Agent Profile
                  </Badge>
                </CardTitle>
                <CardDescription className="truncate">
                  {associatedUser?.email || associatedUser?.name || "No linked user"}
                </CardDescription>
              </div>
              {/* actions reduced: moved to Quick contact card */}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem icon={User} label="Full Name" value={agent.name} />
              <InfoItem
                icon={UserCheck}
                label="Associated User"
                value={associatedUser?.name || associatedUser?.email || "Unknown"}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem icon={Mail} label="Email Address" value={agent.email} />
              <InfoItem icon={Phone} label="Phone Number" value={agent.phone} />
            </div>
            <Separator />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick contact</CardTitle>
            <CardDescription>Reach this agent fast</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {agent.email && (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="justify-between grow">
                  <a href={`mailto:${agent.email}`}>
                    <span className="flex items-center gap-2"><Mail className="size-4" /> Email</span>
                    <span className="text-muted-foreground">Open</span>
                  </a>
                </Button>
                <CopyButton
                  text={agent.email}
                  label="Email"
                  size="sm"
                  variant="ghost"
                  toastMessage="Email copied"
                />
              </div>
            )}
            {agent.phone && (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="justify-between grow">
                  <a href={`tel:${agent.phone}`}>
                    <span className="flex items-center gap-2"><Phone className="size-4" /> Phone</span>
                    <span className="text-muted-foreground">Open</span>
                  </a>
                </Button>
                <CopyButton
                  text={agent.phone}
                  label="Phone"
                  size="sm"
                  variant="ghost"
                  toastMessage="Phone number copied"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="bg-primary/15 text-primary border-transparent">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Contact methods</span>
              <span className="text-sm font-medium">{contactMethods} of 2</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile complete</span>
                <span className="text-sm font-medium">{profilePercent}%</span>
              </div>
              <Progress value={profilePercent} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type IconType = typeof User;

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </label>
      <p className="truncate text-lg font-semibold">{value || "Not provided"}</p>
    </div>
  );
}
