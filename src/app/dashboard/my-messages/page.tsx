import { UserConversationView } from "@/components/dashboard/messages/UserConversationView";
import { getServerSideUser } from "@/data-access-layer/pocketbase/user/server-side-auth";
import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { UserConversations } from "../conversations/UserConversations";

export default async function UserMessagesPage() {
  const user = await getServerSideUser();
  
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        <h1 className="text-2xl font-bold">My Messages</h1>
        <p className="text-muted-foreground ml-4">
          Your property conversations
        </p>
      </div>
      <UserConversations/>

    </div>
  );
}
