import { LazySinglePropertyMessagesShell } from "@/components/dashboard/messages/single-property/LazySinglePropertyMessagesShell";
import { getSinglePropertyMessage } from "@/data-access-layer/messages/server-side-messages";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

interface SinglePropertyMessagesPageProps {
  params: Promise<{ msg: string }>;
}
export default async function SinglePropertyMessagesPage({
  params,
}: SinglePropertyMessagesPageProps) {
  const messageId = (await params).msg;



  const user = await getServerSideUser();
  if (!messageId) {
    throw redirect("/dashboard");
  }
  if (!user) {
    throw redirect("/auth/signin");
  }
  const messageParentRResponse = await getSinglePropertyMessage({
    msgId: messageId,
  });

  const messageParent = messageParentRResponse.result;
  if (!messageParent) {
    throw redirect("/dashboard");
  }

  return (
    <section className="w-full h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">
            {messageParent.expand?.property_id?.title || "Property Message Thread"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Message from {messageParent.expand?.user_id?.username} •{" "}
          {messageParent.expand?.user_id?.email} •{" "}
            {messageParent.type === "parent" ? " Original Message" : " Reply Thread"}
          </p>
        </div>
      </div>
      
      {/* Chat Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <LazySinglePropertyMessagesShell
          propertyId={messageParent.property_id}
          user={user}
          messageParent={messageParent}
        />
      </div>
    </section>
  );
}
