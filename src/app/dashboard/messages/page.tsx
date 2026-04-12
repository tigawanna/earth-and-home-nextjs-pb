import { LazyAllPropertiesMessages } from "@/components/dashboard/messages/all-properties/LazyAllPropertiesMessages";
import { LazyDirectConversationsList } from "@/components/dashboard/messages/direct/LazyDirectConversationsList";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { MessageSquare, Users } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const user = await getServerSideUser();

  if (!user) {
    redirect("/auth/signin");
  }
  return (
    <div className="container mx-auto py-6 space-y-10">
      <div className="flex flex-wrap items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground ml-0 sm:ml-4 w-full sm:w-auto">
          Property inquiries and direct chats with agents
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Direct messages</h2>
        </div>
        <LazyDirectConversationsList />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Property inquiries</h2>
        <LazyAllPropertiesMessages />
      </section>
    </div>
  );
}
