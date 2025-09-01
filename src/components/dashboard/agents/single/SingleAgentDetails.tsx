import { CopyButton } from "@/components/shared/CopyButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Building2, Calendar, CheckCircle, FileText, Mail, MapPin, Phone, Star, User } from "lucide-react";

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
  const user = agent.expand?.user_id;
  const avatarSrc = user?.avatar
    ? getImageThumbnailUrl(user, user.avatar, "96x96")
    : undefined;
  const contactMethods = [user?.email, user?.phone].filter(Boolean).length;
  const agencyDataFields = [
    agent.agency_name,
    agent.license_number,
    agent.specialization,
    agent.service_areas,
    agent.years_experience ? agent.years_experience.toString() : undefined
  ].filter(Boolean).length;
  const profilePercent = Math.round(
    (([user?.name, user?.email, user?.phone].filter(Boolean).length + agencyDataFields) / 8) * 100
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Overview */}
      <div className="lg:col-span-2">
        <Card className="animate-in fade-in-50 border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="size-20 ring-4 ring-background shadow-xl">
                  {avatarSrc ? (
                    <AvatarImage src={avatarSrc} alt={user?.name ?? "Agent avatar"} />
                  ) : (
                    <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {user?.name?.[0]?.toUpperCase() ?? agent.agency_name?.[0]?.toUpperCase() ?? "A"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-background shadow-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {agent.agency_name || "Unnamed Agency"}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 font-medium">
                    <Building2 className="w-3 h-3 mr-1" />
                    Property Agent
                  </Badge>
                  {agent.is_verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {agent.specialization && (
                    <Badge variant="outline" className="capitalize">
                      {agent.specialization}
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2 text-base">
                  Agent: {user?.name || user?.email || "Unknown Agent"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem icon={Building2} label="Agency Name" value={agent.agency_name} />
              <InfoItem icon={User} label="Agent Name" value={user?.name} />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem icon={Mail} label="Email Address" value={user?.email} />
              <InfoItem icon={Phone} label="Phone Number" value={user?.phone} />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem icon={FileText} label="License Number" value={agent.license_number} />
              <InfoItem 
                icon={Star} 
                label="Years Experience" 
                value={agent.years_experience ? `${agent.years_experience} years` : undefined} 
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem icon={MapPin} label="Service Areas" value={agent.service_areas} />
              <InfoItem 
                icon={Building2} 
                label="Specialization" 
                value={agent.specialization ? agent.specialization.charAt(0).toUpperCase() + agent.specialization.slice(1) : undefined} 
              />
            </div>
            <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Summary */}
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-accent/5 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Quick Contact
            </CardTitle>
            <CardDescription>Reach this agent instantly</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {user?.email && (
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="justify-between grow hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group">
                  <a href={`mailto:${user.email}`}>
                    <span className="flex items-center gap-2">
                      <Mail className="size-4 group-hover:text-primary transition-colors" />
                      Email
                    </span>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      Open
                    </span>
                  </a>
                </Button>
                <CopyButton
                  text={user.email}
                  label="Email"
                  size="sm"
                  variant="ghost"
                  toastMessage="Email copied"
                />
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="justify-between grow hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group">
                  <a href={`tel:${user.phone}`}>
                    <span className="flex items-center gap-2">
                      <Phone className="size-4 group-hover:text-primary transition-colors" />
                      Phone
                    </span>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      Open
                    </span>
                  </a>
                </Button>
                <CopyButton
                  text={user.phone}
                  label="Phone"
                  size="sm"
                  variant="ghost"
                  toastMessage="Phone number copied"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
              <span className="text-sm font-medium text-primary">Status</span>
              <Badge className={agent.is_verified ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}>
                {agent.is_verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
              <span className="text-sm font-medium text-accent-foreground">Contact methods</span>
              <span className="text-sm font-bold text-accent-foreground">
                {contactMethods} of 2
              </span>
            </div>
            <div className="space-y-3 p-3 bg-secondary/50 rounded-lg border border-secondary">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-foreground">
                  Profile complete
                </span>
                <span className="text-sm font-bold text-secondary-foreground">
                  {profilePercent}%
                </span>
              </div>
              <Progress value={profilePercent} className="h-2 bg-secondary" />
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
    <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 hover:shadow-md transition-all duration-200 group">
      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        <Icon className="size-4 text-primary group-hover:scale-110 transition-transform" />
        {label}
      </label>
      <p className="text-lg font-semibold truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
        {value || "Not provided"}
      </p>
    </div>
  );
}
