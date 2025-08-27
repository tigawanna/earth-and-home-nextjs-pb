import { LazySinglePropertyMessagesShell } from "@/components/dashboard/messages/single-property/LazySinglePropertyMessagesShell";

interface SinglePropertyMessagesPageProps {
  params: Promise<{ property: string }>;
}
export default async function SinglePropertyMessagesPage({
  params,
}: SinglePropertyMessagesPageProps) {
  const property = (await params).property;
  console.log("Property ID:", property);
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      <LazySinglePropertyMessagesShell propertyId={property} />
    </section>
  );
}
