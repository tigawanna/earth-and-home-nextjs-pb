import { CopyButton } from "@/components/shared/CopyButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="animate-in fade-in-50 border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
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
            
            {/* Quick Actions - moved to header */}
            <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
              {user?.email && (
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group">
                    <a href={`mailto:${user.email}`}>
                      <Mail className="size-4 group-hover:text-primary transition-colors" />
                      Email
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
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group">
                    <a href={`tel:${user.phone}`}>
                      <Phone className="size-4 group-hover:text-primary transition-colors" />
                      Phone
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
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Agent Information Accordion */}
          <Accordion type="single" collapsible defaultValue="agent-details" className="w-full">
            <AccordionItem value="agent-details" className="border-none">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-4">
                Agent Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <Building2 className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Agency Name</p>
                      <p className="font-medium">{agent.agency_name || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Agent Name</p>
                      <p className="font-medium">{user?.name || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium">{user?.email || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">License Number</p>
                      <p className="font-medium">{agent.license_number || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Star className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Years Experience</p>
                      <p className="font-medium">{agent.years_experience ? `${agent.years_experience} years` : "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Service Areas</p>
                      <p className="font-medium">{agent.service_areas || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building2 className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Specialization</p>
                      <p className="font-medium capitalize">{agent.specialization || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* Profile Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span className="text-sm font-medium text-primary">Status</span>
              </div>
              <Badge className={agent.is_verified ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}>
                {agent.is_verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">Contact methods</span>
              </div>
              <span className="text-sm font-bold text-accent-foreground">
                {contactMethods} of 2
              </span>
            </div>
            
            <div className="p-4 bg-secondary/50 rounded-lg border border-secondary">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-secondary-foreground" />
                  <span className="text-sm font-medium text-secondary-foreground">
                    Profile complete
                  </span>
                </div>
                <span className="text-sm font-bold text-secondary-foreground">
                  {profilePercent}%
                </span>
              </div>
              <Progress value={profilePercent} className="h-2 bg-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
