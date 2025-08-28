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

  console.log({ messageId });

  const user = await getServerSideUser();
  if (!messageId) {
    return redirect("/dashboard");
  }
  if (!user) {
    return redirect("/auth/signin");
  }
  const messageParentRResponse = await getSinglePropertyMessage({
    msgId: messageId,
  });

  const messageParent = messageParentRResponse.result;
  if (!messageParent) {
    return redirect("/dashboard");
  }

  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      <LazySinglePropertyMessagesShell
        propertyId={messageParent.property_id}
        user={user}
        messageParent={messageParent}
      />
    </section>
  );
}
