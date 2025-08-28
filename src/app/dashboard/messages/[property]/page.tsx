import { LazySinglePropertyMessagesShell } from "@/components/dashboard/messages/single-property/LazySinglePropertyMessagesShell";
import { getServerSideUser } from "@/data-access-layer/user/server-side-auth";
import { redirect } from "next/navigation";

interface SinglePropertyMessagesPageProps {
  params: Promise<{ property: string }>;
}
export default async function SinglePropertyMessagesPage({
  params,
}: SinglePropertyMessagesPageProps) {
  const property = (await params).property;
  const user = await getServerSideUser();

  if (!user) {
    redirect("/auth/signin");
  }
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      <LazySinglePropertyMessagesShell propertyId={property} user={user} />
    </section>
  );
}
