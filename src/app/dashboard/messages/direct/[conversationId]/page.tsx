import { DirectMessageThread } from "@/components/dashboard/messages/direct/DirectMessageThread";
import { drizzleGetDirectConversationContext } from "@/data-access-layer/messages/drizzle-direct-messages";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface DirectConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function DirectConversationPage({ params }: DirectConversationPageProps) {
  const user = await getServerSideUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const { conversationId } = await params;
  const ctx = await drizzleGetDirectConversationContext(conversationId, user.id);
  if (!ctx) {
    redirect("/dashboard/messages");
  }

  return (
    <section className="w-full min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="container mx-auto flex flex-col gap-2">
          <Link
            href="/dashboard/messages"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            All messages
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{ctx.other_user.name}</h1>
            <p className="text-sm text-muted-foreground">{ctx.other_user.email}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex-1 flex flex-col py-4 px-4">
        <DirectMessageThread conversationId={conversationId} currentUserId={user.id} />
      </div>
    </section>
  );
}
