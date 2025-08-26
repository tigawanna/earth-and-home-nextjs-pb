import { UserMessagesView } from "@/components/dashboard/messages/UserMessagesView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";
import { Loader2, MessageSquare } from "lucide-react";
import { Suspense } from "react";

export default async function UserMessagesPage() {
    const user = await getServerSideUser();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            My Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading your messages...</span>
            </div>
          }>
            <UserMessagesView user={user} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
