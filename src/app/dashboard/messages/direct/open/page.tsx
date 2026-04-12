import { drizzleGetOrCreateDirectConversationId } from "@/data-access-layer/messages/drizzle-direct-messages";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

interface OpenDirectConversationPageProps {
  searchParams: Promise<{ userId?: string }>;
}

export default async function OpenDirectConversationPage({
  searchParams,
}: OpenDirectConversationPageProps) {
  const user = await getServerSideUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const { userId: otherUserId } = await searchParams;
  if (!otherUserId || otherUserId === user.id) {
    redirect("/dashboard/messages");
  }

  const conversationId = await drizzleGetOrCreateDirectConversationId(user.id, otherUserId);
  redirect(`/dashboard/messages/direct/${conversationId}`);
}
