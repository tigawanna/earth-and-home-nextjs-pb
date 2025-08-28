import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSingleAgent } from "@/data-access-layer/admin/agents-management";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AgentProfilePage() {
  const user = await getServerSideUser();
  if (!user) {
    return redirect("/auth/signin");
  }

  // Try to find agent profile for this user
  let userAgent = null;
  try {
    const agentResult = await getSingleAgent(user.id);
    if (agentResult.success) {
      userAgent = agentResult.result;
    }
  } catch (error) {
    // User doesn't have an agent profile
  }

  if (userAgent) {
    return redirect(`/dashboard/agents/${userAgent.id}`);
  }

  return (
    <section className="w-full h-full flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Agent Profile</h1>
            <p className="text-muted-foreground">Create your agent profile</p>
          </div>
        </div>

        {/* No Agent Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No Agent Profile Found</CardTitle>
            <CardDescription>
              You don't have an agent profile yet. Agent profiles are required to list and manage properties.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              An agent profile includes your contact information and professional details that will be visible to potential clients.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user.is_admin ? (
                <Link href="/dashboard/agents/new">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Agent Profile
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Please contact an administrator to create your agent profile.
                  </p>
                  <Button variant="outline" disabled>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Admin Access Required
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
