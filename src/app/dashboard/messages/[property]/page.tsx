interface SinglePropertyMessagesPageProps {
  params: Promise<{ property: string }>;
}
export default async function SinglePropertyMessagesPage({
  params,
}: SinglePropertyMessagesPageProps) {
  const property = (await params).property;
  return (
    <section className="w-full h-full  flex flex-col items-center justify-center">
      {property}
    </section>
  );
}
