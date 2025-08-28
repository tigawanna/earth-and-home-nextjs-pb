import { EditAgentModal } from "@/components/dashboard/agents/EditAgentModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSingleAgent } from "@/data-access-layer/admin/agents-management";
import { getServerSideUserwithAgent } from "@/data-access-layer/user/server-side-auth";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SingleAgentPageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleAgentPage({ params }: SingleAgentPageProps) {
  const { user, agent: userAgent } = await getServerSideUserwithAgent();
  if (!user) {
    return redirect("/auth/signin");
  }

  const agentId = (await params).id;
  
  // Fetch the specific agent
  const agentResult = await getSingleAgent(agentId);
  
  if (!agentResult.success || !agentResult.result) {
    return redirect("/dashboard/agents");
  }

  const agent = agentResult.result;
  
  // Check if user has permission to view this agent
  if (!user.is_admin && user.id !== agent.user_id) {
    return redirect("/dashboard/agents");
  }

  return (
    <section className="w-full h-full flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/agents">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agents
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{agent.name || "Unnamed Agent"}</h1>
              <p className="text-muted-foreground">Agent Profile Details</p>
            </div>
          </div>
          
          {(user.is_admin || user.id === agent.user_id) && (
            <EditAgentModal agent={agent} />
          )}
        </div>

        {/* Agent Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Agent Information
                </CardTitle>
                <CardDescription>
                  Complete profile details for this agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-medium">{agent.name || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Associated User</label>
                    <p className="text-lg font-medium">
                      {agent.expand?.user_id?.name || agent.expand?.user_id?.email || "Unknown User"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{agent.email || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{agent.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Agent Status</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                
                {agent.expand?.user_id?.is_admin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">User Type</span>
                    <Badge variant="outline">Admin User</Badge>
                  </div>
                )}
                
                {agent.expand?.user_id?.verified && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">User Verified</span>
                    <Badge variant="default">Verified</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(agent.created).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{new Date(agent.updated).toLocaleString()}</p>
                </div>
                
                {agent.expand?.user_id && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Registered</label>
                    <p className="text-sm">{new Date(agent.expand.user_id.created).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
