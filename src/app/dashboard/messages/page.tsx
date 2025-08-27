import { LazyAllPropertiesMessages } from "@/components/dashboard/messages/LazyAllPropertiesMessages";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const user = await getServerSideUser();

  if (!user) {
    redirect("/auth/signin");
  }
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Property Messages</h1>
        <p className="text-muted-foreground ml-4">Manage conversations about properties</p>
      </div>
      <LazyAllPropertiesMessages />
    </div>
  );
}
